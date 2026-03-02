/* eslint-disable no-unused-vars */
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
  X,
  MoreVertical,
  ChevronRight,
  Ruler,
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
  const [showActionSheet, setShowActionSheet] = useState(false);

  useEffect(() => { fetchProjet(); }, [id]);

  const fetchProjet = async () => {
    try {
      setLoading(true);
      const response = await projetService.getById(id);
      if (response.success && response.data) setProjet(response.data);
      else setError('Projet non trouvé');
    } catch (err) {
      setError('Erreur lors du chargement du projet');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowActionSheet(false);
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await projetService.delete(id);
        navigate('/projets');
      } catch (err) {
        setError('Erreur lors de la suppression du projet');
      }
    }
  };

  const getTypeIcon = (type) => type === 'RIDEAU' ? '🪟' : '🖼️';
  const getTypeLabel = (type) => type === 'RIDEAU' ? 'Rideau' : 'Papier Peint';
  const getTypeAccent = (type) => type === 'RIDEAU' ? 'bg-blue-500' : 'bg-violet-500';
  const getTypeColor = (type) => type === 'RIDEAU'
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-violet-50 text-violet-700 border-violet-200';

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
          <p className="text-neutral-500 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  /* ── Erreur ── */
  if (error || !projet) {
    return (
      <div className="flex h-screen items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Projet introuvable</h2>
          <p className="text-neutral-500 text-sm">{error}</p>
          <Button onClick={() => navigate('/projets')}>Retour aux projets</Button>
        </div>
      </div>
    );
  }

  /* ── Bottom Sheet actions (mobile) ── */
  const ActionSheet = () => (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 sm:hidden"
        onClick={() => setShowActionSheet(false)}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white rounded-t-2xl shadow-2xl">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-neutral-200 rounded-full" />
        </div>
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-3">
          <span className="text-2xl">{getTypeIcon(projet.type_projet)}</span>
          <p className="flex-1 font-semibold text-neutral-900 text-sm truncate">{projet.projet_name}</p>
          <button onClick={() => setShowActionSheet(false)} className="p-1.5 bg-neutral-100 rounded-full">
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
        <div className="py-2 pb-10">
          {[
            { icon: <Edit className="w-5 h-5" />, label: 'Modifier le projet', color: 'text-blue-600', bg: 'hover:bg-blue-50', action: () => { setShowActionSheet(false); navigate(`/projets/${id}/edit`); } },
            { icon: <Building2 className="w-5 h-5" />, label: 'Gérer les espaces', color: 'text-primary-600', bg: 'hover:bg-primary-50', action: () => { setShowActionSheet(false); navigate(`/projets/${id}/espaces`); } },
            { icon: <Ruler className="w-5 h-5" />, label: 'Voir les mesures', color: 'text-primary-600', bg: 'hover:bg-primary-50', action: () => { setShowActionSheet(false); navigate(`/projets/${id}/mesures`); } },
            { icon: <Trash2 className="w-5 h-5" />, label: 'Supprimer le projet', color: 'text-red-500', bg: 'hover:bg-red-50', action: handleDelete, separator: true },
          ].map((item, i) => (
            <React.Fragment key={i}>
              {item.separator && <div className="h-px bg-neutral-100 mx-5 my-1" />}
              <button onClick={item.action} className={`w-full flex items-center gap-4 px-5 py-3.5 ${item.bg} transition-colors`}>
                <span className={item.color}>{item.icon}</span>
                <span className={`flex-1 text-left text-sm font-medium ${item.color}`}>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-neutral-300" />
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {showActionSheet && <ActionSheet />}

      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={projet.projet_name}
            subtitle={`Projet ${getTypeLabel(projet.type_projet)}`}
          />

          <div className="flex-1 overflow-y-auto bg-neutral-50">
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">

              {/* ── Barre de navigation ── */}
              <div className="flex items-center justify-between mb-5 sm:mb-8">
                <button
                  onClick={() => navigate('/projets')}
                  className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden xs:inline">Retour</span>
                  <span className="hidden sm:inline"> aux projets</span>
                </button>

                {/* Desktop : boutons texte */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/projets/${id}/edit`)}
                    icon={<Edit className="w-4 h-4" />}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Supprimer
                  </Button>
                </div>

                {/* Mobile : bouton ⋯ */}
                <button
                  onClick={() => setShowActionSheet(true)}
                  className="sm:hidden w-9 h-9 flex items-center justify-center bg-white border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* ── Banner projet ── */}
              <div className="mb-5 sm:mb-8 rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
                {/* Barre accent top */}
                <div className={`h-1.5 w-full ${getTypeAccent(projet.type_projet)}`} />

                <div className="p-4 sm:p-6 bg-gradient-to-br from-primary-50/60 to-accent-50/60">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    {/* Gauche : icône + titre */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 ${getTypeColor(projet.type_projet)}`}>
                        {getTypeIcon(projet.type_projet)}
                      </div>
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold border ${getTypeColor(projet.type_projet)} mb-1.5`}>
                          {getTypeLabel(projet.type_projet)}
                        </span>
                        <h1 className="text-lg sm:text-2xl font-bold text-neutral-900 leading-tight">
                          {projet.projet_name}
                        </h1>
                      </div>
                    </div>

                    {/* Droite : date — masquée sur mobile (déjà dans les stats) */}
                    {projet.created_at && (
                      <div className="hidden sm:block text-sm text-neutral-600 text-right flex-shrink-0">
                        <p className="font-medium text-neutral-400 text-xs mb-0.5">Créé le</p>
                        <p className="font-semibold">{formatDate(projet.created_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Actions rapides mobile (pills horizontales) ── */}
              <div className="flex sm:hidden gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { icon: <Building2 className="w-3.5 h-3.5" />, label: 'Espaces', action: () => navigate(`/projets/${id}/espaces`), color: 'text-primary-600 bg-primary-50 border-primary-100' },
                  { icon: <Ruler className="w-3.5 h-3.5" />, label: 'Mesures', action: () => navigate(`/projets/${id}/mesures`), color: 'text-primary-600 bg-primary-50 border-primary-100' },
                  { icon: <Edit className="w-3.5 h-3.5" />, label: 'Modifier', action: () => navigate(`/projets/${id}/edit`), color: 'text-blue-600 bg-blue-50 border-blue-100' },
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${btn.color} transition-all active:scale-95`}
                  >
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>

              {/* ── Grille principale ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-5 sm:space-y-6">

                  {/* Informations Client */}
                  <Card title="Informations Client">
                    <div className="space-y-4">
                      {/* Nom client */}
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-neutral-50 rounded-xl">
                        <div className="p-2 sm:p-3 bg-primary-100 rounded-lg flex-shrink-0">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-400 mb-0.5">Nom du client</p>
                          <p className="text-base sm:text-xl font-bold text-neutral-900">{projet.client_name}</p>
                        </div>
                      </div>

                      {/* Grid contact / ville / responsable */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {projet.contact_client && (
                          <div className="flex items-start gap-3 p-3 sm:p-4 bg-green-50 rounded-xl">
                            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                              <Phone className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-neutral-400">Contact</p>
                              <p className="text-sm font-semibold text-neutral-900 truncate">{projet.contact_client}</p>
                            </div>
                          </div>
                        )}

                        {projet.ville && (
                          <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
                            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                              <MapPin className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-neutral-400">Ville</p>
                              <p className="text-sm font-semibold text-neutral-900">{projet.ville}</p>
                            </div>
                          </div>
                        )}

                        {projet.responsable && (
                          <div className="flex items-start gap-3 p-3 sm:p-4 bg-violet-50 rounded-xl sm:col-span-2">
                            <div className="p-2 bg-violet-100 rounded-lg flex-shrink-0">
                              <UserCog className="w-4 h-4 text-violet-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-neutral-400">Responsable du projet</p>
                              <p className="text-sm font-semibold text-neutral-900">{projet.responsable}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Détails du Projet */}
                  <Card title="Détails du Projet">
                    <div className="space-y-3">
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-1.5">
                          <FileText className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-semibold text-neutral-900">Type de projet</span>
                        </div>
                        <p className="text-sm text-neutral-600 ml-6">
                          {getTypeLabel(projet.type_projet)} — Installation {projet.type_projet === 'RIDEAU' ? 'de rideaux sur mesure' : 'de papier peint décoratif'}
                        </p>
                      </div>

                      {projet.ville && (
                        <div className="p-3 sm:p-4 bg-neutral-50 rounded-xl">
                          <div className="flex items-center gap-2 mb-1.5">
                            <MapPin className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm font-semibold text-neutral-900">Localisation</span>
                          </div>
                          <p className="text-sm text-neutral-600 ml-6">{projet.ville}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-5 sm:space-y-6">

                  {/* Stats */}
                  <Card title="Informations">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                        <Calendar className="w-6 h-6 text-primary-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-400 font-medium">Date de création</p>
                          <p className="text-sm font-bold text-primary-600">{formatDateShort(projet.created_at)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-accent-50 rounded-xl">
                        <Building2 className="w-6 h-6 text-accent-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-400 font-medium">Type de projet</p>
                          <p className="text-sm font-bold text-accent-600">{getTypeLabel(projet.type_projet)}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Actions rapides — desktop seulement */}
                  <div className="hidden sm:block">
                    <Card title="Actions rapides">
                      <div className="space-y-1">
                        {[
                          { icon: <Building2 className="w-5 h-5" />, label: 'Gérer les espaces', action: () => navigate(`/projets/${id}/espaces`), hover: 'hover:bg-primary-50 group-hover:text-primary-600' },
                          { icon: <FileText className="w-5 h-5" />, label: 'Voir les mesures', action: () => navigate(`/projets/${id}/mesures`), hover: 'hover:bg-accent-50 group-hover:text-accent-600' },
                          { icon: <Edit className="w-5 h-5" />, label: 'Modifier le projet', action: () => navigate(`/projets/${id}/edit`), hover: 'hover:bg-blue-50 group-hover:text-blue-600' },
                        ].map((btn, i) => (
                          <button
                            key={i}
                            onClick={btn.action}
                            className={`group w-full px-4 py-3 text-left ${btn.hover} rounded-xl transition-colors flex items-center gap-3`}
                          >
                            <span className="text-neutral-400 group-hover:text-current transition-colors">{btn.icon}</span>
                            <span className="text-sm font-medium text-neutral-800">{btn.label}</span>
                            <ChevronRight className="w-4 h-4 text-neutral-300 ml-auto" />
                          </button>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Astuce */}
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <p className="text-sm text-blue-700 leading-relaxed">
                      <strong>💡 Astuce :</strong> Ajoutez des espaces et des mesures pour suivre l'avancement de votre projet {getTypeLabel(projet.type_projet).toLowerCase()}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjetView;