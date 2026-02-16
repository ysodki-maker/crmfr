import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Shield,
  Loader2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { userService } from '../../services/api';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'UTILISATEUR',
    is_active: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userService.getById(id);
      if (response.success) {
        const user = response.data;
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'UTILISATEUR',
          is_active: user.is_active === 1 || user.is_active === true
        });
      }
    } catch (err) {
      setError('Erreur lors du chargement de l\'utilisateur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (showPasswordSection) {
      if (!passwordData.currentPassword) {
        newErrors.currentPassword = 'Le mot de passe actuel est requis';
      }

      if (!passwordData.newPassword) {
        newErrors.newPassword = 'Le nouveau mot de passe est requis';
      } else if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        is_active: formData.is_active
      };

      await userService.update(id, userData);
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      await userService.changePassword(id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      // Réinitialiser le formulaire de mot de passe
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
      
      alert('Mot de passe modifié avec succès');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary-600" />
          <p className="text-neutral-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Modifier l'Utilisateur" 
          subtitle={`${formData.first_name} ${formData.last_name}`}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulaire principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informations personnelles */}
                <form onSubmit={handleSubmit}>
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

                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <Button
                        type="submit"
                        disabled={saving}
                        icon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      >
                        {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </div>
                  </Card>
                </form>

                {/* Changement de mot de passe */}
                <Card title="Sécurité">
                  {!showPasswordSection ? (
                    <div className="text-center py-6">
                      <Lock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-neutral-600 mb-4">
                        Modifier le mot de passe de cet utilisateur
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPasswordSection(true)}
                        icon={<Lock className="w-5 h-5" />}
                      >
                        Changer le mot de passe
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="space-y-4">
                        {/* Mot de passe actuel */}
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Mot de passe actuel <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                                errors.currentPassword
                                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                  : 'border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                              }`}
                              placeholder="••••••••"
                            />
                          </div>
                          {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.currentPassword}
                            </p>
                          )}
                        </div>

                        {/* Nouveau mot de passe */}
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Nouveau mot de passe <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition-all ${
                                errors.newPassword
                                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                  : 'border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                              }`}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.newPassword}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-neutral-500">
                            Au moins 6 caractères
                          </p>
                        </div>

                        {/* Confirmer nouveau mot de passe */}
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Confirmer le nouveau mot de passe <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
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

                      <div className="mt-6 pt-6 border-t border-neutral-200 flex gap-3">
                        <Button
                          type="submit"
                          disabled={saving}
                          icon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        >
                          {saving ? 'Modification...' : 'Changer le mot de passe'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowPasswordSection(false);
                            setPasswordData({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                            setErrors({});
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </form>
                  )}
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Paramètres */}
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

                {/* Actions rapides */}
                <Card>
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={saving}
                      icon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      className="w-full"
                    >
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
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
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-900 leading-relaxed">
                    <strong>⚠️ Attention :</strong> Les modifications du rôle ou du statut prendront effet immédiatement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;