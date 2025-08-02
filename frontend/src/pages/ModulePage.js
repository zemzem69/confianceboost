import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  BookOpen, 
  Clock, 
  Target,
  Award,
  ChevronRight,
  FileText,
  Video,
  Sparkles,
  Trophy,
  Zap,
  RefreshCw
} from "lucide-react";
import { useModule, useUpdateModuleProgress } from "../hooks/useApi";
import { useToast } from "../hooks/use-toast";

const ModulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completedExercises, setCompletedExercises] = useState([]);
  
  // API hooks
  const { data: module, loading: moduleLoading, refetch: refetchModule } = useModule(id);
  const { updateProgress, loading: updateLoading } = useUpdateModuleProgress();
  
  useEffect(() => {
    // Reset exercises when module changes
    setCompletedExercises([]);
  }, [id]);
  
  if (moduleLoading) {
    return (
      <div className="min-h-screen brand-gradient-clean flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-spin mx-auto mb-4 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-professional-white mb-2">Chargement du module...</h2>
          <p className="text-gray-400">Préparation de votre contenu personnalisé</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen brand-gradient-clean flex items-center justify-center">
        <Card className="max-w-md card-professional glass-morphism-clean border-gray-700/50">
          <CardContent className="text-center py-8">
            <h2 className="text-3xl font-black text-professional-white mb-4">Module non trouvé</h2>
            <p className="text-gray-400 mb-6">Ce module n'existe pas ou n'est plus disponible.</p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-bold button-professional"
            >
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExerciseComplete = (exerciseIndex) => {
    const newCompleted = [...completedExercises];
    if (newCompleted.includes(exerciseIndex)) {
      newCompleted.splice(newCompleted.indexOf(exerciseIndex), 1);
    } else {
      newCompleted.push(exerciseIndex);
    }
    setCompletedExercises(newCompleted);
    
    toast({
      title: "Exercice mis à jour",
      description: newCompleted.includes(exerciseIndex) 
        ? "Exercice marqué comme terminé !" 
        : "Exercice marqué comme non terminé",
    });
  };

  const handleUpdateProgress = async (progressValue, completed = false) => {
    try {
      const updatedModule = await updateProgress(parseInt(id), {
        progress: progressValue,
        completed: completed
      });
      
      await refetchModule();
      
      toast({
        title: completed ? "Module terminé !" : "Progression mise à jour",
        description: completed 
          ? `Félicitations ! Vous avez terminé le module "${module.title}"` 
          : `Progression mise à jour : ${progressValue}%`
      });
      
      if (completed) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la progression",
        variant: "destructive",
      });
    }
  };

  const handleCompleteModule = () => {
    handleUpdateProgress(100, true);
  };

  const handleMarkProgress = (progress) => {
    handleUpdateProgress(progress, false);
  };

  return (
    <div className="min-h-screen brand-gradient-clean relative overflow-hidden">
      {/* Clean Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-64 h-64 bg-yellow-500/8 rounded-full blur-2xl floating-element-clean"></div>
        <div className="absolute top-1/3 -right-4 w-80 h-80 bg-yellow-400/6 rounded-full blur-2xl floating-element-clean" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Professional Header */}
      <header className="glass-morphism-clean sticky top-0 z-50 border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-300 hover:text-yellow-400 button-professional group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center glow-effect-clean">
                  <Target className="w-5 h-5 text-black" />
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-bold text-professional-gold">
                    ConfianceBoost
                  </span>
                  <div className="text-xs text-yellow-400/80 font-medium">Module Premium</div>
                </div>
              </div>
            </div>
            <Badge 
              className={`${module.completed ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"} font-bold px-4 py-2 badge-clean`}
            >
              {module.completed ? "✓ Terminé" : "En cours"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Module Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <span className="font-medium">Formation Premium</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-yellow-400 font-semibold">Module {module.id}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-professional-white mb-6">
            {module.title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            {module.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center space-x-3 text-gray-400">
              <Clock className="w-5 h-5" />
              <span className="font-semibold text-lg">{module.duration}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold text-lg">{module.lessons} leçons</span>
            </div>
            {module.completed && (
              <div className="flex items-center space-x-3 text-green-400">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold text-lg">Terminé</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-400 font-semibold">Progression du module</span>
              <span className="font-black text-white text-2xl stat-number-clean">{module.progress}%</span>
            </div>
            <div className="progress-bar-clean h-4 rounded-full overflow-hidden">
              <div 
                className="progress-fill h-full transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
            
            {/* Quick Progress Buttons */}
            {!module.completed && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleMarkProgress(25)}
                  className="glass-morphism-clean border-gray-600 text-gray-300 hover:bg-yellow-400/10"
                  disabled={updateLoading}
                >
                  25%
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleMarkProgress(50)}
                  className="glass-morphism-clean border-gray-600 text-gray-300 hover:bg-yellow-400/10"
                  disabled={updateLoading}
                >
                  50%
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleMarkProgress(75)}
                  className="glass-morphism-clean border-gray-600 text-gray-300 hover:bg-yellow-400/10"
                  disabled={updateLoading}
                >
                  75%
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Module Content */}
        <Tabs defaultValue="contenu" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 glass-morphism-clean border border-gray-700/50 h-16">
            <TabsTrigger value="contenu" className="flex items-center space-x-3 text-lg font-semibold data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Video className="w-5 h-5" />
              <span>Contenu</span>
            </TabsTrigger>
            <TabsTrigger value="exercices" className="flex items-center space-x-3 text-lg font-semibold data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <FileText className="w-5 h-5" />
              <span>Exercices</span>
            </TabsTrigger>
            <TabsTrigger value="ressources" className="flex items-center space-x-3 text-lg font-semibold data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <BookOpen className="w-5 h-5" />
              <span>Ressources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contenu" className="space-y-8">
            <Card className="card-professional glass-morphism-clean border-gray-700/50 hover:border-yellow-400/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                    <Play className="w-5 h-5 text-black" />
                  </div>
                  <span className="font-black text-professional-white">Introduction du module</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="glass-morphism-clean border border-gray-700/50 rounded-2xl p-8 md:p-12 text-center mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
                  <Play className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 mx-auto mb-6 relative z-10" />
                  <p className="text-gray-400 mb-6 text-lg font-semibold relative z-10">Vidéo d'introduction premium - {module.duration}</p>
                  <Button className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-bold text-lg px-8 py-4 button-professional glow-effect-clean group relative z-10">
                    <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Lancer la vidéo
                    <Sparkles className="w-4 h-4 ml-3" />
                  </Button>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg mb-8">
                    {module.content?.introduction || "Contenu du module en cours de chargement..."}
                  </p>
                  
                  <h3 className="text-2xl font-black text-professional-white mt-8 mb-6">
                    🎯 Objectifs de ce module
                  </h3>
                  
                  <ul className="space-y-4">
                    {[
                      'Comprendre les mécanismes de votre confiance',
                      'Identifier vos forces et vos défis personnels',
                      'Appliquer des techniques concrètes au quotidien'
                    ].map((objective, index) => (
                      <li key={index} className="flex items-center space-x-4">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 font-medium text-lg">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercices" className="space-y-8">
            <Card className="card-professional glass-morphism-clean border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-black text-professional-white">🚀 Exercices pratiques</CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Mettez en pratique les concepts appris dans ce module premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {module.content?.exercises?.map((exercise, index) => (
                    <div key={index} className="flex items-start space-x-4 p-6 glass-morphism-clean border border-gray-700/50 rounded-xl hover:border-yellow-400/30 transition-colors group">
                      <Checkbox 
                        id={`exercise-${index}`}
                        checked={completedExercises.includes(index)}
                        onCheckedChange={() => handleExerciseComplete(index)}
                        className="mt-1 w-6 h-6 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`exercise-${index}`}
                          className={`text-gray-300 cursor-pointer font-medium text-lg leading-relaxed ${
                            completedExercises.includes(index) ? 'line-through text-gray-500' : 'group-hover:text-white'
                          } transition-colors`}
                        >
                          {exercise}
                        </label>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Les exercices sont en cours de préparation...</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 p-6 glass-morphism-clean border border-yellow-500/20 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent"></div>
                  <h4 className="font-black text-yellow-400 mb-3 text-lg flex items-center relative z-10">
                    <Zap className="w-5 h-5 mr-2" />
                    💡 Conseil Premium
                  </h4>
                  <p className="text-gray-300 leading-relaxed relative z-10">
                    Prenez votre temps pour chaque exercice. L'important n'est pas la vitesse, 
                    mais la <span className="text-yellow-400 font-semibold">qualité de votre réflexion</span> et de votre mise en pratique.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ressources" className="space-y-8">
            <Card className="card-professional glass-morphism-clean border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-black text-professional-white">📚 Ressources complémentaires</CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Matériel premium pour approfondir vos connaissances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { icon: FileText, title: "Guide PDF Premium - Techniques d'ancrage", desc: "Un guide pratique exclusif pour renforcer votre confiance" },
                    { icon: BookOpen, title: "Bibliographie recommandée", desc: "Livres et articles sélectionnés par nos experts" },
                    { icon: Award, title: "Fiche de suivi personnel", desc: "Template premium pour suivre vos progrès détaillés" }
                  ].map((resource, index) => (
                    <div key={index} className="card-professional glass-morphism-clean border border-gray-700/50 rounded-xl p-6 hover:border-yellow-400/30 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-center space-x-4 relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center button-professional">
                          <resource.icon className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg group-hover:text-yellow-400 transition-colors">{resource.title}</h4>
                          <p className="text-gray-400">{resource.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-gray-700/50 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="glass-morphism-clean border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold text-lg px-6 py-3 button-professional w-full md:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </Button>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {!module.completed && (
              <Button 
                onClick={handleCompleteModule}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-6 py-3 button-professional group w-full sm:w-auto"
                disabled={updateLoading}
              >
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {updateLoading ? "Mise à jour..." : "Marquer comme terminé"}
              </Button>
            )}
            
            {module.id < 6 && (
              <Button 
                onClick={() => navigate(`/module/${parseInt(module.id) + 1}`)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-bold text-lg px-6 py-3 button-professional glow-effect-clean group w-full sm:w-auto"
              >
                Module suivant
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;