import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Users, 
  Trophy, 
  ArrowRight, 
  CheckCircle,
  PlayCircle,
  Target,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '../App';
import { statsService } from '../services/api';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    total_users: 1250,
    premium_users: 892,
    total_modules: 6,
    total_certificates: 734,
    average_completion_rate: 78.5
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await statsService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      }
    };
    loadStats();
  }, []);

  const modules = [
    {
      id: 1,
      title: "Comprendre sa valeur personnelle",
      duration: "45 min",
      lessons: 6,
      icon: "👤",
      description: "Découvrez votre valeur intrinsèque et apprenez à la reconnaître."
    },
    {
      id: 2,
      title: "Surmonter le syndrome de l'imposteur",
      duration: "60 min",
      lessons: 8,
      icon: "🎭",
      description: "Libérez-vous de cette voix qui vous dit que vous ne méritez pas votre succès."
    },
    {
      id: 3,
      title: "Développer son assertivité",
      duration: "50 min",
      lessons: 7,
      icon: "💪",
      description: "Apprenez à exprimer vos besoins avec respect et fermeté."
    },
    {
      id: 4,
      title: "Gérer l'anxiété sociale",
      duration: "55 min",
      lessons: 6,
      icon: "🌟",
      description: "Surmontez votre peur du jugement et développez votre aisance sociale."
    },
    {
      id: 5,
      title: "Cultiver l'estime de soi",
      duration: "65 min",
      lessons: 9,
      icon: "❤️",
      description: "Construisez une estime solide, indépendante du regard des autres."
    },
    {
      id: 6,
      title: "Prendre des décisions avec confiance",
      duration: "40 min",
      lessons: 5,
      icon: "🎯",
      description: "Développez votre capacité à prendre des décisions alignées."
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Entrepreneure",
      content: "ConfianceBoost a transformé ma façon de voir les défis. Je me sens enfin alignée avec mes valeurs.",
      rating: 5
    },
    {
      name: "Thomas L.",
      role: "Manager",
      content: "Les modules sur l'assertivité m'ont aidé à mieux communiquer avec mon équipe. Résultats incroyables !",
      rating: 5
    },
    {
      name: "Emma R.",
      role: "Consultante",
      content: "Fini le syndrome de l'imposteur ! Cette formation m'a donné les outils pour croire en moi.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="brand-logo w-10 h-10 flex items-center justify-center">
              <span className="text-black font-black text-lg">CB</span>
            </div>
            <span className="text-2xl font-bold brand-text">ConfianceBoost</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">
                Mon Dashboard
              </Link>
            ) : (
              <>
                <Link to="/auth" className="btn-secondary">
                  Connexion
                </Link>
                <Link to="/auth?tab=register" className="btn-primary">
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
              Développez votre{' '}
              <span className="gold-gradient-text">
                Confiance
              </span>
              <br />
              <span className="gold-gradient-text">en 6 modules experts</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto animate-fade-in-up">
              ✨ Transformez votre relation à vous-même avec notre formation premium. 
              Des techniques éprouvées pour construire une confiance durable et professionnelle.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-fade-in-up">
            <Link to="/auth?tab=register" className="btn-primary text-lg px-10 py-5">
              <PlayCircle className="w-6 h-6" />
              Commencer Maintenant
            </Link>
            <div className="text-center premium-glow">
              <div className="text-5xl font-bold gold-gradient-text mb-2">97€</div>
              <div className="text-gray-300 font-medium">Accès Premium à Vie</div>
              <div className="text-sm text-gray-400 mt-2">💎 Formation Complète • 🎯 6 Modules • 🏆 Certificats</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-scale">
              <div className="stat-counter">{stats.total_users.toLocaleString()}</div>
              <div className="text-gray-400">Utilisateurs actifs</div>
            </div>
            <div className="animate-fade-in-scale">
              <div className="stat-counter">{stats.premium_users}</div>
              <div className="text-gray-400">Membres premium</div>
            </div>
            <div className="animate-fade-in-scale">
              <div className="stat-counter">{stats.total_certificates}</div>
              <div className="text-gray-400">Certificats délivrés</div>
            </div>
            <div className="animate-fade-in-scale">
              <div className="stat-counter">{stats.average_completion_rate}%</div>
              <div className="text-gray-400">Taux de réussite</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              6 Modules pour une{' '}
              <span className="gold-gradient-text">transformation complète</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Chaque module est conçu par des experts en développement personnel 
              et validé par des psychologues professionnels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <div key={module.id} className="module-card animate-fade-in-scale" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-4xl mb-4">{module.icon}</div>
                <h3 className="text-xl font-bold mb-3">{module.title}</h3>
                <p className="text-gray-300 mb-4">{module.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>⏱️ {module.duration}</span>
                  <span>📚 {module.lessons} leçons</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Pourquoi choisir{' '}
              <span className="gold-gradient-text">ConfianceBoost</span> ? 🌟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <img 
                src="https://images.unsplash.com/photo-1616938895503-66c89f91bd7d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxjb2xvcmZ1bCUyMG1vdGl2YXRpb258ZW58MHx8fHwxNzU0MTQzMDkwfDA&ixlib=rb-4.1.0&q=85"
                alt="Hope et motivation"
                className="w-full h-48 object-cover rounded-2xl premium-glow"
                style={{
                  filter: 'brightness(1.3) saturate(1.6) contrast(1.2)',
                  boxShadow: '0 0 60px rgba(255, 0, 128, 0.5)'
                }}
              />
              <img 
                src="https://images.unsplash.com/photo-1551889685-8cfc48b26ab2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHw0fHxjb25maWRlbmNlJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU0MTQzMDg1fDA&ixlib=rb-4.1.0&q=85"
                alt="Confiance et force"
                className="w-full h-48 object-cover rounded-2xl premium-glow"
                style={{
                  filter: 'brightness(1.3) saturate(1.6) contrast(1.2)',
                  boxShadow: '0 0 60px rgba(138, 43, 226, 0.5)'
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <Target className="w-12 h-12 text-yellow-400 mx-auto mb-4" style={{filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))'}} />
              <h3 className="text-xl font-bold mb-3">🎯 Méthodes éprouvées</h3>
              <p className="text-gray-300">
                Techniques validées scientifiquement et utilisées par les meilleurs coachs internationaux ⭐
              </p>
            </div>
            
            <div className="card text-center">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" style={{filter: 'drop-shadow(0 0 20px rgba(255, 0, 128, 0.8))'}} />
              <h3 className="text-xl font-bold mb-3">💝 Approche bienveillante</h3>
              <p className="text-gray-300">
                Un parcours respectueux de votre rythme, sans jugement ni pression, avec amour 💕
              </p>
            </div>
            
            <div className="card text-center">
              <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" style={{filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))'}} />
              <h3 className="text-xl font-bold mb-3">⚡ Résultats durables</h3>
              <p className="text-gray-300">
                Des changements profonds qui s'installent dans la durée avec des résultats visibles 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Ce que disent nos{' '}
              <span className="gold-gradient-text">membres</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à transformer votre{' '}
            <span className="gold-gradient-text">confiance</span> ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez plus de {stats.premium_users} personnes qui ont déjà choisi de reprendre le contrôle de leur vie.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/auth?tab=register" className="btn-primary text-lg px-8 py-4">
              <ArrowRight className="w-6 h-6" />
              Commencer maintenant - 97€
            </Link>
            <div className="flex items-center gap-2 text-green-400">
              <Shield className="w-5 h-5" />
              <span>Satisfait ou remboursé 30 jours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg"></div>
            <span className="text-xl font-bold gold-gradient-text">ConfianceBoost</span>
          </div>
          <p className="text-gray-400 mb-4">
            Développez votre confiance avec des méthodes éprouvées
          </p>
          <div className="text-gray-500 text-sm">
            © 2025 ConfianceBoost. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;