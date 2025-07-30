// Mock data pour la formation confiance en soi
export const mockModules = [
  {
    id: 1,
    title: "Comprendre sa valeur personnelle",
    description: "Découvrez votre vraie valeur et apprenez à la reconnaître au quotidien",
    duration: "45 min",
    lessons: 6,
    completed: true,
    progress: 100,
    content: {
      introduction: "Dans ce module, vous allez explorer les fondements de votre valeur personnelle...",
      video_url: "https://example.com/video1",
      exercises: [
        "Listez 10 qualités que vous possédez",
        "Identifiez 3 réussites passées",
        "Créez votre affirmation personnelle"
      ]
    }
  },
  {
    id: 2,
    title: "Surmonter le syndrome de l'imposteur",
    description: "Techniques concrètes pour vaincre la peur de ne pas être à la hauteur",
    duration: "60 min",
    lessons: 8,
    completed: true,
    progress: 100,
    content: {
      introduction: "Le syndrome de l'imposteur touche 70% des personnes...",
      exercises: [
        "Analysez vos pensées limitantes",
        "Reconstituez votre parcours de réussites",
        "Pratiquez l'auto-compassion"
      ]
    }
  },
  {
    id: 3,
    title: "Développer son assertivité",
    description: "Apprenez à vous affirmer avec respect et bienveillance",
    duration: "50 min",
    lessons: 7,
    completed: false,
    progress: 60,
    content: {
      introduction: "L'assertivité est la capacité à exprimer ses opinions...",
      exercises: [
        "Techniques de communication assertive",
        "Dire non sans culpabiliser",
        "Gérer les conflits constructivement"
      ]
    }
  },
  {
    id: 4,
    title: "Gérer l'anxiété sociale",
    description: "Strategies pour vous sentir à l'aise en société",
    duration: "55 min",
    lessons: 6,
    completed: false,
    progress: 0,
    content: {
      introduction: "L'anxiété sociale peut limiter nos interactions...",
      exercises: [
        "Techniques de respiration",
        "Exposition progressive",
        "Restructuration cognitive"
      ]
    }
  },
  {
    id: 5,
    title: "Cultiver l'estime de soi",
    description: "Construisez une image positive et durable de vous-même",
    duration: "65 min",
    lessons: 9,
    completed: false,
    progress: 0,
    content: {
      introduction: "L'estime de soi est la fondation de la confiance...",
      exercises: [
        "Journal de gratitude personnel",
        "Célébrez vos petites victoires",
        "Créez votre vision idéale"
      ]
    }
  },
  {
    id: 6,
    title: "Prendre des décisions avec confiance",
    description: "Méthodes pour décider sereinement et assumer ses choix",
    duration: "40 min",
    lessons: 5,
    completed: false,
    progress: 0,
    content: {
      introduction: "Prendre des décisions peut être source d'anxiété...",
      exercises: [
        "Matrice de décision",
        "Technique du pour/contre évolué",
        "Accepter l'imperfection"
      ]
    }
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Marie L.",
    role: "Entrepreneure",
    content: "Cette formation a complètement transformé ma façon de voir mes capacités. Je recommande vivement !",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Thomas D.",
    role: "Manager",
    content: "Les exercices pratiques m'ont aidé à développer une confiance authentique. Merci !",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Sophie M.",
    role: "Consultante",
    content: "Une approche bienveillante et efficace. Ma vie professionnelle s'en ressent positivement.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
  }
];

export const mockStats = {
  totalStudents: 2847,
  completionRate: 94,
  averageRating: 4.9,
  moduleCount: 6
};

export const mockUser = {
  id: 1,
  name: "Utilisateur Demo",
  email: "demo@example.com",
  enrollmentDate: "2024-01-15",
  completedModules: 2,
  totalProgress: 45,
  certificates: 0
};