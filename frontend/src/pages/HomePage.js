import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Star, Play, Users, Award, CheckCircle, ArrowRight, BookOpen, Clock, Target } from "lucide-react";
import { mockModules, mockTestimonials, mockStats } from "../components/mock";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

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
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#formation" className="text-gray-300 hover:text-yellow-400 transition-colors">Formation</a>
              <a href="#temoignages" className="text-gray-300 hover:text-yellow-400 transition-colors">Témoignages</a>
              <a href="#tarifs" className="text-gray-300 hover:text-yellow-400 transition-colors">Tarifs</a>
              <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold">
                Commencer
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-yellow-500/30">
            <Award className="w-4 h-4" />
            <span>Formation certifiante</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Développez votre
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent block">
              Confiance en Soi
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Une formation complète et pratique pour transformer votre relation à vous-même 
            et révéler votre plein potentiel en 6 modules progressifs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Commencer maintenant
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 px-8 py-4 text-lg rounded-xl"
            >
              Découvrir les modules
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{mockStats.totalStudents}+</div>
              <div className="text-gray-400">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{mockStats.completionRate}%</div>
              <div className="text-gray-400">Taux de réussite</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{mockStats.averageRating}/5</div>
              <div className="text-gray-400">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{mockStats.moduleCount}</div>
              <div className="text-gray-400">Modules</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="formation" className="py-20 px-6 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Un parcours structuré pour votre transformation
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              6 modules progressifs pour développer une confiance authentique et durable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockModules.map((module, index) => (
              <Card key={module.id} className="group hover:shadow-2xl transition-all duration-300 bg-gray-800/80 border-gray-700 hover:border-yellow-400/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant={module.completed ? "default" : "secondary"}
                      className={module.completed ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}
                    >
                      Module {index + 1}
                    </Badge>
                    {module.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-yellow-400 transition-colors">
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
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-yellow-400/10 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
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
      <section id="temoignages" className="py-20 px-6 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ce que disent nos participants
            </h2>
            <p className="text-xl text-gray-300">
              Des transformations authentiques et durables
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-gray-700 text-white">{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-20 px-6 bg-gray-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Investissez dans votre avenir
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Une formation complète à un prix accessible
          </p>

          <Card className="max-w-md mx-auto border-yellow-400/30 shadow-2xl bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black text-center rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Formation Complète</CardTitle>
              <CardDescription className="text-gray-800">
                Accès à vie à tous les modules
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-white mb-2">97€</div>
                <div className="text-gray-400">Paiement unique</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">6 modules complets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Exercices pratiques</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Certificat de réussite</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Accès à vie</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Support par email</span>
                </li>
              </ul>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold py-4 text-lg rounded-xl"
                onClick={() => navigate('/dashboard')}
              >
                Commencer maintenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">ConfianceBoost</span>
            </div>
            <p className="text-gray-400 mb-6">
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