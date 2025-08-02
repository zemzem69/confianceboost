import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  Target,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Hash,
  Sparkles
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import api from "../services/api";

const ShopifyAccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    orderNumber: searchParams.get('order') || searchParams.get('order_number') || ''
  });
  const [loading, setLoading] = useState(false);
  const [autoValidating, setAutoValidating] = useState(false);

  // Auto-validate if URL params are present
  useEffect(() => {
    if (formData.email && formData.orderNumber && !autoValidating) {
      setAutoValidating(true);
      handleValidateAccess(true);
    }
  }, [formData.email, formData.orderNumber]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleValidateAccess = async (isAutoValidation = false) => {
    if (!formData.email || !formData.orderNumber) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez renseigner votre email et numéro de commande",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/shopify/validate-access', {
        email: formData.email.trim(),
        order_number: formData.orderNumber.trim()
      });

      if (response.data.success) {
        toast({
          title: "🎉 Accès accordé !",
          description: response.data.message,
        });

        // Store user info in localStorage for session
        localStorage.setItem('confianceboost_user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, isAutoValidation ? 1500 : 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Erreur lors de la validation de votre achat";
      
      toast({
        title: "Erreur de validation",
        description: errorMessage,
        variant: "destructive",
      });

      // If auto-validation failed, show manual form
      if (isAutoValidation) {
        setAutoValidating(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (autoValidating) {
    return (
      <div className="min-h-screen brand-gradient-clean flex items-center justify-center px-4">
        <Card className="max-w-md w-full card-professional glass-morphism-clean border-yellow-400/30">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-spin mx-auto mb-6 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-professional-white mb-4">
              Validation de votre achat...
            </h2>
            <p className="text-gray-400">
              Vérification de votre commande Shopify en cours
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-gradient-clean relative overflow-hidden">
      {/* Clean Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-64 h-64 bg-yellow-500/8 rounded-full blur-2xl floating-element-clean"></div>
        <div className="absolute top-1/3 -right-4 w-80 h-80 bg-yellow-400/6 rounded-full blur-2xl floating-element-clean" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="glass-morphism-clean border-b border-yellow-500/20 p-4">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center glow-effect-clean">
              <Target className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-bold text-professional-gold">
                ConfianceBoost
              </span>
              <div className="text-yellow-400/80 font-medium text-sm">Activation Premium</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-2xl relative z-10">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect-clean">
            <ShoppingCart className="w-10 h-10 text-black" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-professional-white mb-4">
            🎉 Merci pour votre achat !
          </h1>
          
          <p className="text-lg text-gray-300 mb-8">
            Activez votre accès à la formation <span className="text-professional-gold font-semibold">ConfianceBoost Premium</span> 
            en validant votre commande Shopify.
          </p>
        </div>

        {/* Access Form */}
        <Card className="card-professional glass-morphism-clean border-yellow-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold text-professional-white flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-yellow-400" />
              <span>Validation de votre accès</span>
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Renseignez les informations de votre commande Shopify pour accéder immédiatement à votre formation
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-semibold flex items-center space-x-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span>Email de commande</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre-email@exemple.com"
                value={formData.email}
                onChange={handleInputChange}
                className="glass-morphism-clean border-gray-600 text-white placeholder-gray-500 focus:border-yellow-400"
                disabled={loading}
              />
              <p className="text-sm text-gray-500">
                L'email utilisé lors de votre commande sur Shopify
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderNumber" className="text-white font-semibold flex items-center space-x-2">
                <Hash className="w-4 h-4 text-yellow-400" />
                <span>Numéro de commande</span>
              </Label>
              <Input
                id="orderNumber"
                name="orderNumber"
                type="text"
                placeholder="1001 ou #1001"
                value={formData.orderNumber}
                onChange={handleInputChange}
                className="glass-morphism-clean border-gray-600 text-white placeholder-gray-500 focus:border-yellow-400"
                disabled={loading}
              />
              <p className="text-sm text-gray-500">
                Le numéro de votre commande (avec ou sans le #)
              </p>
            </div>

            <div className="glass-morphism-clean border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">💡 Comment trouver ces informations ?</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Vérifiez l'email de confirmation Shopify</li>
                    <li>• Le numéro de commande commence généralement par #</li>
                    <li>• Utilisez le même email que lors de l'achat</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleValidateAccess(false)}
              disabled={loading || !formData.email || !formData.orderNumber}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-bold py-4 text-lg rounded-xl button-professional glow-effect-clean group"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                  Validation en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Valider et accéder à ma formation
                </>
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-gray-400 text-sm">
                Problème avec votre commande ? {" "}
                <a 
                  href="mailto:support@confianceboost.fr" 
                  className="text-yellow-400 hover:text-yellow-300 underline font-medium"
                >
                  Contactez notre support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What's Next Section */}
        <Card className="mt-8 card-professional glass-morphism-clean border-gray-700/50">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-professional-white mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <span>Ce qui vous attend après validation</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Accès immédiat</h4>
                  <p className="text-gray-400 text-sm">Dashboard personnalisé et modules débloqués</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">6 modules premium</h4>
                  <p className="text-gray-400 text-sm">Formation complète avec suivi de progression</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Certificat inclus</h4>
                  <p className="text-gray-400 text-sm">Certificat officiel à la fin de la formation</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Support premium</h4>
                  <p className="text-gray-400 text-sm">Assistance par email incluse</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopifyAccessPage;