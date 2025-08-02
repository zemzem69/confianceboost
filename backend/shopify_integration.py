import os
import shopify
import hmac
import hashlib
import json
from fastapi import HTTPException
from typing import Dict, Any, Optional
import httpx
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ShopifyConfig:
    def __init__(self):
        self.shop_url = os.environ.get('SHOPIFY_STORE_URL', 'https://votre-boutique.myshopify.com')
        self.access_token = os.environ.get('SHOPIFY_ACCESS_TOKEN', '')
        self.webhook_secret = os.environ.get('SHOPIFY_WEBHOOK_SECRET', '')
        self.api_version = "2024-01"
        
        # Product ID pour la formation ConfianceBoost (97€)
        self.product_id = os.environ.get('SHOPIFY_PRODUCT_ID', '8742502187212')
        
    def is_configured(self) -> bool:
        return bool(self.access_token and self.shop_url != 'https://votre-boutique.myshopify.com')

shopify_config = ShopifyConfig()

class ShopifyIntegration:
    def __init__(self):
        self.config = shopify_config
        if self.config.is_configured():
            self.setup_session()
    
    def setup_session(self):
        """Configure la session Shopify"""
        try:
            shop_domain = self.config.shop_url.replace('https://', '').replace('http://', '')
            session = shopify.Session(shop_domain, self.config.api_version, self.config.access_token)
            shopify.ShopifyResource.activate_session(session)
            logger.info(f"Shopify session configurée pour {shop_domain}")
        except Exception as e:
            logger.error(f"Erreur configuration Shopify: {e}")
            raise
    
    async def create_checkout_url(self, user_email: str, user_name: str) -> Dict[str, Any]:
        """Crée une URL de checkout Shopify pour la formation ConfianceBoost"""
        if not self.config.is_configured():
            # Mode démo - renvoie une URL factice
            return {
                "checkout_url": f"{self.config.shop_url}/cart/add?id={self.config.product_id}&quantity=1",
                "checkout_id": "demo-checkout-id",
                "total_price": "97.00",
                "currency": "EUR",
                "is_demo": True
            }
        
        try:
            # Créer un checkout avec l'API Shopify
            checkout_data = {
                "checkout": {
                    "line_items": [
                        {
                            "variant_id": self.config.product_id,
                            "quantity": 1
                        }
                    ],
                    "email": user_email,
                    "note": f"Formation ConfianceBoost pour {user_name}",
                    "shipping_address": {
                        "first_name": user_name.split()[0] if user_name else "Client",
                        "last_name": user_name.split()[-1] if len(user_name.split()) > 1 else "ConfianceBoost",
                        "country": "FR"
                    }
                }
            }
            
            # Utiliser l'API REST directement avec httpx
            async with httpx.AsyncClient() as client:
                headers = {
                    "X-Shopify-Access-Token": self.config.access_token,
                    "Content-Type": "application/json"
                }
                
                shop_url = self.config.shop_url.rstrip('/')
                response = await client.post(
                    f"{shop_url}/admin/api/{self.config.api_version}/checkouts.json",
                    headers=headers,
                    json=checkout_data
                )
                
                if response.status_code == 200 or response.status_code == 201:
                    result = response.json()
                    checkout = result.get('checkout', {})
                    
                    return {
                        "checkout_url": checkout.get('web_url', ''),
                        "checkout_id": checkout.get('token', ''),
                        "total_price": checkout.get('total_price', '97.00'),
                        "currency": checkout.get('currency', 'EUR'),
                        "is_demo": False
                    }
                else:
                    logger.error(f"Erreur Shopify API: {response.status_code} - {response.text}")
                    # Fallback vers URL simple
                    return {
                        "checkout_url": f"{self.config.shop_url}/cart/add?id={self.config.product_id}&quantity=1",
                        "checkout_id": f"fallback-{datetime.now().timestamp()}",
                        "total_price": "97.00",
                        "currency": "EUR",
                        "is_demo": True
                    }
                    
        except Exception as e:
            logger.error(f"Erreur création checkout: {e}")
            # Fallback vers URL simple
            return {
                "checkout_url": f"{self.config.shop_url}/cart/add?id={self.config.product_id}&quantity=1",
                "checkout_id": f"error-{datetime.now().timestamp()}",
                "total_price": "97.00",
                "currency": "EUR",
                "is_demo": True
            }
    
    async def verify_payment(self, checkout_id: str) -> Dict[str, Any]:
        """Vérifie le statut d'un paiement"""
        if not self.config.is_configured() or checkout_id.startswith(('demo-', 'fallback-', 'error-')):
            # Mode démo - simule un paiement réussi pour les tests
            return {
                "is_paid": True,
                "payment_status": "paid",
                "order_id": f"demo-order-{checkout_id}",
                "total_price": "97.00",
                "currency": "EUR",
                "customer_email": "demo@confianceboost.fr"
            }
        
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "X-Shopify-Access-Token": self.config.access_token,
                    "Content-Type": "application/json"
                }
                
                shop_url = self.config.shop_url.rstrip('/')
                response = await client.get(
                    f"{shop_url}/admin/api/{self.config.api_version}/checkouts/{checkout_id}.json",
                    headers=headers
                )
                
                if response.status_code == 200:
                    result = response.json()
                    checkout = result.get('checkout', {})
                    
                    return {
                        "is_paid": checkout.get('completed_at') is not None,
                        "payment_status": "paid" if checkout.get('completed_at') else "pending",
                        "order_id": checkout.get('order_id'),
                        "total_price": checkout.get('total_price', '97.00'),
                        "currency": checkout.get('currency', 'EUR'),
                        "customer_email": checkout.get('email', '')
                    }
                else:
                    logger.error(f"Erreur vérification paiement: {response.status_code}")
                    return {
                        "is_paid": False,
                        "payment_status": "error",
                        "error": f"HTTP {response.status_code}"
                    }
                    
        except Exception as e:
            logger.error(f"Erreur vérification paiement: {e}")
            return {
                "is_paid": False,
                "payment_status": "error",
                "error": str(e)
            }
    
    def verify_webhook(self, data: bytes, signature: str) -> bool:
        """Vérifie l'authenticité d'un webhook Shopify"""
        if not self.config.webhook_secret:
            logger.warning("Webhook secret non configuré, acceptation par défaut")
            return True
            
        try:
            expected_signature = hmac.new(
                self.config.webhook_secret.encode('utf-8'),
                data,
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(signature, expected_signature)
        except Exception as e:
            logger.error(f"Erreur vérification webhook: {e}")
            return False
    
    async def handle_payment_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Traite un webhook de paiement Shopify"""
        try:
            # Extraire les informations du webhook
            order_id = webhook_data.get('id')
            customer_email = webhook_data.get('email', '')
            financial_status = webhook_data.get('financial_status', '')
            total_price = webhook_data.get('total_price', '0.00')
            
            logger.info(f"Webhook reçu pour commande {order_id}, email: {customer_email}, statut: {financial_status}")
            
            if financial_status == 'paid':
                return {
                    "action": "activate_premium",
                    "customer_email": customer_email,
                    "order_id": order_id,
                    "amount": total_price,
                    "status": "success"
                }
            else:
                return {
                    "action": "none",
                    "reason": f"Statut financier: {financial_status}",
                    "status": "pending"
                }
                
        except Exception as e:
            logger.error(f"Erreur traitement webhook: {e}")
            return {
                "action": "error",
                "error": str(e),
                "status": "error"
            }

# Instance globale
shopify_integration = ShopifyIntegration()