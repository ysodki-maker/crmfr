import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { authService } from '../../services/api';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const UserCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'UTILISATEUR',
    is_active: true
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
        role: formData.role,
        is_active: formData.is_active
      };

      await authService.register(userData);
      navigate('/users');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Nouvel Utilisateur" 
          subtitle="Créer un nouveau compte utilisateur"
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-4xl mx-auto">
            {/* Navigation */}
            <button
              onClick={() => navigate('/users')}
              className="group flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-all mb-6"
            >
              <div className="p-2 rounded-lg bg-neutral-100 group-hover:bg-primary-100 transition-colors">
                <ArrowLeft className="w-5 h-5 group-hover:text-primary-600" />
              </div>
              <span className="font-semibold">Retour à la liste</span>
            </button>

            {/* Erreur globale */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-slide-down">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Erreur</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulaire principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Informations personnelles */}
                  <Card title="Informations Personnelles">
                    <div className="space-y-4">
                      {/* Prénom */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Prénom <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                              errors.first_name
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                : 'border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                            }`}
                            placeholder="Jean"
                          />
                        </div>
                        {errors.first_name && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.first_name}
                          </p>
                        )}
                      </div>

                      {/* Nom */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                              errors.last_name
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                : 'border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                            }`}
                            placeholder="Dupont"
                          />
                        </div>
                        {errors.last_name && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.last_name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                              errors.email
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                : 'border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                            }`}
                            placeholder="jean.dupont@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Téléphone */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Téléphone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                            placeholder="0612345678"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Sécurité */}
                  <Card title="Sécurité">
                    <div className="space-y-4">
                      {/* Mot de passe */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Mot de passe <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition-all ${
                              errors.password
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                : 'border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.password}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-neutral-500">
                          Au moins 6 caractères
                        </p>
                      </div>

                      {/* Confirmation mot de passe */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Confirmer le mot de passe <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition-all ${
                              errors.confirmPassword
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                : 'border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Rôle et Statut */}
                  <Card title="Paramètres">
                    <div className="space-y-4">
                      {/* Rôle */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Rôle
                        </label>
                        <div className="relative">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all appearance-none bg-white"
                          >
                            <option value="UTILISATEUR">Utilisateur</option>
                            <option value="ADMIN">Administrateur</option>
                          </select>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                          Définit les permissions de l'utilisateur
                        </p>
                      </div>

                      {/* Statut actif */}
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-neutral-900">Compte actif</p>
                          <p className="text-xs text-neutral-500">L'utilisateur peut se connecter</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </Card>

                  {/* Actions */}
                  <Card>
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        disabled={loading}
                        icon={loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                        className="w-full"
                      >
                        {loading ? 'Création...' : 'Créer l\'utilisateur'}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/users')}
                        className="w-full"
                      >
                        Annuler
                      </Button>
                    </div>
                  </Card>

                  {/* Info */}
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-xs text-blue-900 leading-relaxed">
                      <strong>Note :</strong> Un email de bienvenue sera envoyé à l'utilisateur avec ses identifiants de connexion.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;