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
  Video
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Card className="max-w-md bg-gray-800/80 border-gray-700">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold text-white mb-4">Module non trouvé</h2>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-yellow-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-300 hover:text-yellow-400">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                  ConfianceBoost
                </span>
              </div>
            </div>
            <Badge 
              variant={module.completed ? "default" : "secondary"}
              className={module.completed ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}
            >
              {module.completed ? "Terminé" : "En cours"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Formation</span>
            <ChevronRight className="w-4 h-4" />
            <span>Module {mockModules.findIndex(m => m.id === module.id) + 1}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            {module.title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-6">
            {module.description}
          </p>

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="w-5 h-5" />
              <span>{module.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <BookOpen className="w-5 h-5" />
              <span>{module.lessons} leçons</span>
            </div>
            {module.completed && (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Terminé</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progression du module</span>
              <span className="font-medium text-white">{module.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Module Content */}
        <Tabs defaultValue="contenu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="contenu" className="flex items-center space-x-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Video className="w-4 h-4" />
              <span>Contenu</span>
            </TabsTrigger>
            <TabsTrigger value="exercices" className="flex items-center space-x-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <FileText className="w-4 h-4" />
              <span>Exercices</span>
            </TabsTrigger>
            <TabsTrigger value="ressources" className="flex items-center space-x-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <BookOpen className="w-4 h-4" />
              <span>Ressources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contenu" className="space-y-6">
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Play className="w-5 h-5 text-yellow-400" />
                  <span>Introduction du module</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center mb-6">
                  <Play className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Vidéo d'introduction - {module.duration}</p>
                  <Button className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold">
                    <Play className="w-4 h-4 mr-2" />
                    Lancer la vidéo
                  </Button>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {module.content.introduction}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mt-6 mb-4">
                    Objectifs de ce module
                  </h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Comprendre les mécanismes de votre confiance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Identifier vos forces et vos défis personnels</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Appliquer des techniques concrètes au quotidien</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercices" className="space-y-6">
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Exercices pratiques</CardTitle>
                <CardDescription className="text-gray-400">
                  Mettez en pratique les concepts appris dans ce module
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {module.content.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
                      <Checkbox 
                        id={`exercise-${index}`}
                        checked={completedExercises.includes(index)}
                        onCheckedChange={() => handleExerciseComplete(index)}
                        className="mt-1 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`exercise-${index}`}
                          className={`text-gray-300 cursor-pointer ${
                            completedExercises.includes(index) ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {exercise}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h4 className="font-semibold text-yellow-400 mb-2">💡 Conseil</h4>
                  <p className="text-gray-300 text-sm">
                    Prenez votre temps pour chaque exercice. L'important n'est pas la vitesse, 
                    mais la qualité de votre réflexion et de votre mise en pratique.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ressources" className="space-y-6">
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Ressources complémentaires</CardTitle>
                <CardDescription className="text-gray-400">
                  Matériel supplémentaire pour approfondir vos connaissances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-yellow-400" />
                      <div>
                        <h4 className="font-semibold text-white">Guide PDF - Techniques d'ancrage</h4>
                        <p className="text-sm text-gray-400">Un guide pratique pour renforcer votre confiance</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-6 h-6 text-yellow-400" />
                      <div>
                        <h4 className="font-semibold text-white">Bibliographie recommandée</h4>
                        <p className="text-sm text-gray-400">Livres et articles pour aller plus loin</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                    <div className="flex items-center space-x-3">
                      <Award className="w-6 h-6 text-yellow-400" />
                      <div>
                        <h4 className="font-semibold text-white">Fiche de suivi personnel</h4>
                        <p className="text-sm text-gray-400">Template pour suivre vos progrès</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-700">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
          
          <div className="flex items-center space-x-4">
            {!module.completed && (
              <Button 
                onClick={handleCompleteModule}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marquer comme terminé
              </Button>
            )}
            
            {mockModules.findIndex(m => m.id === module.id) < mockModules.length - 1 && (
              <Button 
                onClick={() => navigate(`/module/${mockModules[mockModules.findIndex(m => m.id === module.id) + 1].id}`)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold"
              >
                Module suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;