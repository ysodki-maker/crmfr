import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur de connexion:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Section gauche - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo et titre */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl mb-6 shadow-lg shadow-primary-500/30 animate-scale-in">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2 animate-slide-down">
              Bienvenue
            </h1>
            <p className="text-neutral-600 animate-fade-in">
              Connectez-vous à votre espace CRM
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3 animate-slide-down">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <Input
              label="Adresse email"
              type="email"
              name="email"
              placeholder="vous@exemple.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              required
              autoComplete="email"
            />

            <div>
              <Input
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                required
                autoComplete="current-password"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[21.7rem] text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Se connecter
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-neutral-500 mt-8">
            © 2026 CRM Pro. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Section droite - Image/Design */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-white max-w-lg">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  Plateforme sécurisée
                </span>
              </div>
            </div>

            <h2 className="text-5xl font-bold leading-tight">
              Prenez vos mesures en toute simplicité
            </h2>

            <p className="text-xl text-primary-100 leading-relaxed">
              Bienvenue sur notre outil  de prise de mesure pour rideaux
            </p>

            <div className="space-y-4 pt-8">
              {[
                {
                  icon: "📊",
                  title: "Tableaux de bord intuitifs",
                  desc: "Visualisez vos données en temps réel",
                },
                {
                  icon: "🔒",
                  title: "Sécurité renforcée",
                  desc: "Vos données sont protégées",
                },
                {
                  icon: "⚡",
                  title: "Performance optimale",
                  desc: "Interface rapide et réactive",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-primary-100 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 rotate-12 animate-spin-slow"></div>
        <div
          className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 -rotate-12 animate-spin-slow"
          style={{ animationDirection: "reverse" }}
        ></div>
      </div>
    </div>
  );
};

export default Login;

