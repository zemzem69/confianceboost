import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Trophy, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Play,
  CheckCircle,
  Star,
  Target,
  User,
  Crown,
  Award,
  TrendingUp,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import { dashboardService, progressService } from '../services/api';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await dashboardService.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  const startModule = async (moduleId) => {
    try {
      await progressService.startModule(moduleId);
      loadDashboard();
      navigate(`/module/${moduleId}`);
    } catch (error) {
      console.error('Erreur démarrage module:', error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const getProgressPercentage = () => {
    if (!dashboard) return 0;
    const completedModules = dashboard.stats.completed_modules;
    const totalModules = dashboard.stats.total_modules;
    return Math.round((completedModules / totalModules) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in_progress':
        return 'status-in-progress';
      default:
        return 'status-not-started';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      default:
        return 'Non commencé';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Erreur lors du chargement des données</p>
          <button onClick={loadDashboard} className="btn-primary mt-4">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage();
  const totalStudyHours = Math.floor(dashboard.stats.total_study_time / 60);
  const totalStudyMinutes = dashboard.stats.total_study_time % 60;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="brand-logo w-10 h-10 flex items-center justify-center">
                <span className="text-black font-black text-lg">CB</span>
              </div>
              <span className="text-2xl font-bold brand-text">ConfianceBoost</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user?.is_premium && (
                <div className="badge">
                  <Crown className="w-4 h-4" />
                  Premium
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-5 h-5" />
                <span>{user?.first_name} {user?.last_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec salutation */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Bonjour {user?.first_name} ! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Continuez votre parcours vers plus de confiance en soi
          </p>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <TrendingUp className="w-8 h-8 icon-gold mx-auto mb-2" />
            <div className="text-sm text-gray-400 mb-1">Progression Active</div>
            <div className="text-2xl font-bold text-premium">{progressPercentage}%</div>
          </div>

          <div className="card text-center">
            <Crown className="w-8 h-8 icon-gold mx-auto mb-2" />
            <div className="text-sm text-gray-400 mb-1">Accès à Vie</div>
            <div className="text-2xl font-bold text-premium">
              {user?.is_premium ? 'Premium' : 'Gratuit'}
            </div>
          </div>

          <div className="card text-center">
            <BookOpen className="w-8 h-8 icon-gold mx-auto mb-2" />
            <div className="text-sm text-gray-400 mb-1">Modules</div>
            <div className="text-2xl font-bold text-premium">
              {dashboard.stats.completed_modules}/{dashboard.stats.total_modules}
            </div>
          </div>

          <div className="card text-center">
            <Trophy className="w-8 h-8 icon-gold mx-auto mb-2" />
            <div className="text-sm text-gray-400 mb-1">Certificats</div>
            <div className="text-2xl font-bold text-premium">{dashboard.stats.certificates_count}</div>
          </div>
        </div>

        {/* Card de progression premium */}
        <div className="card mb-8 premium-glow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Votre Progression Premium</h2>
            <div className="badge">
              <Star className="w-4 h-4" />
              Formation Confiance en Soi
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="badge status-in-progress">
                  <Zap className="w-4 h-4" />
                  Formation Premium Active
                </div>
                <div className="text-lg font-semibold text-premium">
                  {progressPercentage}% terminé
                </div>
              </div>
              
              <div className="progress-bar mb-4">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <p className="text-gray-300">
                Vous avez terminé <span className="text-premium font-semibold">{dashboard.stats.completed_modules} modules premium</span> sur {dashboard.stats.total_modules}. 
                Continuez ainsi pour débloquer votre certificat premium !
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">{dashboard.stats.completed_modules}</div>
                <div className="text-xs text-gray-400">Terminés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-premium mb-1">{dashboard.stats.total_modules - dashboard.stats.completed_modules}</div>
                <div className="text-xs text-gray-400">Restants</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-premium mb-1">94%</div>
                <div className="text-xs text-gray-400">Réussite</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Mes Modules Premium</h2>
            <div className="badge">
              <BookOpen className="w-4 h-4" />
              {dashboard.stats.total_modules} Modules Disponibles
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboard.modules.map((moduleData, index) => {
              const module = moduleData;
              const progress = module.progress;
              const isLocked = !user?.is_premium && index > 0;
              
              return (
                <div 
                  key={module.id} 
                  className={`module-card ${progress.status === 'completed' ? 'completed' : ''} ${progress.status === 'in_progress' ? 'in-progress' : ''} ${isLocked ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-2xl font-bold text-premium">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white truncate">
                          Module {index + 1}
                        </h3>
                        <div className={`badge ${getStatusColor(progress.status)}`}>
                          {progress.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                          {progress.status === 'in_progress' && <Play className="w-3 h-3" />}
                          {progress.status === 'not_started' && <Clock className="w-3 h-3" />}
                          {getStatusText(progress.status)}
                        </div>
                      </div>
                      
                      <h4 className="text-premium font-semibold mb-2">
                        {module.title}
                      </h4>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {module.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {module.lessons_count} leçons
                        </span>
                      </div>
                      
                      {progress.status !== 'not_started' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Progression</span>
                            <span className="text-premium font-semibold">{progress.progress_percentage}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${progress.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {isLocked ? (
                          <Link to="/payment" className="btn-primary flex-1 justify-center text-sm">
                            <Crown className="w-4 h-4" />
                            Débloquer Premium
                          </Link>
                        ) : progress.status === 'not_started' ? (
                          <button
                            onClick={() => startModule(module.id)}
                            className="btn-primary flex-1 justify-center text-sm"
                          >
                            <Play className="w-4 h-4" />
                            Commencer
                          </button>
                        ) : progress.status === 'completed' ? (
                          <Link
                            to={`/module/${module.id}`}
                            className="btn-secondary flex-1 justify-center text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Revoir
                          </Link>
                        ) : (
                          <Link
                            to={`/module/${module.id}`}
                            className="btn-primary flex-1 justify-center text-sm"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Continuer
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Premium si pas premium */}
        {!user?.is_premium && (
          <div className="card premium-glow text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 brand-logo flex items-center justify-center rounded-2xl">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Débloquez Tous les Modules Premium
              </h3>
              <p className="text-gray-300 mb-6">
                Accédez aux 6 modules complets et transformez votre confiance dès aujourd'hui. 
                Formation professionnelle avec certificats inclus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/payment" className="btn-primary text-lg px-8 py-4">
                  <Crown className="w-5 h-5" />
                  Passer Premium - 97€
                </Link>
                <div className="text-center">
                  <div className="text-lg font-semibold text-premium">Accès à vie</div>
                  <div className="text-sm text-gray-400">+ Certificats + Support prioritaire</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;