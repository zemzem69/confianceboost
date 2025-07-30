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
                    Formation Premium
                  </Badge>
                  <div className="hidden sm:flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#formation" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
                Formation
              </a>
              <a href="#temoignages" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
                Témoignages
              </a>
              <a href="#tarifs" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
                Tarifs
              </a>
              <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold button-professional px-6 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Commencer
              </Button>
            </nav>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-gray-300 hover:text-yellow-400"
              onClick={() => navigate('/dashboard')}
            >
              <Play className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Professional Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center space-x-3 glass-morphism-clean text-yellow-300 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold mb-8 border border-yellow-500/30 glow-effect-clean">
            <Trophy className="w-4 md:w-5 h-4 md:h-5 text-yellow-400" />
            <span>Formation Certifiante Premium</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-mobile-hero text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
            <span className="text-professional-white block mb-2 md:mb-4">Développez votre</span>
            <span className="text-professional-gold block">
              Confiance en Soi
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Une formation <span className="text-professional-gold font-semibold">complète et pratique</span> pour transformer votre relation à vous-même 
            et révéler votre <span className="text-professional-gold font-semibold">plein potentiel</span> en 6 modules progressifs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12 md:mb-16 px-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-bold px-8 py-4 text-lg rounded-xl button-professional glow-effect-clean group"
            >
              <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Commencer maintenant
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto glass-morphism-clean border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 px-8 py-4 text-lg rounded-xl button-professional"
            >
              Découvrir les modules
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>

          {/* Professional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            {[
              { value: mockStats.totalStudents + '+', label: 'Participants', icon: Users },
              { value: mockStats.completionRate + '%', label: 'Taux de réussite', icon: Target },
              { value: mockStats.averageRating + '/5', label: 'Note moyenne', icon: Star },
              { value: mockStats.moduleCount, label: 'Modules', icon: Award }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="card-professional glass-morphism-clean p-4 md:p-6 rounded-2xl border border-yellow-500/15 hover:border-yellow-400/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black stat-number-clean mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-medium text-sm md:text-base">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Modules Section */}
      <section id="formation" className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center space-x-3 glass-morphism-clean px-4 py-2 rounded-full mb-6 border border-yellow-500/20">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">Parcours Certifié</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-professional-white mb-6">
              Un parcours <span className="text-professional-gold">structuré</span> pour votre transformation
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              6 modules progressifs pour développer une confiance <span className="text-professional-gold font-semibold">authentique et durable</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mockModules.map((module, index) => (
              <Card key={module.id} className="group card-professional glass-morphism-clean border-gray-700/50 hover:border-yellow-400/40 backdrop-blur-xl relative overflow-hidden">
                <CardHeader className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      className={`${module.completed ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"} font-semibold px-3 py-1 badge-clean`}
                    >
                      Module {index + 1}
                    </Badge>
                    {module.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors mb-3">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{module.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">{module.lessons} leçons</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-medium">Progression</span>
                      <span className="text-white font-bold">{module.progress}%</span>
                    </div>
                    <div className="progress-bar-clean h-2 rounded-full overflow-hidden">
                      <div 
                        className="progress-fill h-full transition-all duration-500"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Button 
                    className="w-full glass-morphism-clean border-gray-600 text-gray-300 hover:bg-yellow-400/10 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 font-semibold button-professional"
                    onClick={() => navigate(`/module/${module.id}`)}
                  >
                    {module.completed ? "Revoir" : "Commencer"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Testimonials */}
      <section id="temoignages" className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center space-x-3 glass-morphism-clean px-4 py-2 rounded-full mb-6 border border-yellow-500/20">
              <Users className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">Témoignages Vérifiés</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-professional-white mb-6">
              Ce que disent nos <span className="text-professional-gold">participants</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Des transformations <span className="text-professional-gold font-semibold">authentiques et durables</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mockTestimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="card-professional glass-morphism-clean border-gray-700/50 hover:border-yellow-400/30 group relative overflow-hidden">
                <CardContent className="pt-6 p-6">
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 ring-2 ring-yellow-400/30">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold">{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-yellow-400 font-medium text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Pricing */}
      <section id="tarifs" className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-3 glass-morphism-clean px-4 py-2 rounded-full mb-8 border border-yellow-500/20">
            <Gem className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">Offre Exclusive</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-professional-white mb-6">
            Investissez dans votre <span className="text-professional-gold">avenir</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12">
            Une formation <span className="text-professional-gold font-semibold">complète</span> à un prix <span className="text-professional-gold font-semibold">accessible</span>
          </p>

          <Card className="max-w-lg mx-auto card-professional glass-morphism-clean border-yellow-400/30 relative overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black text-center rounded-t-2xl p-8">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Crown className="w-6 h-6" />
                <CardTitle className="text-2xl md:text-3xl font-black">Formation Complète</CardTitle>
              </div>
              <CardDescription className="text-black/80 font-semibold text-lg">
                Accès à vie à tous les modules premium
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 p-8">
              <div className="text-center mb-8">
                <div className="text-5xl md:text-6xl font-black stat-number-clean mb-3">97€</div>
                <div className="text-gray-400 text-lg font-medium">Paiement unique • Sans abonnement</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  '6 modules complets premium',
                  'Exercices pratiques personnalisés',
                  'Certificat de réussite officiel',
                  'Accès à vie garanti',
                  'Support expert par email'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-bold py-4 text-xl rounded-2xl button-professional glow-effect-clean group"
                onClick={() => navigate('/dashboard')}
              >
                <Trophy className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                Commencer maintenant
                <Sparkles className="w-4 h-4 ml-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-black/80 text-white py-12 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center glow-effect-clean">
                <Target className="w-8 h-8 text-black" />
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-black text-professional-gold">ConfianceBoost</span>
                <div className="text-yellow-400/80 font-medium text-sm">Formation Premium</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 text-lg max-w-2xl mx-auto">
              Révélez votre potentiel et développez une confiance authentique
            </p>
            <div className="text-gray-500 text-sm">
              © 2024 ConfianceBoost. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;