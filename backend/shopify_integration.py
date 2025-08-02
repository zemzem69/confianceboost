"""
Shopify Integration for ConfianceBoost
Handles order verification and user access management
"""

import hmac
import hashlib
import base64
import json
import requests
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import os
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

# Shopify configuration (to be set in .env)
SHOPIFY_STORE_URL = os.environ.get('SHOPIFY_STORE_URL', '')  # https://your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN = os.environ.get('SHOPIFY_ACCESS_TOKEN', '')
SHOPIFY_WEBHOOK_SECRET = os.environ.get('SHOPIFY_WEBHOOK_SECRET', '')

class ShopifyOrder(BaseModel):
    """Shopify order model"""
    id: int
    email: str
    name: str
    order_number: str
    financial_status: str
    fulfillment_status: Optional[str] = None
    total_price: str
    created_at: str
    customer: Dict[str, Any]
    line_items: list

class ShopifyCustomer(BaseModel):
    """Shopify customer model"""
    id: int
    email: str
    first_name: str
    last_name: str
    created_at: str

def verify_shopify_webhook(data: bytes, signature: str) -> bool:
    """
    Verify Shopify webhook signature
    """
    if not SHOPIFY_WEBHOOK_SECRET:
        logger.warning("SHOPIFY_WEBHOOK_SECRET not configured")
        return False
    
    try:
        computed_signature = base64.b64encode(
            hmac.new(
                SHOPIFY_WEBHOOK_SECRET.encode('utf-8'),
                data,
                digestmod=hashlib.sha256
            ).digest()
        ).decode('utf-8')
        
        return hmac.compare_digest(computed_signature, signature)
    except Exception as e:
        logger.error(f"Error verifying webhook signature: {e}")
        return False

async def verify_shopify_order(order_number: str, email: str) -> Optional[Dict]:
    """
    Verify if an order exists in Shopify and is paid
    """
    if not SHOPIFY_STORE_URL or not SHOPIFY_ACCESS_TOKEN:
        logger.error("Shopify credentials not configured")
        return None
    
    try:
        # Search for order by name (order number)
        url = f"{SHOPIFY_STORE_URL}/admin/api/2023-10/orders.json"
        headers = {
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json'
        }
        params = {
            'name': f"#{order_number}",
            'status': 'any',
            'financial_status': 'paid'
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            orders = data.get('orders', [])
            
            for order in orders:
                if order.get('email', '').lower() == email.lower():
                    # Check if order contains ConfianceBoost product
                    line_items = order.get('line_items', [])
                    for item in line_items:
                        if 'confianceboost' in item.get('name', '').lower() or 'confiance' in item.get('name', '').lower():
                            return {
                                'order_id': order['id'],
                                'order_number': order['name'],
                                'email': order['email'],
                                'customer_name': f"{order.get('billing_address', {}).get('first_name', '')} {order.get('billing_address', {}).get('last_name', '')}".strip(),
                                'total_price': order['total_price'],
                                'created_at': order['created_at'],
                                'financial_status': order['financial_status'],
                                'valid': True
                            }
            
        return None
        
    except Exception as e:
        logger.error(f"Error verifying Shopify order: {e}")
        return None

async def get_shopify_customer_info(email: str) -> Optional[Dict]:
    """
    Get customer information from Shopify
    """
    if not SHOPIFY_STORE_URL or not SHOPIFY_ACCESS_TOKEN:
        return None
    
    try:
        url = f"{SHOPIFY_STORE_URL}/admin/api/2023-10/customers/search.json"
        headers = {
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json'
        }
        params = {'query': f'email:{email}'}
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            customers = data.get('customers', [])
            
            if customers:
                customer = customers[0]
                return {
                    'id': customer['id'],
                    'email': customer['email'],
                    'first_name': customer['first_name'],
                    'last_name': customer['last_name'],
                    'created_at': customer['created_at'],
                    'total_spent': customer.get('total_spent', '0.00'),
                    'orders_count': customer.get('orders_count', 0)
                }
        
        return None
        
    except Exception as e:
        logger.error(f"Error getting Shopify customer info: {e}")
        return None

def format_order_number(order_input: str) -> str:
    """
    Format order number to match Shopify format
    """
    order_input = order_input.strip()
    
    # If it already starts with #, return as is
    if order_input.startswith('#'):
        return order_input
    
    # If it's just numbers, add # prefix
    if order_input.isdigit():
        return f"#{order_input}"
    
    # Otherwise return as is
    return order_input

async def create_shopify_user_access(order_data: Dict) -> Dict:
    """
    Create user access based on Shopify order
    """
    from database import users_collection
    
    user_data = {
        "id": f"shopify_{order_data['order_id']}",
        "name": order_data['customer_name'] or "Client ConfianceBoost",
        "email": order_data['email'],
        "enrollmentDate": datetime.utcnow(),
        "completedModules": 0,
        "totalProgress": 0,
        "certificates": 0,
        "shopify_order_id": order_data['order_id'],
        "shopify_order_number": order_data['order_number'],
        "purchase_price": order_data['total_price'],
        "purchase_date": datetime.fromisoformat(order_data['created_at'].replace('Z', '+00:00')),
        "access_type": "shopify_purchase",
        "access_granted": True
    }
    
    # Check if user already exists
    existing_user = await users_collection.find_one({
        "$or": [
            {"email": order_data['email']},
            {"shopify_order_id": order_data['order_id']}
        ]
    })
    
    if existing_user:
        # Update existing user with Shopify data
        await users_collection.update_one(
            {"_id": existing_user["_id"]},
            {"$set": {
                "shopify_order_id": order_data['order_id'],
                "shopify_order_number": order_data['order_number'],
                "access_granted": True,
                "purchase_date": user_data['purchase_date']
            }}
        )
        return existing_user
    else:
        # Create new user
        await users_collection.insert_one(user_data)
        return user_data

async def validate_shopify_access(email: str, order_number: str) -> Dict:
    """
    Validate Shopify purchase and grant access
    """
    try:
        # Format order number
        formatted_order = format_order_number(order_number)
        
        # Verify order with Shopify
        order_data = await verify_shopify_order(formatted_order.replace('#', ''), email)
        
        if not order_data:
            return {
                "valid": False,
                "error": "Order not found or not paid",
                "message": "Nous n'avons pas trouvé votre commande ou elle n'est pas encore payée."
            }
        
        # Create or update user access
        user = await create_shopify_user_access(order_data)
        
        return {
            "valid": True,
            "user": user,
            "order": order_data,
            "message": "Accès accordé avec succès !"
        }
        
    except Exception as e:
        logger.error(f"Error validating Shopify access: {e}")
        return {
            "valid": False,
            "error": "Validation error",
            "message": "Erreur lors de la validation de votre achat."
        }

# Email templates for Shopify integration
WELCOME_EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bienvenue dans ConfianceBoost !</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #000000, #1a1a1a); padding: 40px; border-radius: 20px; text-align: center;">
        <h1 style="color: #FFD700; font-size: 32px; margin-bottom: 20px;">🎉 Bienvenue dans ConfianceBoost !</h1>
        
        <p style="color: #ffffff; font-size: 18px; margin-bottom: 30px;">
            Félicitations ! Votre paiement a été confirmé et votre accès à la formation premium est maintenant activé.
        </p>
        
        <div style="background: rgba(255, 215, 0, 0.1); padding: 20px; border-radius: 10px; margin: 30px 0;">
            <h3 style="color: #FFD700; margin-bottom: 15px;">📋 Détails de votre commande :</h3>
            <p style="color: #ffffff; margin: 5px 0;"><strong>Numéro de commande :</strong> {order_number}</p>
            <p style="color: #ffffff; margin: 5px 0;"><strong>Email :</strong> {email}</p>
            <p style="color: #ffffff; margin: 5px 0;"><strong>Formation :</strong> ConfianceBoost Premium</p>
        </div>
        
        <div style="margin: 40px 0;">
            <a href="{dashboard_url}" style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; display: inline-block;">
                🚀 Accéder à ma formation
            </a>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-top: 30px;">
            <h3 style="color: #FFD700; margin-bottom: 15px;">✨ Ce qui vous attend :</h3>
            <ul style="color: #ffffff; text-align: left; padding-left: 20px;">
                <li>6 modules progressifs de formation premium</li>
                <li>Exercices pratiques personnalisés</li>
                <li>Suivi de progression en temps réel</li>
                <li>Certificat de réussite officiel</li>
                <li>Accès à vie garanti</li>
            </ul>
        </div>
        
        <p style="color: #cccccc; font-size: 14px; margin-top: 30px;">
            Besoin d'aide ? Contactez-nous à support@confianceboost.fr
        </p>
    </div>
</body>
</html>
"""