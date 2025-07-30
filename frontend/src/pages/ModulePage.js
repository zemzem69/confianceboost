import React, { useState } from "react";
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
  Zap
} from "lucide-react";
import { mockModules } from "../components/mock";
import { useToast } from "../hooks/use-toast";

const ModulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completedExercises, setCompletedExercises] = useState([]);
  
  const module = mockModules.find(m => m.id === parseInt(id));
  
  if (!module) {
    return (
      <div className="min-h-screen brand-gradient flex items-center justify-center">
        <Card className="max-w-md card-3d glass-morphism border-gray-700/50">
          <CardContent className="text-center py-8">
            <h2 className="text-3xl font-black text-3d-white mb-4">Module non trouvé</h2>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-bold button-3d"
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

  const handleCompleteModule = () => {
    toast({
      title: "Module terminé !",
      description: `Félicitations ! Vous avez terminé le module "${module.title}"`,
    });
    
    // Simulate module completion
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen brand-gradient relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl floating-element"></div>
        <div className="absolute top-1/3 -right-4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="glass-morphism sticky top-0 z-50 border-b border-yellow-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-300 hover:text-yellow-400 button-3d group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center button-3d glow-effect">
                  <Target className="w-5 h-5 text-black drop-shadow-lg" />
                </div>
                <div>
                  <span className="text-2xl font-black text-3d-gold tracking-tight">
                    ConfianceBoost
                  </span>
                  <div className="text-xs text-yellow-400/80 font-medium tracking-widest uppercase">Module Premium</div>
                </div>
              </div>
            </div>
            <Badge 
              variant={module.completed ? "default" : "secondary"}
              className={`${module.completed ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"} font-bold px-4 py-2`}
            >
              {module.completed ? "✓ Terminé" : "En cours"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-5xl relative z-10">
        {/* Module Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <span className="font-medium">Formation Premium</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-yellow-400 font-semibold">Module {mockModules.findIndex(m => m.id === module.id) + 1}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-3d-white mb-6">
            {module.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            {module.description}
          </p>

          <div className="flex items-center space-x-8 mb-8">
            <div className="flex items-center space-x-3 text-gray-400">
              <Clock className="w-6 h-6" />
              <span className="font-semibold text-lg">{module.duration}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <BookOpen className="w-6 h-6" />
              <span className="font-semibold text-lg">{module.lessons} leçons</span>
            </div>
            {module.completed && (
              <div className="flex items-center space-x-3 text-green-400">
                <Trophy className="w-6 h-6" />
                <span className="font-semibold text-lg">Terminé</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-400 font-semibold">Progression du module</span>
              <span className="font-black text-white text-2xl">{module.progress}%</span>
            </div>
            <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-4 rounded-full transition-all duration-500 glow-effect"
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Module Content */}
        <Tabs defaultValue="contenu" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 glass-morphism border border-gray-700/50 h-16">
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
            <Card className="card-3d glass-morphism border-gray-700/50 hover:border-yellow-400/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-black" />
                  </div>
                  <span className="font-black text-3d-white">Introduction du module</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="glass-morphism border border-gray-700/50 rounded-2xl p-12 text-center mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
                  <Play className="w-20 h-20 text-yellow-400 mx-auto mb-6 drop-shadow-lg relative z-10" />
                  <p className="text-gray-400 mb-6 text-lg font-semibold relative z-10">Vidéo d'introduction premium - {module.duration}</p>
                  <Button className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-8 py-4 button-3d glow-effect group relative z-10">
                    <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Lancer la vidéo
                    <Sparkles className="w-4 h-4 ml-3" />
                  </Button>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg mb-8">
                    {module.content.introduction}
                  </p>
                  
                  <h3 className="text-2xl font-black text-3d-white mt-8 mb-6">
                    🎯 Objectifs de ce module
                  </h3>
                  
                  <ul className="space-y-4">
                    {[
                      'Comprendre les mécanismes de votre confiance',
                      'Identifier vos forces et vos défis personnels',
                      'Appliquer des techniques concrètes au quotidien'
                    ].map((objective, index) => (
                      <li key={index} className="flex items-center space-x-4">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 drop-shadow-lg" />
                        <span className="text-gray-300 font-medium text-lg">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercices" className="space-y-8">
            <Card className="card-3d glass-morphism border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-black text-3d-white">🚀 Exercices pratiques</CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Mettez en pratique les concepts appris dans ce module premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {module.content.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-start space-x-4 p-6 glass-morphism border border-gray-700/50 rounded-xl hover:border-yellow-400/30 transition-colors group">
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
                  ))}
                </div>
                
                <div className="mt-8 p-6 glass-morphism border border-yellow-500/20 rounded-xl relative overflow-hidden">
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
            <Card className="card-3d glass-morphism border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-black text-3d-white">📚 Ressources complémentaires</CardTitle>
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
                    <div key={index} className="card-3d glass-morphism border border-gray-700/50 rounded-xl p-6 hover:border-yellow-400/30 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-center space-x-4 relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center button-3d">
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
        <div className="flex items-center justify-between pt-12 border-t border-gray-700/50">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="glass-morphism border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold text-lg px-6 py-3 button-3d"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </Button>
          
          <div className="flex items-center space-x-4">
            {!module.completed && (
              <Button 
                onClick={handleCompleteModule}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-6 py-3 button-3d group"
              >
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Marquer comme terminé
              </Button>
            )}
            
            {mockModules.findIndex(m => m.id === module.id) < mockModules.length - 1 && (
              <Button 
                onClick={() => navigate(`/module/${mockModules[mockModules.findIndex(m => m.id === module.id) + 1].id}`)}
                className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-6 py-3 button-3d glow-effect group"
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