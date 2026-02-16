import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { espaceService } from '../../services/api';
import { projetService } from '../../services/api';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import EspaceCard from '../../components/espaces/Espacecard';

const EspacesList = () => {
  const { projetId } = useParams();
  const navigate = useNavigate();
  const [espaces, setEspaces] = useState([]);
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [projetId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Charger le projet et les espaces en parallèle
      const [projetResponse, espacesResponse] = await Promise.all([
        projetService.getById(projetId),
        espaceService.getByProjet(projetId)
      ]);
      
      if (projetResponse.success) {
        setProjet(projetResponse.data);
      }
      
      if (espacesResponse.success) {
        setEspaces(espacesResponse.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet espace ?')) {
      try {
        await espaceService.delete(id);
        fetchData(); // Recharger la liste
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Espaces du Projet" 
          subtitle={projet?.projet_name + " Pour Client : " + projet?.client_name || 'Chargement...'}
        />

        <div className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="p-8">
            {/* Back to Project & Actions */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate(`/projets/${projetId}`)}
                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Retour au projet</span>
              </button>

              <Button
                onClick={() => navigate(`/projets/${projetId}/espaces/create`)}
                icon={<Plus className="w-5 h-5" />}
              >
                Nouvel Espace
              </Button>
            </div>

            {/* Project Info Banner */}
            {projet && (
              <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                      {projet.nom}
                    </h2>
                    <p className="text-neutral-600">
                      Type de projet: <span className="font-semibold text-primary-700">{projet.type_projet === "WALLPAPER" ? "Papier Peint" : ""}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-600 mb-1">Nombre d'espaces</p>
                    <p className="text-4xl font-bold text-primary-600">
                      {espaces.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des espaces */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
                  <p className="text-neutral-600">Chargement des espaces...</p>
                </div>
              </div>
            ) : espaces.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full mb-4">
                  <Building2 className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Aucun espace créé
                </h3>
                <p className="text-neutral-500 mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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