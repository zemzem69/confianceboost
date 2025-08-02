import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import { authService } from '../services/api';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        email: loginForm.email,
        password: loginForm.password
      });
      
      login(response.user, response.token);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur connexion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!registerForm.email || !registerForm.password || !registerForm.first_name || !registerForm.last_name) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (registerForm.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        email: registerForm.email,
        password: registerForm.password,
        first_name: registerForm.first_name,
        last_name: registerForm.last_name
      });
      
      login(response.user, response.token);
      toast.success('Inscription réussie ! Bienvenue dans ConfianceBoost !');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur inscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg"></div>
            <span className="text-2xl font-bold gold-gradient-text">ConfianceBoost</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {activeTab === 'login' ? 'Bon retour !' : 'Commencez votre transformation'}
          </h1>
          <p className="text-gray-400">
            {activeTab === 'login' 
              ? 'Connectez-vous pour accéder à vos modules'
              : 'Créez your compte et démarrez dès maintenant'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 rounded-md text-center font-medium transition-all ${
              activeTab === 'login'
                ? 'bg-yellow-400 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 rounded-md text-center font-medium transition-all ${
              activeTab === 'register'
                ? 'bg-yellow-400 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  className="form-input pl-10"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center"
            >
              {loading ? (
                <div className="loading-spinner w-5 h-5"></div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={registerForm.first_name}
                    onChange={handleRegisterChange}
                    className="form-input pl-10"
                    placeholder="Prénom"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={registerForm.last_name}
                    onChange={handleRegisterChange}
                    className="form-input pl-10"
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  className="form-input pl-10"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="register-password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  className="form-input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center"
            >
              {loading ? (
                <div className="loading-spinner w-5 h-5"></div>
              ) : (
                'Créer mon compte'
              )}
            </button>

            <p className="text-sm text-gray-400 text-center">
              En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </form>
        )}

        {/* Demo Access */}
        <div className="mt-8 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
          <h3 className="font-semibold text-yellow-400 mb-2">🎯 Accès démo</h3>
          <p className="text-sm text-gray-300 mb-3">
            Testez la plateforme avec un compte de démonstration
          </p>
          <div className="text-xs text-gray-400">
            <p>Email: demo@confianceboost.fr</p>
            <p>Mot de passe: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;