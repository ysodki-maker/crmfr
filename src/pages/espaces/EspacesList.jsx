import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, ArrowLeft, Loader2, Building2, Ruler, MoreVertical, ChevronRight } from "lucide-react";
import { espaceService, projetService } from "../../services/api";
import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import EspaceCard from "../../components/espaces/Espacecard";

const EspacesList = () => {
  const { projetId } = useParams();
  const navigate = useNavigate();
  const [espaces, setEspaces] = useState([]);
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [projetId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projetResponse, espacesResponse] = await Promise.all([
        projetService.getById(projetId),
        espaceService.getByProjet(projetId),
      ]);
      if (projetResponse.success) setProjet(projetResponse.data);
      if (espacesResponse.success) setEspaces(espacesResponse.data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet espace ?")) {
      try {
        await espaceService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const getTypeAccent = (type) => type === "RIDEAU" ? "bg-blue-500" : "bg-violet-500";
  const getTypeLabel = (type) => {
    if (!type) return "";
    return type === "WALLPAPER" ? "Papier Peint" : "Rideau";
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Espaces du Projet"
          subtitle={
            projet
              ? `${projet.projet_name} — ${projet.client_name}`
              : "Chargement..."
          }
        />

        <div className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="p-4 sm:p-6 lg:p-8">

            {/* ── Barre nav + actions ── */}
            <div className="flex items-center justify-between mb-5 sm:mb-8">
              <button
                onClick={() => navigate(`/projets/${projetId}`)}
                className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Retour</span>
                <span className="hidden sm:inline"> au projet</span>
              </button>

              {/* Desktop : deux boutons texte */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/projets/${projetId}/mesures`)}
                  icon={<Ruler className="w-4 h-4" />}
                >
                  Voir les mesures
                </Button>
                <Button
                  onClick={() => navigate(`/projets/${projetId}/espaces/create`)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Nouvel Espace
                </Button>
              </div>

              {/* Mobile : bouton + uniquement */}
              <button
                onClick={() => navigate(`/projets/${projetId}/espaces/create`)}
                className="sm:hidden w-9 h-9 flex items-center justify-center bg-primary-600 text-white rounded-xl shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* ── Banner projet ── */}
            {projet && (
              <div className="mb-5 sm:mb-8 rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
                {/* Barre colorée top */}
                <div className={`h-1.5 w-full ${getTypeAccent(projet.type_projet)}`} />

                <div className="p-4 sm:p-6 bg-gradient-to-br from-primary-50/70 to-accent-50/70">
                  <div className="flex items-center justify-between gap-4">
                    {/* Gauche */}
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-400 font-medium mb-0.5">Type de projet</p>
                      <h2 className="text-base sm:text-xl font-bold text-neutral-900 truncate">
                        {projet.projet_name}
                      </h2>
                      {projet.type_projet && (
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-200">
                          {getTypeLabel(projet.type_projet)}
                        </span>
                      )}
                    </div>

                    {/* Droite : compteur espaces */}
                    <div className="flex-shrink-0 text-center bg-white rounded-2xl px-4 sm:px-6 py-3 shadow-sm border border-neutral-100">
                      <p className="text-3xl sm:text-4xl font-bold text-primary-600 leading-none">
                        {espaces.length}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 font-medium">
                        espace{espaces.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Raccourci mesures — mobile uniquement */}
                <button
                  onClick={() => navigate(`/projets/${projetId}/mesures`)}
                  className="sm:hidden w-full flex items-center justify-between px-4 py-3 bg-white border-t border-neutral-100 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Voir les mesures du projet
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-300" />
                </button>
              </div>
            )}

            {/* ── Contenu ── */}
            {loading ? (
              <div className="flex items-center justify-center h-48 sm:h-64">
                <div className="text-center space-y-3">
                  <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
                  <p className="text-sm text-neutral-500">Chargement des espaces...</p>
                </div>
              </div>
            ) : espaces.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-full mb-4">
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">
                  Aucun espace créé
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  Commencez par créer votre premier espace pour ce projet
                </p>
                <Button
                  onClick={() => navigate(`/projets/${projetId}/espaces/create`)}
                  icon={<Plus className="w-5 h-5" />}
                >
                  Créer un espace
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {espaces.map((espace) => (
                  <EspaceCard
                    key={espace.id}
                    espace={espace}
                    projetType={projet?.type_projet}
                    onDelete={handleDelete}
                    onRefresh={fetchData}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspacesList;