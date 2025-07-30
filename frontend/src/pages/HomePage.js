import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Star, Play, Users, Award, CheckCircle, ArrowRight, BookOpen, Clock, Target, Sparkles, Zap, Trophy, Crown, Gem, Shield } from "lucide-react";
import { mockModules, mockTestimonials, mockStats } from "../components/mock";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen brand-gradient-premium relative overflow-hidden">
      {/* Ultra Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-8 -left-8 w-96 h-96 bg-yellow-500/12 rounded-full blur-3xl floating-element-premium"></div>
        <div className="absolute top-1/4 -right-8 w-128 h-128 bg-yellow-400/8 rounded-full blur-3xl floating-element-premium" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl floating-element-premium" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-yellow-300/6 rounded-full blur-3xl floating-element-premium" style={{animationDelay: '6s'}}></div>
        
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
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full opacity-80"></div>
              </div>
              <div className="relative">
                <span className="text-4xl font-black text-3d-ultra tracking-tight">
                  ConfianceBoost
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="badge-premium text-xs px-2 py-0.5">
                    <Crown className="w-3 h-3 mr-1" />
                    FORMATION PREMIUM
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#formation" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-semibold text-lg relative group">
                <span className="relative z-10">Formation</span>
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-white opacity-40 transition-all duration-300 group-hover:w-full rounded-full blur-sm"></span>
              </a>
              <a href="#temoignages" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-semibold text-lg relative group">
                <span className="relative z-10">Témoignages</span>
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-white opacity-40 transition-all duration-300 group-hover:w-full rounded-full blur-sm"></span>
              </a>
              <a href="#tarifs" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-semibold text-lg relative group">
                <span className="relative z-10">Tarifs</span>
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-white opacity-40 transition-all duration-300 group-hover:w-full rounded-full blur-sm"></span>
              </a>
              <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-6 py-3 button-3d-premium shadow-2xl">
                <Sparkles className="w-5 h-5 mr-2" />
                COMMENCER
                <Gem className="w-4 h-4 ml-2" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Ultra Premium Hero Section */}
      <section className="py-32 px-6 relative">
        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <div className="inline-flex items-center space-x-4 glass-morphism-premium text-yellow-300 px-8 py-4 rounded-full text-lg font-bold mb-12 border border-yellow-500/40 glow-effect-premium shadow-2xl">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <span className="text-3d-gold-premium">FORMATION CERTIFIANTE PREMIUM</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-bold text-sm">DISPONIBLE</span>
            </div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black mb-12 leading-tight relative">
            <span className="text-3d-white-crisp block mb-6">Développez votre</span>
            <span className="text-3d-ultra block relative">
              Confiance en Soi
              <div className="absolute -top-8 -right-12 animate-bounce">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
              </div>
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-200 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
            Une formation <span className="text-3d-gold-premium font-bold">ultra-complète et pratique</span> pour transformer votre relation à vous-même 
            et révéler votre <span className="text-3d-gold-premium font-bold">plein potentiel</span> en 6 modules progressifs premium.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-20">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-black font-black px-14 py-6 text-2xl rounded-3xl button-3d-premium glow-effect-premium group shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Play className="w-7 h-7 mr-4 group-hover:scale-125 transition-transform relative z-10" />
              <span className="relative z-10">COMMENCER MAINTENANT</span>
              <Zap className="w-6 h-6 ml-4 relative z-10" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="glass-morphism-premium border-yellow-400/60 text-yellow-400 hover:bg-yellow-400/15 px-14 py-6 text-2xl rounded-3xl button-3d-premium group shadow-2xl font-bold"
            >
              <span className="relative z-10">DÉCOUVRIR LES MODULES</span>
              <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform relative z-10" />
            </Button>
          </div>

          {/* Ultra Premium Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {[
              { value: mockStats.totalStudents + '+', label: 'Participants Transformés', icon: Users },
              { value: mockStats.completionRate + '%', label: 'Taux de Réussite', icon: Target },
              { value: mockStats.averageRating + '/5', label: 'Note Excellence', icon: Star },
              { value: mockStats.moduleCount, label: 'Modules Premium', icon: Award }
            ].map((stat, index) => (
              <div key={index} className="text-center group relative">
                <div className="card-3d-ultra glass-morphism-premium p-8 rounded-3xl border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <stat.icon className="w-8 h-8 text-black" />
                  </div>
                  <div className="text-5xl md:text-6xl font-black stat-number mb-3 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 font-bold text-lg">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra Premium Modules Section */}
      <section id="formation" className="py-32 px-6 relative section-divider-premium">
        <div className="container mx-auto max-w-8xl">
          <div className="text-center mb-24">
            <div className="inline-flex items-center space-x-3 glass-morphism-premium px-6 py-3 rounded-full mb-8 border border-yellow-500/30">
              <Shield className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-lg">PARCOURS CERTIFIÉ</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-3d-white-crisp mb-8">
              Un parcours <span className="text-3d-ultra">structuré</span> pour votre transformation
            </h2>
            <p className="text-2xl md:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              6 modules progressifs pour développer une confiance <span className="text-3d-gold-premium font-bold">authentique et durable</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mockModules.map((module, index) => (
              <Card key={module.id} className="group card-3d-ultra glass-morphism-premium border-gray-700/50 hover:border-yellow-400/60 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Premium Module Header */}
                <CardHeader className="relative z-10 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant={module.completed ? "default" : "secondary"}
                      className={`${module.completed ? "bg-green-500/25 text-green-300 border-green-500/40" : "bg-yellow-500/25 text-yellow-300 border-yellow-500/40"} font-bold px-4 py-2 text-lg badge-premium`}
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
                      <span className="text-gray-300 font-bold text-lg">Progression Premium</span>
                      <span className="text-white font-black text-xl stat-number">{module.progress}%</span>
                    </div>
                    <div className="progress-bar-3d h-4 rounded-full overflow-hidden">
                      <div 
                        className="progress-fill h-full transition-all duration-700"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full glass-morphism-premium border-gray-600 text-gray-200 hover:bg-yellow-400/15 hover:border-yellow-400/60 hover:text-yellow-300 transition-all duration-300 font-bold text-lg py-4 button-3d-premium shadow-xl group"
                    onClick={() => navigate(`/module/${module.id}`)}
                  >
                    <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    {module.completed ? "REVOIR LE MODULE" : "COMMENCER LE MODULE"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra Premium Testimonials */}
      <section id="temoignages" className="py-32 px-6 relative section-divider-premium">
        <div className="container mx-auto max-w-8xl">
          <div className="text-center mb-24">
            <div className="inline-flex items-center space-x-3 glass-morphism-premium px-6 py-3 rounded-full mb-8 border border-yellow-500/30">
              <Users className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-lg">TÉMOIGNAGES VÉRIFIÉS</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-3d-white-crisp mb-8">
              Ce que disent nos <span className="text-3d-ultra">participants</span>
            </h2>
            <p className="text-2xl md:text-3xl text-gray-200 max-w-4xl mx-auto">
              Des transformations <span className="text-3d-gold-premium font-bold">authentiques et durables</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {mockTestimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="card-3d-ultra glass-morphism-premium border-gray-700/50 hover:border-yellow-400/40 group relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <CardContent className="pt-10 p-8 relative z-10">
                  <div className="flex items-center justify-center space-x-2 mb-8">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                    ))}
                  </div>
                  <p className="text-gray-200 mb-10 italic text-xl leading-relaxed font-medium">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-5">
                    <Avatar className="w-16 h-16 ring-4 ring-yellow-400/40 shadow-xl">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-xl">{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-white text-xl mb-1">{testimonial.name}</div>
                      <div className="text-3d-gold-premium font-semibold text-lg">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra Premium Pricing */}
      <section id="tarifs" className="py-32 px-6 relative section-divider-premium">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center space-x-3 glass-morphism-premium px-6 py-3 rounded-full mb-12 border border-yellow-500/30">
            <Gem className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-lg">OFFRE EXCLUSIVE</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black text-3d-white-crisp mb-8">
            Investissez dans votre <span className="text-3d-ultra">avenir</span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-200 mb-20">
            Une formation <span className="text-3d-gold-premium font-bold">ultra-complète</span> à un prix <span className="text-3d-gold-premium font-bold">accessible</span>
          </p>

          <Card className="max-w-2xl mx-auto card-3d-ultra glass-morphism-premium border-yellow-400/40 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/12 to-transparent"></div>
            <CardHeader className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black text-center rounded-t-3xl relative p-10">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/30 to-transparent"></div>
              <div className="flex items-center justify-center space-x-3 mb-4 relative z-10">
                <Crown className="w-8 h-8" />
                <CardTitle className="text-4xl font-black">FORMATION COMPLÈTE</CardTitle>
                <Crown className="w-8 h-8" />
              </div>
              <CardDescription className="text-black/80 font-bold text-xl relative z-10">
                Accès à vie à tous les modules premium • Certificat inclus
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-12 p-10 relative z-10">
              <div className="text-center mb-12">
                <div className="text-8xl md:text-9xl font-black stat-number mb-4">97€</div>
                <div className="text-gray-300 text-2xl font-bold">Paiement unique • Sans abonnement • Garantie satisfait</div>
              </div>
              
              <ul className="space-y-6 mb-12">
                {[
                  { text: '6 modules complets premium', icon: Award },
                  { text: 'Exercices pratiques personnalisés', icon: Target },
                  { text: 'Certificat de réussite officiel', icon: Trophy },
                  { text: 'Accès à vie garanti', icon: Shield },
                  { text: 'Support expert par email', icon: Users }
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <feature.icon className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-gray-200 font-bold text-xl">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-black font-black py-8 text-2xl rounded-3xl button-3d-premium glow-effect-premium group shadow-2xl relative overflow-hidden"
                onClick={() => navigate('/dashboard')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Trophy className="w-8 h-8 mr-4 group-hover:rotate-12 transition-transform relative z-10" />
                <span className="relative z-10">COMMENCER MAINTENANT</span>
                <Sparkles className="w-6 h-6 ml-4 relative z-10" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ultra Premium Footer */}
      <footer className="bg-black/90 text-white py-20 px-6 border-t border-yellow-500/20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="container mx-auto max-w-8xl relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center button-3d-premium glow-effect-premium shadow-2xl logo-3d">
                <Target className="w-10 h-10 text-black drop-shadow-lg" />
              </div>
              <div>
                <span className="text-5xl font-black text-3d-ultra">ConfianceBoost</span>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className="badge-premium text-sm px-3 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    FORMATION PREMIUM
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-10 text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
              Révélez votre potentiel et développez une confiance authentique avec la formation premium #1 en France
            </p>
            <div className="text-gray-500 text-lg font-medium">
              © 2024 ConfianceBoost Premium. Tous droits réservés. | Transformez votre vie aujourd'hui.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;