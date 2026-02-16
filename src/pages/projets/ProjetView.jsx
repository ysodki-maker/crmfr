import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar,
  MapPin,
  User,
  Phone,
  UserCog,
  Loader2,
  Building2,
  FileText,
  X
} from 'lucide-react';
import { projetService } from '../../services/api';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ProjetView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjet();
  }, [id]);

  const fetchProjet = async () => {
    try {
      setLoading(true);
      const response = await projetService.getById(id);
      
      if (response.success && response.data) {
        setProjet(response.data);
      } else {
        setError('Projet non trouvé');
      }
    } catch (err) {
      setError('Erreur lors du chargement du projet');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await projetService.delete(id);
        navigate('/projets');
      } catch (err) {
        setError('Erreur lors de la suppression du projet');
        console.error('Erreur:', err);
      }
    }
  };

  const getTypeIcon = (type) => {
    return type === 'RIDEAU' ? '🪟' : '🖼️';
  };

  const getTypeLabel = (type) => {
    return type === 'RIDEAU' ? 'Rideau' : 'Papier Peint';
  };

  const getTypeColor = (type) => {
    return type === 'RIDEAU' 
      ? 'bg-blue-100 text-blue-700 border-blue-200' 
      : 'bg-purple-100 text-purple-700 border-purple-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error || !projet) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Projet introuvable</h2>
          <p className="text-neutral-600">{error}</p>
          <Button onClick={() => navigate('/projets')}>
            Retour aux projets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={projet.projet_name} 
          subtitle={`Projet ${getTypeLabel(projet.type_projet)}`}
        />

        <div className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="p-8 max-w-6xl mx-auto">
            {/* Actions Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate('/projets')}
                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Retour aux projets</span>
              </button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/projets/${id}/edit`)}
                  icon={<Edit className="w-5 h-5" />}
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  icon={<Trash2 className="w-5 h-5" />}
                >
                  Supprimer
                </Button>
              </div>
            </div>

            {/* Type Banner */}
            <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {getTypeIcon(projet.type_projet)}
                  </div>
                  <div>
                    <span className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getTypeColor(projet.type_projet)}`}>
                      {getTypeLabel(projet.type_projet)}
                    </span>
                    <h1 className="text-2xl font-bold text-neutral-900 mt-2">
                      {projet.projet_name}
                    </h1>
                  </div>
                </div>
                
                {projet.created_at && (
                  <div className="text-sm text-neutral-600 text-right">
                    <p className="font-medium">Créé le</p>
                    <p>{formatDate(projet.created_at)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informations Client */}
                <Card title="Informations Client">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-500 mb-1">Nom du client</p>
                        <p className="text-xl font-bold text-neutral-900">{projet.client_name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projet.contact_client && (
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Phone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-500">Contact</p>
                            <p className="text-neutral-900 font-semibold">{projet.contact_client}</p>
                          </div>
                        </div>
                      )}

                      {projet.ville && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-500">Ville</p>
                            <p className="text-neutral-900 font-semibold">{projet.ville}</p>
                          </div>
                        </div>
                      )}

                      {projet.responsable && (
                        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl md:col-span-2">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <UserCog className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-500">Responsable du projet</p>
                            <p className="text-neutral-900 font-semibold">{projet.responsable}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Détails du Projet */}
                <Card title="Détails du Projet">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-primary-600" />
                        <span className="font-semibold text-neutral-900">Type de projet</span>
                      </div>
                      <p className="text-neutral-700 ml-8">
                        {getTypeLabel(projet.type_projet)} - Installation {projet.type_projet === 'RIDEAU' ? 'de rideaux sur mesure' : 'de papier peint décoratif'}
                      </p>
                    </div>

                    {projet.ville && (
                      <div className="p-4 bg-neutral-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin className="w-5 h-5 text-neutral-600" />
                          <span className="font-semibold text-neutral-900">Localisation</span>
                        </div>
                        <p className="text-neutral-700 ml-8">{projet.ville}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Statistiques */}
                <Card title="Statistiques">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-xl text-center">
                      <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-neutral-500">Date de création</p>
                      <p className="text-lg font-bold text-primary-600">
                        {projet.created_at ? new Date(projet.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>

                    <div className="p-4 bg-accent-50 rounded-xl text-center">
                      <Building2 className="w-8 h-8 text-accent-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-neutral-500">Type de projet</p>
                      <p className="text-lg font-bold text-accent-600">
                        {getTypeLabel(projet.type_projet)}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Actions rapides */}
                <Card title="Actions rapides">
                  <div className="space-y-2">
                    <button 
                      onClick={() => navigate(`/projets/${id}/espaces`)}
                      className="w-full px-4 py-3 text-left hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-3 group"
                    >
                      <Building2 className="w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors" />
                      <span className="font-medium text-neutral-900 group-hover:text-primary-900 transition-colors">
                        Gérer les espaces
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => navigate(`/projets/${id}/mesures`)}
                      className="w-full px-4 py-3 text-left hover:bg-accent-50 rounded-lg transition-colors flex items-center gap-3 group"
                    >
                      <FileText className="w-5 h-5 text-neutral-600 group-hover:text-accent-600 transition-colors" />
                      <span className="font-medium text-neutral-900 group-hover:text-accent-900 transition-colors">
                        Voir les mesures
                      </span>
                    </button>

                    <button 
                      onClick={() => navigate(`/projets/${id}/edit`)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3 group"
                    >
                      <Edit className="w-5 h-5 text-neutral-600 group-hover:text-blue-600 transition-colors" />
                      <span className="font-medium text-neutral-900 group-hover:text-blue-900 transition-colors">
                        Modifier le projet
                      </span>
                    </button>
                  </div>
                </Card>

                {/* Informations */}
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Astuce :</strong> Ajoutez des espaces et des mesures pour suivre l'avancement de votre projet {getTypeLabel(projet.type_projet).toLowerCase()}.
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

export default ProjetView;