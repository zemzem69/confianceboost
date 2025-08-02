import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  FileText, 
  Download,
  Target,
  Award,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import { moduleService, progressService, dashboardService } from '../services/api';

const ModulePage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [expandedLesson, setExpandedLesson] = useState(null);

  useEffect(() => {
    if (moduleId) {
      loadModuleData();
    }
  }, [moduleId]);

  const loadModuleData = async () => {
    try {
      const [moduleData, dashboardData] = await Promise.all([
        moduleService.getById(moduleId),
        dashboardService.getDashboard()
      ]);
      
      setModule(moduleData);
      
      // Trouver la progression pour ce module
      const moduleProgress = dashboardData.modules.find(m => m.id === moduleId);
      if (moduleProgress) {
        setProgress(moduleProgress.progress);
      }
    } catch (error) {
      console.error('Erreur chargement module:', error);
      toast.error('Erreur lors du chargement du module');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async (lessonId) => {
    try {
      await progressService.completeLesson(moduleId, lessonId);
      await loadModuleData(); // Recharger pour mettre à jour la progression
    } catch (error) {
      console.error('Erreur completion leçon:', error);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return progress?.completed_lessons?.includes(lessonId) || false;
  };

  const getProgressPercentage = () => {
    if (!module || !progress) return 0;
    return progress.progress_percentage || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du module...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Module non trouvé</p>
          <Link to="/dashboard" className="btn-primary">
            Retour au dashboard
          </Link>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{module.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{module.title}</h1>
              <p className="text-gray-400 text-lg">{module.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{module.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{module.lessons_count} leçons</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>{module.exercises?.length || 0} exercices</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression du module</span>
              <span className="text-yellow-400 font-medium">{getProgressPercentage()}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Completion Badge */}
          {progress?.status === 'completed' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
              <Award className="w-5 h-5" />
              <span className="font-medium">Module terminé - Certificat disponible</span>
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-900 rounded-lg p-1">
          {[
            { id: 'content', label: 'Contenu', icon: BookOpen },
            { id: 'exercises', label: 'Exercices', icon: Target },
            { id: 'resources', label: 'Ressources', icon: Download }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Leçons du module</h2>
            {module.lessons?.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id);
              const isExpanded = expandedLesson === lesson.id;
              
              return (
                <div key={lesson.id} className="card">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{lesson.title}</h3>
                        <div className="text-sm text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {lesson.duration} minutes
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="text-green-400 text-sm font-medium">Terminé</span>
                      )}
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="prose prose-invert max-w-none mb-6">
                        <p className="text-gray-300">{lesson.content}</p>
                      </div>
                      
                      {lesson.video_url && (
                        <div className="mb-4">
                          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                            <Play className="w-8 h-8 text-yellow-400" />
                            <div>
                              <div className="font-medium">Vidéo de la leçon</div>
                              <div className="text-sm text-gray-400">Durée: {lesson.duration} min</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!isCompleted && (
                        <button
                          onClick={() => completeLesson(lesson.id)}
                          className="btn-primary"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Marquer comme terminé
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Exercices pratiques</h2>
            {module.exercises?.map((exercise, index) => (
              <div key={exercise.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
                    <p className="text-gray-300 mb-4">{exercise.description}</p>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Instructions :</h4>
                      <p className="text-gray-300">{exercise.instructions}</p>
                    </div>
                    <div className="mt-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exercise.type === 'practical' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : exercise.type === 'written'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {exercise.type === 'practical' ? 'Exercice pratique' : 
                         exercise.type === 'written' ? 'Exercice écrit' : 'Réflexion'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Ressources complémentaires</h2>
            {module.resources?.map((resource, index) => (
              <div key={index} className="card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{resource}</h3>
                    <p className="text-gray-400 text-sm">Document PDF téléchargeable</p>
                  </div>
                  <button className="btn-secondary">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulePage;