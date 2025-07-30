import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle, 
  Play, 
  BarChart3, 
  Target,
  Home,
  User,
  Settings
} from "lucide-react";
import { mockModules, mockUser } from "../components/mock";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user] = useState(mockUser);

  const completedModules = mockModules.filter(m => m.completed).length;
  const totalProgress = Math.round((completedModules / mockModules.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                ConfianceBoost
              </span>
            </div>
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-700 hover:text-orange-600">
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                <AvatarFallback>UD</AvatarFallback>
              </Avatar>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {user.name} ! 👋
          </h1>
          <p className="text-gray-600">
            Continuez votre parcours vers plus de confiance en soi
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Progression globale</p>
                  <p className="text-3xl font-bold">{totalProgress}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Modules terminés</p>
                  <p className="text-3xl font-bold text-gray-900">{completedModules}/{mockModules.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Temps total</p>
                  <p className="text-3xl font-bold text-gray-900">4h 30m</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Certificats</p>
                  <p className="text-3xl font-bold text-gray-900">{user.certificates}</p>
                </div>
                <Award className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span>Votre progression</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Formation Confiance en Soi</span>
                <span className="text-sm text-gray-500">{totalProgress}% terminé</span>
              </div>
              <Progress value={totalProgress} className="w-full h-3" />
              <p className="text-sm text-gray-600">
                Vous avez terminé {completedModules} modules sur {mockModules.length}. 
                Continuez ainsi pour débloquer votre certificat !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockModules.map((module, index) => (
            <Card 
              key={module.id} 
              className={`group hover:shadow-xl transition-all duration-300 cursor-pointer
                ${module.completed ? 'border-green-200 bg-green-50/30' : 
                  module.progress > 0 ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200'}
              `}
              onClick={() => navigate(`/module/${module.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={module.completed ? "default" : module.progress > 0 ? "secondary" : "outline"}
                    className={
                      module.completed ? "bg-green-100 text-green-800" :
                      module.progress > 0 ? "bg-orange-100 text-orange-800" :
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    Module {index + 1}
                  </Badge>
                  {module.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                </div>
                <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{module.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{module.lessons} leçons</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progression</span>
                    <span className="font-medium">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="w-full h-2" />
                </div>

                <Button 
                  className={`w-full mt-4 ${
                    module.completed 
                      ? "bg-green-600 hover:bg-green-700" 
                      : module.progress > 0 
                        ? "bg-orange-500 hover:bg-orange-600" 
                        : "bg-gray-600 hover:bg-gray-700"
                  } text-white`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {module.completed ? "Revoir" : module.progress > 0 ? "Continuer" : "Commencer"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Section */}
        {completedModules >= 3 && (
          <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Félicitations ! 🎉
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Vous avez terminé plus de la moitié de la formation. 
                    Vous êtes sur la bonne voie pour transformer votre confiance en vous !
                  </p>
                  <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                    Voir mes achievements
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;