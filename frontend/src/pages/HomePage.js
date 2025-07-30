import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Star, Play, Users, Award, CheckCircle, ArrowRight, BookOpen, Clock, Target, Sparkles, Zap, Trophy } from "lucide-react";
import { mockModules, mockTestimonials, mockStats } from "../components/mock";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

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
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-3xl font-black text-3d-gold tracking-tight">
                  ConfianceBoost
                </span>
                <div className="text-xs text-yellow-400/80 font-medium tracking-widest uppercase">Formation Premium</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#formation" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium relative group">
                Formation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#temoignages" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium relative group">
                Témoignages
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#tarifs" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium relative group">
                Tarifs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-black font-bold button-3d">
                <Sparkles className="w-4 h-4 mr-2" />
                Commencer
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center space-x-3 glass-morphism text-yellow-300 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-yellow-500/30 glow-effect">
            <Trophy className="w-5 h-5" />
            <span>Formation Certifiante Premium</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="text-3d-white block mb-4">Développez votre</span>
            <span className="text-3d-gold block relative">
              Confiance en Soi
              <div className="absolute -top-4 -right-8 text-2xl animate-bounce">✨</div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Une formation <span className="text-yellow-400 font-semibold">complète et pratique</span> pour transformer votre relation à vous-même 
            et révéler votre <span className="text-yellow-400 font-semibold">plein potentiel</span> en 6 modules progressifs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-black font-bold px-10 py-5 text-xl rounded-2xl button-3d glow-effect group"
            >
              <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Commencer maintenant
              <Zap className="w-5 h-5 ml-3" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="glass-morphism border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 px-10 py-5 text-xl rounded-2xl button-3d group"
            >
              Découvrir les modules
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: mockStats.totalStudents + '+', label: 'Participants Transformés' },
              { value: mockStats.completionRate + '%', label: 'Taux de Réussite' },
              { value: mockStats.averageRating + '/5', label: 'Note Excellence' },
              { value: mockStats.moduleCount, label: 'Modules Premium' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-black text-3d-gold mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="formation" className="py-24 px-6 relative section-divider">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-3d-white mb-6">
              Un parcours <span className="text-3d-gold">structuré</span> pour votre transformation
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              6 modules progressifs pour développer une confiance <span className="text-yellow-400 font-semibold">authentique et durable</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockModules.map((module, index) => (
              <Card key={module.id} className="group card-3d glass-morphism border-gray-700/50 hover:border-yellow-400/50 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant={module.completed ? "default" : "secondary"}
                      className={`${module.completed ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"} font-bold px-3 py-1`}
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
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-medium">Progression</span>
                      <span className="text-white font-bold">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all duration-500 glow-effect"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full glass-morphism border-gray-600 text-gray-300 hover:bg-yellow-400/10 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 font-semibold button-3d"
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

      {/* Testimonials */}
      <section id="temoignages" className="py-24 px-6 relative section-divider">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-3d-white mb-6">
              Ce que disent nos <span className="text-3d-gold">participants</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300">
              Des transformations <span className="text-yellow-400 font-semibold">authentiques et durables</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="card-3d glass-morphism border-gray-700/50 hover:border-yellow-400/30 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="pt-8 relative z-10">
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 ring-2 ring-yellow-400/30">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold">{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-white text-lg">{testimonial.name}</div>
                      <div className="text-yellow-400 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-24 px-6 relative section-divider">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-5xl md:text-6xl font-black text-3d-white mb-6">
            Investissez dans votre <span className="text-3d-gold">avenir</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-16">
            Une formation <span className="text-yellow-400 font-semibold">complète</span> à un prix <span className="text-yellow-400 font-semibold">accessible</span>
          </p>

          <Card className="max-w-lg mx-auto card-3d glass-morphism border-yellow-400/30 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent"></div>
            <CardHeader className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black text-center rounded-t-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-transparent"></div>
              <CardTitle className="text-3xl font-black relative z-10">Formation Complète</CardTitle>
              <CardDescription className="text-black/80 font-semibold text-lg relative z-10">
                Accès à vie à tous les modules premium
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-10 relative z-10">
              <div className="text-center mb-10">
                <div className="text-6xl md:text-7xl font-black text-3d-gold mb-3">97€</div>
                <div className="text-gray-400 text-lg font-medium">Paiement unique • Sans abonnement</div>
              </div>
              
              <ul className="space-y-4 mb-10">
                {[
                  '6 modules complets premium',
                  'Exercices pratiques personnalisés',
                  'Certificat de réussite officiel',
                  'Accès à vie garanti',
                  'Support expert par email'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-black font-bold py-6 text-xl rounded-2xl button-3d glow-effect group"
                onClick={() => navigate('/dashboard')}
              >
                <Trophy className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Commencer maintenant
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 text-white py-16 px-6 border-t border-gray-800 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center button-3d glow-effect">
                <Target className="w-8 h-8 text-black drop-shadow-lg" />
              </div>
              <div>
                <span className="text-4xl font-black text-3d-gold">ConfianceBoost</span>
                <div className="text-sm text-yellow-400/80 font-medium tracking-widest uppercase">Formation Premium</div>
              </div>
            </div>
            <p className="text-gray-400 mb-8 text-lg">
              Révélez votre potentiel et développez une confiance authentique
            </p>
            <div className="text-gray-500 text-sm">
              © 2024 ConfianceBoost. Tous droits réservés. | Transformez votre vie aujourd'hui.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;