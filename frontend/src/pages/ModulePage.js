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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Module non trouvé</h2>
            <Button onClick={() => navigate('/dashboard')}>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  ConfianceBoost
                </span>
              </div>
            </div>
            <Badge 
              variant={module.completed ? "default" : "secondary"}
              className={module.completed ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
            >
              {module.completed ? "Terminé" : "En cours"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span>Formation</span>
            <ChevronRight className="w-4 h-4" />
            <span>Module {mockModules.findIndex(m => m.id === module.id) + 1}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {module.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {module.description}
          </p>

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{module.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <BookOpen className="w-5 h-5" />
              <span>{module.lessons} leçons</span>
            </div>
            {module.completed && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Terminé</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progression du module</span>
              <span className="font-medium">{module.progress}%</span>
            </div>
            <Progress value={module.progress} className="w-full h-3" />
          </div>
        </div>

        {/* Module Content */}
        <Tabs defaultValue="contenu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contenu" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Contenu</span>
            </TabsTrigger>
            <TabsTrigger value="exercices" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Exercices</span>
            </TabsTrigger>
            <TabsTrigger value="ressources" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Ressources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contenu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5 text-orange-600" />
                  <span>Introduction du module</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
                  <Play className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Vidéo d'introduction - {module.duration}</p>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Lancer la vidéo
                  </Button>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {module.content.introduction}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                    Objectifs de ce module
                  </h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Comprendre les mécanismes de votre confiance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Identifier vos forces et vos défis personnels</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Appliquer des techniques concrètes au quotidien</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exercices pratiques</CardTitle>
                <CardDescription>
                  Mettez en pratique les concepts appris dans ce module
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {module.content.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                      <Checkbox 
                        id={`exercise-${index}`}
                        checked={completedExercises.includes(index)}
                        onCheckedChange={() => handleExerciseComplete(index)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`exercise-${index}`}
                          className={`text-gray-900 cursor-pointer ${
                            completedExercises.includes(index) ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {exercise}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">💡 Conseil</h4>
                  <p className="text-orange-800 text-sm">
                    Prenez votre temps pour chaque exercice. L'important n'est pas la vitesse, 
                    mais la qualité de votre réflexion et de votre mise en pratique.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ressources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ressources complémentaires</CardTitle>
                <CardDescription>
                  Matériel supplémentaire pour approfondir vos connaissances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-orange-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Guide PDF - Techniques d'ancrage</h4>
                        <p className="text-sm text-gray-600">Un guide pratique pour renforcer votre confiance</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Bibliographie recommandée</h4>
                        <p className="text-sm text-gray-600">Livres et articles pour aller plus loin</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Award className="w-6 h-6 text-orange-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Fiche de suivi personnel</h4>
                        <p className="text-sm text-gray-600">Template pour suivre vos progrès</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
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
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
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