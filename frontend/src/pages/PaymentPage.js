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
  Award,
  Star,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import { paymentService } from '../services/api';

const PaymentPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('checkout');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?tab=register');
      return;
    }

    if (user?.is_premium) {
      navigate('/dashboard');
      return;
    }

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
        setPaymentStep('checkout');
      }
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      toast.error('Erreur lors de la vérification du paiement');
      setPaymentStep('checkout');
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
        if (checkoutData.is_demo) {
          toast.success('🎉 Mode démo - Paiement simulé avec succès !');
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

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold mb-4">Activation de votre accès Premium...</h2>
          <p className="text-gray-400">Nous traitons votre commande, veuillez patienter.</p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 brand-logo flex items-center justify-center rounded-2xl">
            <CheckCircle className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            🎉 Accès Premium <span className="text-premium">Activé</span> !
          </h2>
          <p className="text-gray-300 mb-6">
            Félicitations ! Vous avez maintenant accès à tous les modules ConfianceBoost Premium.
          </p>
          <div className="card mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-premium" />
              <span className="text-xl font-bold text-premium">Statut Premium Activé</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-premium">6</div>
                <div className="text-xs text-gray-400">Modules</div>
              </div>
              <div>
                <div className="text-lg font-bold text-premium">∞</div>
                <div className="text-xs text-gray-400">Accès à vie</div>
              </div>
              <div>
                <div className="text-lg font-bold text-premium">6</div>
                <div className="text-xs text-gray-400">Certificats</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Redirection vers votre dashboard dans quelques secondes...
          </p>
        </div>
      </div>
    );
  }

  const modules = [
    { title: "Comprendre sa valeur personnelle", duration: "45 min", lessons: 6 },
    { title: "Surmonter le syndrome de l'imposteur", duration: "60 min", lessons: 8 },
    { title: "Développer son assertivité", duration: "50 min", lessons: 7 },
    { title: "Gérer l'anxiété sociale", duration: "55 min", lessons: 6 },
    { title: "Cultiver l'estime de soi", duration: "65 min", lessons: 9 },
    { title: "Prendre des décisions avec confiance", duration: "40 min", lessons: 5 }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              Retour au dashboard
            </Link>
            
            <Link to="/" className="flex items-center space-x-3">
              <div className="brand-logo w-10 h-10 flex items-center justify-center">
                <span className="text-black font-black text-lg">CB</span>
              </div>
              <span className="text-2xl font-bold brand-text">ConfianceBoost</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 brand-logo flex items-center justify-center rounded-2xl">
            <Crown className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Accès <span className="text-premium">Premium</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Débloquez les 6 modules complets et transformez votre confiance dès aujourd'hui
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Section gauche - Avantages */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Ce que vous obtenez :</h2>
            
            {/* Stats Premium */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="card text-center">
                <BookOpen className="w-8 h-8 icon-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-premium">6</div>
                <div className="text-sm text-gray-400">Modules Complets</div>
              </div>
              
              <div className="card text-center">
                <Clock className="w-8 h-8 icon-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-premium">315</div>
                <div className="text-sm text-gray-400">Minutes de Formation</div>
              </div>
              
              <div className="card text-center">
                <Award className="w-8 h-8 icon-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-premium">6</div>
                <div className="text-sm text-gray-400">Certificats</div>
              </div>
              
              <div className="card text-center">
                <TrendingUp className="w-8 h-8 icon-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-premium">∞</div>
                <div className="text-sm text-gray-400">Accès à Vie</div>
              </div>
            </div>

            {/* Avantages */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Formation Complète (315 min)</div>
                  <div className="text-gray-400 text-sm">Accès à tous les 6 modules premium</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Exercices Pratiques</div>
                  <div className="text-gray-400 text-sm">Outils personnalisés et interactifs</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Certificats de Réussite</div>
                  <div className="text-gray-400 text-sm">Validez vos compétences acquises</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Support Prioritaire</div>
                  <div className="text-gray-400 text-sm">Aide personnalisée et réactive</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Ressources PDF</div>
                  <div className="text-gray-400 text-sm">Documents téléchargeables</div>
                </div>
              </div>
            </div>

            {/* Modules List */}
            <h3 className="text-xl font-bold mb-4">Les 6 Modules Premium :</h3>
            <div className="space-y-3">
              {modules.map((module, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-sm font-bold text-premium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{module.title}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-3">
                      <span>{module.duration}</span>
                      <span>•</span>
                      <span>{module.lessons} leçons</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section droite - Paiement */}
          <div>
            <div className="card premium-glow sticky top-8">
              <div className="text-center mb-6">
                <div className="text-6xl font-black text-premium mb-2">97€</div>
                <div className="text-gray-400 text-lg">Paiement unique - Accès à vie</div>
                <div className="badge mt-2">
                  <Zap className="w-4 h-4" />
                  Offre Limitée
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <span>Formation complète (6 modules)</span>
                  <span className="font-semibold">97€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Certificats de réussite</span>
                  <span className="text-green-400 font-semibold">Inclus</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Support prioritaire</span>
                  <span className="text-green-400 font-semibold">Inclus</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Accès à vie</span>
                  <span className="text-green-400 font-semibold">Inclus</span>
                </div>
                <hr className="border-gray-700" />
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total TTC</span>
                  <span className="text-premium">97€</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full btn-primary text-lg py-4 mb-4"
              >
                {loading ? (
                  <div className="loading-spinner w-5 h-5"></div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Accéder Premium Maintenant
                  </>
                )}
              </button>

              <div className="space-y-3 text-center text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Paiement 100% sécurisé via Shopify</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-premium" />
                  <span>Accès immédiat après paiement</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>Satisfait ou remboursé 30 jours</span>
                </div>
              </div>
            </div>

            {/* Stats de confiance */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-premium">1250+</div>
                <div className="text-xs text-gray-400">Utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-premium">892</div>
                <div className="text-xs text-gray-400">Membres premium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-premium">94%</div>
                <div className="text-xs text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Questions Fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="font-bold mb-2 text-premium">Est-ce un abonnement ?</h3>
              <p className="text-gray-300 text-sm">
                Non, c'est un paiement unique de 97€ pour un accès premium à vie.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2 text-premium">Puis-je obtenir un remboursement ?</h3>
              <p className="text-gray-300 text-sm">
                Oui, garantie satisfait ou remboursé de 30 jours.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2 text-premium">Combien de temps dure la formation ?</h3>
              <p className="text-gray-300 text-sm">
                315 minutes de contenu à suivre à votre rythme.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2 text-premium">Y a-t-il un support ?</h3>
              <p className="text-gray-300 text-sm">
                Oui, support client prioritaire pour les membres premium.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;