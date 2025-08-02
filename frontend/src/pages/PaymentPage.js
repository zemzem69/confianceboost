import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Crown, 
  CheckCircle, 
  Clock, 
  Users, 
  Shield, 
  CreditCard,
  Zap,
  Target,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import { paymentService } from '../services/api';

const PaymentPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('info'); // 'info', 'processing', 'success'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?tab=register');
      return;
    }

    if (user?.is_premium) {
      navigate('/dashboard');
      return;
    }

    // Vérifier si on revient d'un paiement
    const checkoutId = searchParams.get('checkout_id');
    if (checkoutId) {
      verifyPayment(checkoutId);
    }
  }, [isAuthenticated, user, searchParams, navigate]);

  const verifyPayment = async (checkoutId) => {
    try {
      setPaymentStep('processing');
      const result = await paymentService.verifyPayment(checkoutId);
      
      if (result.is_paid) {
        await paymentService.activatePremium({
          user_id: user.id,
          order_id: result.order_id || checkoutId,
          checkout_id: checkoutId
        });
        setPaymentStep('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        toast.error('Paiement non confirmé');
        setPaymentStep('info');
      }
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      toast.error('Erreur lors de la vérification du paiement');
      setPaymentStep('info');
    }
  };

  const handlePayment = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const checkoutData = await paymentService.createCheckout({
        user_email: user.email,
        user_name: `${user.first_name} ${user.last_name}`
      });

      if (checkoutData.checkout_url) {
        // Rediriger vers Shopify (ou simuler en mode démo)
        if (checkoutData.is_demo) {
          toast.success('Mode démo - Paiement simulé !');
          setTimeout(() => {
            verifyPayment(checkoutData.checkout_id);
          }, 2000);
        } else {
          window.location.href = checkoutData.checkout_url;
        }
      } else {
        toast.error('Erreur lors de la création du checkout');
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      toast.error('Erreur lors de la création du paiement');
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    { title: "Comprendre sa valeur personnelle", duration: "45 min", icon: "👤" },
    { title: "Surmonter le syndrome de l'imposteur", duration: "60 min", icon: "🎭" },
    { title: "Développer son assertivité", duration: "50 min", icon: "💪" },
    { title: "Gérer l'anxiété sociale", duration: "55 min", icon: "🌟" },
    { title: "Cultiver l'estime de soi", duration: "65 min", icon: "❤️" },
    { title: "Prendre des décisions avec confiance", duration: "40 min", icon: "🎯" }
  ];

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Vérification du paiement...</h2>
          <p className="text-gray-400">Nous traitons votre commande, veuillez patienter.</p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Paiement confirmé !</h2>
          <p className="text-gray-300 mb-6">
            Félicitations ! Vous avez maintenant accès à tous les modules ConfianceBoost.
          </p>
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mb-6">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-yellow-400 font-medium">Statut Premium activé</p>
          </div>
          <p className="text-sm text-gray-400">
            Redirection vers votre dashboard dans quelques secondes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              Retour au dashboard
            </Link>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg"></div>
              <span className="text-xl font-bold gold-gradient-text">ConfianceBoost</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Passez Premium et débloquez{' '}
            <span className="gold-gradient-text">tout ConfianceBoost</span>
          </h1>
          <p className="text-xl text-gray-300">
            Accès immédiat et à vie aux 6 modules complets de formation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Ce que vous obtenez :</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>Accès complet aux 6 modules (315 minutes de contenu)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>Exercices pratiques et outils personnalisés</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>Ressources PDF téléchargeables</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>Certificats de réussite</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>Accès à vie - pas d'abonnement</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>Support client prioritaire</span>
              </div>
            </div>

            {/* Modules List */}
            <h3 className="text-xl font-bold mb-4">Les 6 modules inclus :</h3>
            <div className="space-y-3">
              {modules.map((module, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-2xl">{module.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{module.title}</div>
                    <div className="text-sm text-gray-400">{module.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Card */}
          <div>
            <div className="card bg-gradient-to-b from-gray-900 to-black border-yellow-400/20 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold gold-gradient-text mb-2">97€</div>
                <div className="text-gray-400">Paiement unique - Accès à vie</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span>Formation complète (6 modules)</span>
                  <span>97€</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Accès à vie</span>
                  <span className="text-green-400">Inclus</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Support prioritaire</span>
                  <span className="text-green-400">Inclus</span>
                </div>
                <hr className="border-gray-700" />
                <div className="flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span className="gold-gradient-text">97€</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full btn-primary justify-center mb-4"
              >
                {loading ? (
                  <div className="loading-spinner w-5 h-5"></div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Payer maintenant - 97€
                  </>
                )}
              </button>

              <div className="space-y-3 text-center text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Paiement sécurisé via Shopify</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Accès immédiat après paiement</span>
                </div>
                <div>
                  <span>Satisfait ou remboursé 30 jours</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">1250+</div>
                <div className="text-xs text-gray-400">Utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">892</div>
                <div className="text-xs text-gray-400">Membres premium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">78%</div>
                <div className="text-xs text-gray-400">Taux de réussite</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold mb-2">Est-ce un abonnement ?</h3>
              <p className="text-gray-300 text-sm">
                Non, c'est un paiement unique de 97€ pour un accès à vie à tous les modules.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Puis-je obtenir un remboursement ?</h3>
              <p className="text-gray-300 text-sm">
                Oui, nous offrons une garantie satisfait ou remboursé de 30 jours.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Combien de temps dure la formation ?</h3>
              <p className="text-gray-300 text-sm">
                Au total 315 minutes de contenu, à suivre à votre rythme. Accès à vie inclus.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Y a-t-il un support ?</h3>
              <p className="text-gray-300 text-sm">
                Oui, les membres premium bénéficient d'un support client prioritaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;