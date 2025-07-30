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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-yellow-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                ConfianceBoost
              </span>
            </div>
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-300 hover:text-yellow-400">
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                <AvatarFallback className="bg-gray-700 text-white">UD</AvatarFallback>
              </Avatar>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bonjour {user.name} ! 👋
          </h1>
          <p className="text-gray-400">
            Continuez votre parcours vers plus de confiance en soi
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/70 font-medium">Progression globale</p>
                  <p className="text-3xl font-bold">{totalProgress}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-black/70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Modules terminés</p>
                  <p className="text-3xl font-bold text-white">{completedModules}/{mockModules.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Temps total</p>
                  <p className="text-3xl font-bold text-white">4h 30m</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/80 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Certificats</p>
                  <p className="text-3xl font-bold text-white">{user.certificates}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Progress */}
        <Card className="mb-8 bg-gray-800/80 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Target className="w-5 h-5 text-yellow-400" />
              <span>Votre progression</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Formation Confiance en Soi</span>
                <span className="text-sm text-gray-400">{totalProgress}% terminé</span>
              </div>
              <Progress value={totalProgress} className="w-full h-3" />
              <p className="text-sm text-gray-400">
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
              className={`group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gray-800/80 border-gray-700 hover:border-yellow-400/50
                ${module.completed ? 'ring-1 ring-green-400/20' : 
                  module.progress > 0 ? 'ring-1 ring-yellow-400/20' : ''}
              `}
              onClick={() => navigate(`/module/${module.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={module.completed ? "default" : module.progress > 0 ? "secondary" : "outline"}
                    className={
                      module.completed ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      module.progress > 0 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      "bg-gray-700/50 text-gray-400 border-gray-600"
                    }
                  >
                    Module {index + 1}
                  </Badge>
                  {module.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                </div>
                <CardTitle className="text-lg text-white group-hover:text-yellow-400 transition-colors">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
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
                    <span className="text-gray-400">Progression</span>
                    <span className="font-medium text-white">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Button 
                  className={`w-full mt-4 ${
                    module.completed 
                      ? "bg-green-600 hover:bg-green-700" 
                      : module.progress > 0 
                        ? "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" 
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
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
          <Card className="mt-8 bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 border-yellow-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Félicitations ! 🎉
                  </h3>
                  <p className="text-gray-300 mb-3">
                    Vous avez terminé plus de la moitié de la formation. 
                    Vous êtes sur la bonne voie pour transformer votre confiance en vous !
                  </p>
                  <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
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