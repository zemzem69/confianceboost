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
  Sparkles,
  Trophy,
  Star,
  Crown,
  Shield,
  TrendingUp,
  Calendar,
  Menu
} from "lucide-react";
import { mockModules, mockUser } from "../components/mock";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user] = useState(mockUser);

  const completedModules = mockModules.filter(m => m.completed).length;
  const totalProgress = Math.round((completedModules / mockModules.length) * 100);

  return (
    <div className="min-h-screen brand-gradient-clean relative overflow-hidden">
      {/* Clean Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-64 h-64 bg-yellow-500/8 rounded-full blur-2xl floating-element-clean"></div>
        <div className="absolute top-1/3 -right-4 w-80 h-80 bg-yellow-400/6 rounded-full blur-2xl floating-element-clean" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-yellow-600/5 rounded-full blur-2xl floating-element-clean" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Professional Header */}
      <header className="glass-morphism-clean sticky top-0 z-50 border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center glow-effect-clean">
                  <Target className="w-6 h-6 text-black" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-bold text-professional-gold">
                  ConfianceBoost
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="badge-clean text-xs px-2 py-1">
                    Dashboard Premium
                  </Badge>
                  <div className="hidden sm:flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="hidden md:flex text-gray-300 hover:text-yellow-400 font-semibold button-professional">
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <div className="text-white font-semibold">{user.name}</div>
                  <div className="text-yellow-400 text-sm font-medium">Membre Premium</div>
                </div>
                <Avatar className="cursor-pointer ring-2 ring-yellow-400/30 hover:ring-yellow-400/50 transition-all w-10 h-10 md:w-12 md:h-12">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold">UD</AvatarFallback>
                </Avatar>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Professional Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-mobile-hero text-3xl md:text-4xl lg:text-5xl font-black text-professional-white mb-4">
            Bonjour <span className="text-professional-gold">{user.name}</span> ! 
            <span className="inline-block ml-2 animate-bounce">👋</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            Continuez votre parcours vers plus de <span className="text-professional-gold font-semibold">confiance en soi</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Badge className="badge-clean px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              Progression Active
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 font-semibold">
              <Shield className="w-4 h-4 mr-2" />
              Accès à Vie
            </Badge>
          </div>
        </div>

        {/* Professional Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <Card className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-500 text-black card-professional glow-effect-clean relative overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 md:mb-0">
                  <p className="text-black/80 font-bold mb-1 text-sm md:text-base">Progression</p>
                  <p className="text-2xl md:text-4xl font-black stat-number-clean">{totalProgress}%</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-black/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional glass-morphism-clean border-gray-700/50 hover:border-green-400/30 group">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 md:mb-0">
                  <p className="text-gray-300 font-semibold mb-1 text-sm md:text-base">Modules</p>
                  <p className="text-2xl md:text-4xl font-black text-white group-hover:text-green-400 transition-colors stat-number-clean">{completedModules}/{mockModules.length}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional glass-morphism-clean border-gray-700/50 hover:border-blue-400/30 group">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 md:mb-0">
                  <p className="text-gray-300 font-semibold mb-1 text-sm md:text-base">Temps</p>
                  <p className="text-2xl md:text-4xl font-black text-white group-hover:text-blue-400 transition-colors stat-number-clean">4h 30m</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional glass-morphism-clean border-gray-700/50 hover:border-yellow-400/30 group">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 md:mb-0">
                  <p className="text-gray-300 font-semibold mb-1 text-sm md:text-base">Certificats</p>
                  <p className="text-2xl md:text-4xl font-black text-white group-hover:text-yellow-400 transition-colors stat-number-clean">{user.certificates}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Current Progress */}
        <Card className="mb-12 card-professional glass-morphism-clean border-gray-700/50 hover:border-yellow-400/30 group">
          <CardHeader className="p-6 md:p-8">
            <CardTitle className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-xl md:text-2xl font-black text-professional-white">Votre Progression Premium</span>
                <div className="text-yellow-400 font-semibold mt-1">Formation Confiance en Soi</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-6 md:pb-8">
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-gray-200 font-semibold text-lg md:text-xl">Formation Premium Active</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">{totalProgress}% terminé</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Excellent</span>
                  </div>
                </div>
              </div>
              <div className="progress-bar-clean h-4 rounded-full overflow-hidden">
                <div 
                  className="progress-fill h-full transition-all duration-1000"
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-black text-yellow-400 mb-1">{completedModules}</div>
                  <div className="text-gray-400 font-medium text-sm">Terminés</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-blue-400 mb-1">{mockModules.length - completedModules}</div>
                  <div className="text-gray-400 font-medium text-sm">Restants</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-green-400 mb-1">94%</div>
                  <div className="text-gray-400 font-medium text-sm">Réussite</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Vous avez terminé <span className="text-professional-gold font-semibold">{completedModules} modules premium</span> sur {mockModules.length}. 
                Continuez ainsi pour débloquer votre <span className="text-professional-gold font-semibold">certificat premium</span> !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Modules Grid */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-professional-white">
              Mes Modules <span className="text-professional-gold">Premium</span>
            </h2>
            <div className="flex items-center space-x-3">
              <Badge className="badge-clean px-3 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                6 Modules Disponibles
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockModules.map((module, index) => (
              <Card 
                key={module.id} 
                className={`group card-professional glass-morphism-clean border-gray-700/50 hover:border-yellow-400/40 cursor-pointer relative overflow-hidden
                  ${module.completed ? 'ring-1 ring-green-400/20' : 
                    module.progress > 0 ? 'ring-1 ring-yellow-400/20' : ''}
                `}
                onClick={() => navigate(`/module/${module.id}`)}
              >
                <CardHeader className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      className={`font-semibold px-3 py-1 badge-clean ${
                        module.completed ? "bg-green-500/20 text-green-400 border-green-500/30" :
                        module.progress > 0 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                        "bg-gray-700/50 text-gray-400 border-gray-600"
                      }`}
                    >
                      Module {index + 1}
                    </Badge>
                    {module.completed && (
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg md:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors mb-3">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center justify-between text-gray-400 mb-6 text-sm">
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
                      <span className="text-white font-bold stat-number-clean">{module.progress}%</span>
                    </div>
                    <div className="progress-bar-clean h-3 rounded-full overflow-hidden">
                      <div 
                        className="progress-fill h-full transition-all duration-700"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button 
                    className={`w-full font-semibold py-3 button-professional ${
                      module.completed 
                        ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                        : module.progress > 0 
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black" 
                          : "glass-morphism-clean border-gray-600 text-gray-200 hover:bg-yellow-400/10 hover:border-yellow-400/60"
                    }`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {module.completed ? "Revoir" : module.progress > 0 ? "Continuer" : "Commencer"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Professional Achievement Section */}
        {completedModules >= 3 && (
          <Card className="card-professional glass-morphism-clean border-yellow-400/30 relative overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center glow-effect-clean">
                  <Trophy className="w-8 h-8 md:w-10 md:h-10 text-black" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-black text-professional-white mb-3">
                    Félicitations Premium ! 
                    <span className="inline-block ml-2 animate-bounce">🎉</span>
                  </h3>
                  <p className="text-gray-200 mb-4 md:mb-6 text-lg leading-relaxed">
                    Vous avez terminé plus de la moitié de la formation premium. 
                    Vous êtes sur la <span className="text-professional-gold font-semibold">voie de l'excellence</span> !
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button className="glass-morphism-clean border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-semibold px-6 py-3 button-professional group w-full sm:w-auto">
                      <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Voir mes Achievements
                    </Button>
                    <Badge className="badge-clean px-4 py-2">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Progression Excellente
                    </Badge>
                  </div>
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