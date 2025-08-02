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
  Settings,
  Crown
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

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const startModule = async (moduleId) => {
    try {
      await progressService.startModule(moduleId);
      loadDashboard(); // Recharger pour mettre à jour les données
      navigate(`/module/${moduleId}`);
    } catch (error) {
      console.error('Erreur démarrage module:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 border-green-400 bg-green-400/10';
      case 'in_progress':
        return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      default:
        return 'text-gray-400 border-gray-600 bg-gray-600/10';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'in_progress':
        return <Play className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg"></div>
              <span className="text-xl font-bold gold-gradient-text">ConfianceBoost</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user?.is_premium && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Premium</span>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Bonjour {user?.first_name} ! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Continuez votre parcours vers une confiance renforcée
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{dashboard.stats.completed_modules}</div>
                <div className="text-gray-400 text-sm">Modules terminés</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{dashboard.stats.in_progress_modules}</div>
                <div className="text-gray-400 text-sm">En cours</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{dashboard.stats.certificates_count}</div>
                <div className="text-gray-400 text-sm">Certificats</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.round(dashboard.stats.total_study_time / 60)}h</div>
                <div className="text-gray-400 text-sm">Temps d'étude</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Progression globale</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${(dashboard.stats.completed_modules / dashboard.stats.total_modules) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {dashboard.stats.completed_modules}/{dashboard.stats.total_modules} modules
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Vos modules de formation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {dashboard.modules.map((module, index) => {
              const progress = module.progress;
              const isLocked = !user?.is_premium && index > 0; // Seul le premier module est gratuit
              
              return (
                <div 
                  key={module.id} 
                  className={`module-card ${progress.status === 'completed' ? 'completed' : ''} ${progress.status === 'in_progress' ? 'in-progress' : ''} ${isLocked ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{module.icon}</div>
                    <div className={`px-2 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(progress.status)}`}>
                      {getStatusIcon(progress.status)}
                      {getStatusText(progress.status)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{module.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>⏱️ {module.duration} min</span>
                    <span>📚 {module.lessons_count} leçons</span>
                  </div>
                  
                  {progress.status !== 'not_started' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression</span>
                        <span>{progress.progress_percentage}%</span>
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
                        Débloquer - 97€
                      </Link>
                    ) : progress.status === 'not_started' ? (
                      <button
                        onClick={() => startModule(module.id)}
                        className="btn-primary flex-1 justify-center text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Commencer
                      </button>
                    ) : (
                      <Link
                        to={`/module/${module.id}`}
                        className="btn-secondary flex-1 justify-center text-sm"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Continuer
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium CTA */}
        {!user?.is_premium && (
          <div className="card bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border-yellow-400/20">
            <div className="text-center">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Débloquez tous les modules</h3>
              <p className="text-gray-300 mb-6">
                Accédez aux 6 modules complets et transformez votre confiance dès aujourd'hui
              </p>
              <Link to="/payment" className="btn-primary">
                Passer Premium - 97€
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;