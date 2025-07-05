import { Link } from "react-router-dom";
import { Leaf, BarChart3, Target, Award, ArrowRight, CheckCircle, Star, Users, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics", 
      description: "Track your carbon footprint with detailed analytics and beautiful visualizations"
    },
    {
      icon: Target,
      title: "Smart Goals",
      description: "Set and achieve personalized sustainability goals with AI recommendations"
    },
    {
      icon: Award,
      title: "Achievements",
      description: "Unlock eco-friendly achievements and compete with friends"
    },
    {
      icon: Leaf,
      title: "AI Insights",
      description: "Get personalized suggestions to reduce your environmental impact"
    }
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Sign Up & Setup",
      description: "Create your account and set up your sustainability profile in minutes",
      icon: Users
    },
    {
      step: "02",
      title: "Track Activities",
      description: "Log your daily activities like transport, energy usage, and consumption habits",
      icon: BarChart3
    },
    {
      step: "03",
      title: "Get AI Insights",
      description: "Receive personalized recommendations to reduce your carbon footprint",
      icon: Zap
    },
    {
      step: "04",
      title: "Achieve Goals",
      description: "Set goals, track progress, and earn achievements for your eco-friendly actions",
      icon: Target
    }
  ];

  const teamMembers = [
    {
      name: "Shashi Pranay G",
      role: "Backend Developer & System Architect",
      description: "Specializes in scalable backend systems and database optimization",
      initial: "S"
    },
    {
      name: "Mani Venkata Sai",
      role: "Frontend Developer & UI/UX Designer",
      description: "Expert in modern web technologies and user experience design",
      initial: "M"
    },
    {
      name: "Anil M",
      role: "DevOps Engineer & System Maintenance",
      description: "Ensures system reliability, security, and continuous deployment",
      initial: "A"
    },
    {
      name: "Shruthi",
      role: "Quality Assurance & Deployment Specialist",
      description: "Maintains code quality and manages production deployments",
      initial: "S"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Environmental Advocate",
      content: "EcoTrack helped me reduce my carbon footprint by 40% in just 3 months!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Sustainability Manager", 
      content: "The AI insights are incredibly accurate and actionable. Highly recommended!",
      rating: 5
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EcoTrack</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('about-us')}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Testimonials
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Track Your
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent"> Carbon </span>
              Footprint
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of eco-conscious individuals using AI-powered insights to make a positive impact on our planet. 
              Start your sustainability journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-lg px-8 py-6">
                  Start Tracking Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-800/20 text-lg px-8 py-6">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">50K+</div>
              <div className="text-slate-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">2M+</div>
              <div className="text-slate-400">Tons CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">95%</div>
              <div className="text-slate-400">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to track, analyze, and reduce your environmental impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-2xl border border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get started with your sustainability journey in just four simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-emerald-400 font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">About Us</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We're a passionate team of developers and environmental advocates dedicated to making 
              sustainability tracking accessible and impactful for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-2xl border border-emerald-800/30 text-center hover:border-emerald-600/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{member.initial}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-emerald-400 font-medium mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-emerald-800/20 to-green-700/20 p-8 rounded-2xl border border-emerald-800/30">
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-slate-300 text-lg max-w-4xl mx-auto">
                To empower individuals and organizations with the tools and insights needed to make 
                informed decisions about their environmental impact, creating a more sustainable future 
                for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-slate-300">Join thousands of satisfied eco-warriors</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-emerald-800/30">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-lg mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Benefits Section */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose EcoTrack?</h2>
            <p className="text-xl text-slate-300">Advanced features that set us apart</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Privacy First</h3>
              <p className="text-slate-400">Your data is encrypted and secure. We never share your personal information.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Updates</h3>
              <p className="text-slate-400">Get instant feedback and recommendations as you log your activities.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Global Impact</h3>
              <p className="text-slate-400">Join a community of eco-warriors making a difference worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-800/20 to-green-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Start your sustainable journey today and join the movement towards a greener planet.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-lg px-8 py-6">
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-emerald-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">EcoTrack</span>
              </div>
              <p className="text-slate-400">Making the world greener, one step at a time.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button 
                    onClick={() => scrollToSection('about-us')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('testimonials')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Testimonials
                  </button>
                </li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    How It Works
                  </button>
                </li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-emerald-800/30">
            <p className="text-slate-400">© 2024 EcoTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
