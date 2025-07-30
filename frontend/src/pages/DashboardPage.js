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
  Star,
  Crown,
  Gem,
  Shield,
  TrendingUp,
  Calendar,
  Brain
} from "lucide-react";
import { mockModules, mockUser } from "../components/mock";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user] = useState(mockUser);

  const completedModules = mockModules.filter(m => m.completed).length;
  const totalProgress = Math.round((completedModules / mockModules.length) * 100);

  return (
    <div className="min-h-screen brand-gradient-premium relative overflow-hidden">
      {/* Ultra Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-8 -left-8 w-96 h-96 bg-yellow-500/12 rounded-full blur-3xl floating-element-premium"></div>
        <div className="absolute top-1/4 -right-8 w-128 h-128 bg-yellow-400/8 rounded-full blur-3xl floating-element-premium" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl floating-element-premium" style={{animationDelay: '4s'}}></div>
        
        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,215,0,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Ultra Premium Header */}
      <header className="glass-morphism-premium sticky top-0 z-50 border-b border-yellow-500/30">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative logo-3d">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center button-3d-premium glow-effect-premium shadow-2xl">
                  <Target className="w-8 h-8 text-black drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg">
                  <div className="w-full h-full rounded-full bg-white opacity-30 animate-ping"></div>
                </div>
              </div>
              <div className="relative">
                <span className="text-4xl font-black text-3d-ultra tracking-tight">
                  ConfianceBoost
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="badge-premium text-xs px-2 py-0.5">
                    <Crown className="w-3 h-3 mr-1" />
                    DASHBOARD PREMIUM
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <nav className="flex items-center space-x-8">
              <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-300 hover:text-yellow-400 font-bold text-lg group button-3d-premium">
                <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                ACCUEIL
              </Button>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-bold text-lg">{user.name}</div>
                  <div className="text-yellow-400 text-sm font-medium">Membre Premium</div>
                </div>
                <Avatar className="cursor-pointer ring-4 ring-yellow-400/40 hover:ring-yellow-400/60 transition-all shadow-xl w-14 h-14">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=56&h=56&fit=crop&crop=face" />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-xl">UD</AvatarFallback>
                </Avatar>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-8xl relative z-10">
        {/* Ultra Premium Welcome Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-3d-white-crisp mb-6">
            Bonjour <span className="text-3d-ultra">{user.name}</span> ! 
            <span className="inline-block ml-4 animate-bounce">👋</span>
          </h1>
          <p className="text-2xl text-gray-300 font-medium max-w-3xl mx-auto">
            Continuez votre parcours vers plus de <span className="text-3d-gold-premium font-bold">confiance en soi</span> avec votre dashboard premium
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Badge className="badge-premium px-6 py-2 text-lg">
              <Trophy className="w-5 h-5 mr-2" />
              PROGRESSION ACTIVE
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/40 px-6 py-2 text-lg font-bold">
              <Shield className="w-5 h-5 mr-2" />
              ACCÈS À VIE
            </Badge>
          </div>
        </div>

        {/* Ultra Premium Progress Overview */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-500 text-black card-3d-ultra glow-effect-premium relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/30 to-transparent"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/80 font-black mb-2 text-lg">PROGRESSION GLOBALE</p>
                  <p className="text-5xl font-black stat-number">{totalProgress}%</p>
                </div>
                <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-10 h-10 text-black drop-shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d-ultra glass-morphism-premium border-gray-700/50 hover:border-green-400/40 group shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 font-bold mb-2 text-lg">MODULES TERMINÉS</p>
                  <p className="text-5xl font-black text-white group-hover:text-green-400 transition-colors stat-number">{completedModules}/{mockModules.length}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d-ultra glass-morphism-premium border-gray-700/50 hover:border-blue-400/40 group shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 font-bold mb-2 text-lg">TEMPS TOTAL</p>
                  <p className="text-5xl font-black text-white group-hover:text-blue-400 transition-colors stat-number">4h 30m</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d-ultra glass-morphism-premium border-gray-700/50 hover:border-yellow-400/40 group shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 font-bold mb-2 text-lg">CERTIFICATS</p>
                  <p className="text-5xl font-black text-white group-hover:text-yellow-400 transition-colors stat-number">{user.certificates}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-10 h-10 text-black drop-shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ultra Premium Current Progress */}
        <Card className="mb-16 card-3d-ultra glass-morphism-premium border-gray-700/50 hover:border-yellow-400/40 group shadow-2xl">
          <CardHeader className="p-10">
            <CardTitle className="flex items-center space-x-4 text-white">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-black" />
              </div>
              <div>
                <span className="text-3xl font-black text-3d-white-crisp">VOTRE PROGRESSION PREMIUM</span>
                <div className="text-yellow-400 text-lg font-bold mt-1">Formation Confiance en Soi</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-200 font-bold text-2xl">Formation Premium Active</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-lg">{totalProgress}% terminé</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold text-xl">EXCELLENT</span>
                  </div>
                </div>
              </div>
              <div className="progress-bar-3d h-6 rounded-full overflow-hidden">
                <div 
                  className="progress-fill h-full transition-all duration-1000"
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-yellow-400 mb-2">{completedModules}</div>
                  <div className="text-gray-400 font-medium">Modules terminés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">{mockModules.length - completedModules}</div>
                  <div className="text-gray-400 font-medium">Modules restants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400 mb-2">94%</div>
                  <div className="text-gray-400 font-medium">Taux de réussite</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                Vous avez terminé <span className="text-3d-gold-premium font-bold">{completedModules} modules premium</span> sur {mockModules.length}. 
                Continuez ainsi pour débloquer votre <span className="text-3d-gold-premium font-bold">certificat premium officiel</span> !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ultra Premium Modules Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-black text-3d-white-crisp">
              MES MODULES <span className="text-3d-gold-premium">PREMIUM</span>
            </h2>
            <div className="flex items-center space-x-4">
              <Badge className="badge-premium px-4 py-2 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                6 MODULES DISPONIBLES
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mockModules.map((module, index) => (
              <Card 
                key={module.id} 
                className={`group card-3d-ultra glass-morphism-premium border-gray-700/50 hover:border-yellow-400/60 cursor-pointer relative overflow-hidden shadow-2xl
                  ${module.completed ? 'ring-2 ring-green-400/30' : 
                    module.progress > 0 ? 'ring-2 ring-yellow-400/30' : ''}
                `}
                onClick={() => navigate(`/module/${module.id}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardHeader className="relative z-10 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant={module.completed ? "default" : module.progress > 0 ? "secondary" : "outline"}
                      className={`font-bold px-4 py-2 text-lg badge-premium ${
                        module.completed ? "bg-green-500/25 text-green-300 border-green-500/40" :
                        module.progress > 0 ? "bg-yellow-500/25 text-yellow-300 border-yellow-500/40" :
                        "bg-gray-700/50 text-gray-300 border-gray-600"
                      }`}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      MODULE {index + 1}
                    </Badge>
                    {module.completed && (
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-black text-white group-hover:text-3d-gold-premium transition-all duration-300 mb-4">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 leading-relaxed text-lg font-medium">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-8 pt-0">
                  <div className="flex items-center justify-between text-gray-400 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-lg">{module.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-lg">{module.lessons} leçons</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-bold text-lg">Progression</span>
                      <span className="text-white font-black text-2xl stat-number">{module.progress}%</span>
                    </div>
                    <div className="progress-bar-3d h-4 rounded-full overflow-hidden">
                      <div 
                        className="progress-fill h-full transition-all duration-700"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button 
                    className={`w-full font-bold text-lg py-4 button-3d-premium shadow-xl group ${
                      module.completed 
                        ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                        : module.progress > 0 
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black" 
                          : "glass-morphism-premium border-gray-600 text-gray-200 hover:bg-yellow-400/15 hover:border-yellow-400/60"
                    }`}
                  >
                    <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    {module.completed ? "REVOIR" : module.progress > 0 ? "CONTINUER" : "COMMENCER"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ultra Premium Achievement Section */}
        {completedModules >= 3 && (
          <Card className="card-3d-ultra glass-morphism-premium border-yellow-400/40 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/12 to-transparent"></div>
            <CardContent className="p-12 relative z-10">
              <div className="flex items-center space-x-8">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center button-3d-premium glow-effect-premium shadow-2xl">
                  <Trophy className="w-12 h-12 text-black drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl font-black text-3d-white-crisp mb-4">
                    FÉLICITATIONS PREMIUM ! 
                    <span className="inline-block ml-3 animate-bounce">🎉</span>
                  </h3>
                  <p className="text-gray-200 mb-6 text-xl leading-relaxed font-medium">
                    Vous avez terminé plus de la moitié de la formation premium. 
                    Vous êtes sur la <span className="text-3d-gold-premium font-bold">voie de l'excellence</span> pour transformer votre confiance en vous !
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button className="glass-morphism-premium border-yellow-400/60 text-yellow-400 hover:bg-yellow-400/15 font-bold text-lg px-8 py-3 button-3d-premium shadow-xl group">
                      <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                      VOIR MES ACHIEVEMENTS
                    </Button>
                    <Badge className="badge-premium px-6 py-3 text-lg">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      PROGRESSION EXCELLENTE
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