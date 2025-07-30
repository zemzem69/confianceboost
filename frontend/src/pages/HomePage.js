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
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#formation" className="text-gray-700 hover:text-orange-600 transition-colors">Formation</a>
              <a href="#temoignages" className="text-gray-700 hover:text-orange-600 transition-colors">Témoignages</a>
              <a href="#tarifs" className="text-gray-700 hover:text-orange-600 transition-colors">Tarifs</a>
              <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                Commencer
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Formation certifiante</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Développez votre
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent block">
              Confiance en Soi
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Une formation complète et pratique pour transformer votre relation à vous-même 
            et révéler votre plein potentiel en 6 modules progressifs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Commencer maintenant
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-4 text-lg rounded-xl"
            >
              Découvrir les modules
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{mockStats.totalStudents}+</div>
              <div className="text-gray-600">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{mockStats.completionRate}%</div>
              <div className="text-gray-600">Taux de réussite</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{mockStats.averageRating}/5</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{mockStats.moduleCount}</div>
              <div className="text-gray-600">Modules</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="formation" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Un parcours structuré pour votre transformation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              6 modules progressifs pour développer une confiance authentique et durable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockModules.map((module, index) => (
              <Card key={module.id} className="group hover:shadow-xl transition-all duration-300 border-orange-100 hover:border-orange-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant={module.completed ? "default" : "secondary"}
                      className={module.completed ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                    >
                      Module {index + 1}
                    </Badge>
                    {module.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
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
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-orange-50 group-hover:border-orange-300 transition-colors"
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
      <section id="temoignages" className="py-20 px-6 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos participants
            </h2>
            <p className="text-xl text-gray-600">
              Des transformations authentiques et durables
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white/80 backdrop-blur-sm border-orange-100">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Investissez dans votre avenir
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Une formation complète à un prix accessible
          </p>

          <Card className="max-w-md mx-auto border-orange-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center rounded-t-lg">
              <CardTitle className="text-2xl">Formation Complète</CardTitle>
              <CardDescription className="text-orange-100">
                Accès à vie à tous les modules
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">97€</div>
                <div className="text-gray-600">Paiement unique</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>6 modules complets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Exercices pratiques</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Certificat de réussite</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Accès à vie</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Support par email</span>
                </li>
              </ul>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 text-lg rounded-xl"
                onClick={() => navigate('/dashboard')}
              >
                Commencer maintenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">ConfianceBoost</span>
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