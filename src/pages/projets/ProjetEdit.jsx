import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import { projetService } from '../../services/api';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const ProjetEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    type_projet: 'RIDEAU',
    client_name: '',
    projet_name: '',
    ville: '',
    contact_client: '',
    responsable: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProjet();
  }, [id]);

  const fetchProjet = async () => {
    try {
      setLoading(true);
      const response = await projetService.getById(id);
      
      if (response.success && response.data) {
        const projet = response.data;
        setFormData({
          type_projet: projet.type_projet || 'RIDEAU',
          client_name: projet.client_name || '',
          projet_name: projet.projet_name || '',
          ville: projet.ville || '',
          contact_client: projet.contact_client || '',
          responsable: projet.responsable || '',
        });
      }
    } catch (err) {
      setError('Erreur lors du chargement du projet');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type_projet) {
      newErrors.type_projet = 'Le type de projet est requis';
    }
    
    if (!formData.client_name?.trim()) {
      newErrors.client_name = 'Le nom du client est requis';
    }
    
    if (!formData.projet_name?.trim()) {
      newErrors.projet_name = 'Le nom du projet est requis';
    }

    // Validation du format du contact (optionnel mais recommandé)
    if (formData.contact_client && formData.contact_client.trim()) {
      const phoneRegex = /^[0-9+\s()-]+$/;
      if (!phoneRegex.test(formData.contact_client)) {
        newErrors.contact_client = 'Format de contact invalide';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Nettoyer les données avant l'envoi
      const cleanedData = {
        ...formData,
        client_name: formData.client_name.trim(),
        projet_name: formData.projet_name.trim(),
        ville: formData.ville?.trim() || null,
        contact_client: formData.contact_client?.trim() || null,
        responsable: formData.responsable?.trim() || null,
      };

      const response = await projetService.update(id, cleanedData);
      
      if (response.success) {
        navigate(`/projets/${id}`);
      } else {
        setError(response.message || 'Erreur lors de la mise à jour du projet');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour du projet');
      console.error('Erreur:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Modifier le Projet" 
          subtitle={formData.projet_name}
        />

        <div className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="p-8 max-w-4xl mx-auto">
            <button
              onClick={() => navigate(`/projets/${id}`)}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour au projet</span>
            </button>

            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3 animate-slide-down">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
                <button onClick={() => setError('')} className="ml-auto">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Type de projet */}
                <Card title="Type de projet">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
                      Type de projet
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`
                        relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${formData.type_projet === 'RIDEAU' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }
                      `}>
                        <input
                          type="radio"
                          name="type_projet"
                          value="RIDEAU"
                          checked={formData.type_projet === 'RIDEAU'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">🪟</div>
                          <div className="font-semibold text-neutral-900">Rideau</div>
                        </div>
                        {formData.type_projet === 'RIDEAU' && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>

                      <label className={`
                        relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${formData.type_projet === 'WALLPAPER' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }
                      `}>
                        <input
                          type="radio"
                          name="type_projet"
                          value="WALLPAPER"
                          checked={formData.type_projet === 'WALLPAPER'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">🖼️</div>
                          <div className="font-semibold text-neutral-900">Papier Peint</div>
                        </div>
                        {formData.type_projet === 'WALLPAPER' && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.type_projet && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.type_projet}
                      </p>
                    )}
                  </div>
                </Card>

                {/* Informations du projet */}
                <Card title="Informations du projet">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Nom du projet"
                        name="projet_name"
                        value={formData.projet_name}
                        onChange={handleChange}
                        error={errors.projet_name}
                        placeholder="Ex: Appartement Marina Bay"
                        required
                      />
                    </div>

                    <Input
                      label="Nom du client"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleChange}
                      error={errors.client_name}
                      placeholder="Ex: Mohammed Alami"
                      required
                    />

                    <Input
                      label="Contact du client"
                      name="contact_client"
                      value={formData.contact_client}
                      onChange={handleChange}
                      error={errors.contact_client}
                      placeholder="Ex: +212 6 12 34 56 78"
                    />

                    <Input
                      label="Ville"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      placeholder="Ex: Casablanca"
                    />

                    <Input
                      label="Responsable"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleChange}
                      placeholder="Ex: Ahmed Bennani"
                    />
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate(`/projets/${id}`)}
                  >
                    Annuler
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    loading={saving}
                    icon={<Save className="w-5 h-5" />}
                  >
                    Enregistrer les modifications
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjetEdit;