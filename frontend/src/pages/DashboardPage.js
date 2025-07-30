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
  Settings,
  Sparkles,
  Trophy,
  Zap,
  Star
} from "lucide-react";
import { mockModules, mockUser } from "../components/mock";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user] = useState(mockUser);

  const completedModules = mockModules.filter(m => m.completed).length;
  const totalProgress = Math.round((completedModules / mockModules.length) * 100);

  return (
    <div className="min-h-screen brand-gradient relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl floating-element"></div>
        <div className="absolute top-1/3 -right-4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-yellow-600/8 rounded-full blur-3xl floating-element" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="glass-morphism sticky top-0 z-50 border-b border-yellow-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center button-3d glow-effect">
                  <Target className="w-7 h-7 text-black drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-3xl font-black text-3d-gold tracking-tight">
                  ConfianceBoost
                </span>
                <div className="text-xs text-yellow-400/80 font-medium tracking-widest uppercase">Dashboard Premium</div>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-300 hover:text-yellow-400 font-medium group">
                <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Accueil
              </Button>
              <Avatar className="cursor-pointer ring-2 ring-yellow-400/30 hover:ring-yellow-400/50 transition-all">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold">UD</AvatarFallback>
              </Avatar>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl relative z-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-3d-white mb-4">
            Bonjour <span className="text-3d-gold">{user.name}</span> ! 
            <span className="inline-block ml-3 animate-bounce">👋</span>
          </h1>
          <p className="text-xl text-gray-400">
            Continuez votre parcours vers plus de <span className="text-yellow-400 font-semibold">confiance en soi</span>
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-500 text-black card-3d glow-effect relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-transparent"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/80 font-bold mb-1">Progression globale</p>
                  <p className="text-4xl font-black">{totalProgress}%</p>
                </div>
                <BarChart3 className="w-10 h-10 text-black/70 drop-shadow-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d glass-morphism border-gray-700/50 hover:border-yellow-400/30 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-medium mb-1">Modules terminés</p>
                  <p className="text-4xl font-black text-white group-hover:text-yellow-400 transition-colors">{completedModules}/{mockModules.length}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-400 drop-shadow-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d glass-morphism border-gray-700/50 hover:border-blue-400/30 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-medium mb-1">Temps total</p>
                  <p className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors">4h 30m</p>
                </div>
                <Clock className="w-10 h-10 text-blue-400 drop-shadow-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d glass-morphism border-gray-700/50 hover:border-yellow-400/30 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-medium mb-1">Certificats</p>
                  <p className="text-4xl font-black text-white group-hover:text-yellow-400 transition-colors">{user.certificates}</p>
                </div>
                <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Progress */}
        <Card className="mb-12 card-3d glass-morphism border-gray-700/50 hover:border-yellow-400/30 group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-white">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-black" />
              </div>
              <span className="text-2xl font-black text-3d-white">Votre progression</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold text-lg">Formation Confiance en Soi</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{totalProgress}% terminé</span>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-4 rounded-full transition-all duration-500 glow-effect"
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Vous avez terminé <span className="text-yellow-400 font-semibold">{completedModules} modules</span> sur {mockModules.length}. 
                Continuez ainsi pour débloquer votre <span className="text-yellow-400 font-semibold">certificat premium</span> !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockModules.map((module, index) => (
            <Card 
              key={module.id} 
              className={`group card-3d glass-morphism border-gray-700/50 hover:border-yellow-400/50 cursor-pointer relative overflow-hidden
                ${module.completed ? 'ring-1 ring-green-400/20' : 
                  module.progress > 0 ? 'ring-1 ring-yellow-400/20' : ''}
              `}
              onClick={() => navigate(`/module/${module.id}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    variant={module.completed ? "default" : module.progress > 0 ? "secondary" : "outline"}
                    className={`font-bold px-3 py-1 ${
                      module.completed ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      module.progress > 0 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      "bg-gray-700/50 text-gray-400 border-gray-600"
                    }`}
                  >
                    Module {index + 1}
                  </Badge>
                  {module.completed && <CheckCircle className="w-6 h-6 text-green-400 drop-shadow-lg" />}
                </div>
                <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-gray-400 leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{module.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">{module.lessons} leçons</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-medium">Progression</span>
                    <span className="font-bold text-white">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all duration-500 glow-effect"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Button 
                  className={`w-full font-bold button-3d ${
                    module.completed 
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                      : module.progress > 0 
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black" 
                        : "bg-gray-700/50 hover:bg-gray-600/50 text-white border border-gray-600"
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
          <Card className="mt-12 card-3d glass-morphism border-yellow-400/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center button-3d glow-effect">
                  <Trophy className="w-10 h-10 text-black drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-3d-white mb-3">
                    Félicitations ! 
                    <span className="inline-block ml-2 animate-bounce">🎉</span>
                  </h3>
                  <p className="text-gray-300 mb-4 text-lg leading-relaxed">
                    Vous avez terminé plus de la moitié de la formation. 
                    Vous êtes sur la <span className="text-yellow-400 font-semibold">bonne voie</span> pour transformer votre confiance en vous !
                  </p>
                  <Button variant="outline" className="glass-morphism border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-semibold button-3d group">
                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
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