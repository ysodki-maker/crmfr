import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Grid, List, Loader2 } from 'lucide-react';
import { projetService } from '../../services/api';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import ProjetCard from '../../components/projets/ProjetCard';

const ProjetsList = () => {
  const navigate = useNavigate();
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type_projet: '',
    ville: '',
  });

  useEffect(() => {
    fetchProjets();
  }, [filters]);

  const fetchProjets = async () => {
    try {
      setLoading(true);
      const response = await projetService.getAll(filters);
      if (response.success) {
        setProjets(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjets = projets.filter(projet =>
    projet.projet_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.ville?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Obtenir les villes uniques pour le filtre
  const uniqueVilles = [...new Set(projets.map(p => p.ville).filter(Boolean))];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Projets Clients" 
          subtitle={`${filteredProjets.length} projet(s) trouvé(s)`}
        />

        <div className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="p-8">
            {/* Actions et Filtres */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par projet, client ou ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-white border-2 border-neutral-200 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'grid'
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'list'
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Create Button */}
                  <Button
                    onClick={() => navigate('/projets/create')}
                    icon={<Plus className="w-5 h-5" />}
                  >
                    <span className="hidden md:inline">Nouveau Projet</span>
                  </Button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {/* Type de projet */}
                <button
                  onClick={() => handleFilterChange('type_projet', '')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    !filters.type_projet
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => handleFilterChange('type_projet', 'RIDEAU')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    filters.type_projet === 'RIDEAU'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  <span>🪟</span>
                  Rideaux
                </button>
                <button
                  onClick={() => handleFilterChange('type_projet', 'WALLPAPER')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    filters.type_projet === 'WALLPAPER'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  <span>🖼️</span>
                  Wallpaper
                </button>

                {/* Ville Filter (si des villes existent) */}
                {uniqueVilles.length > 0 && (
                  <>
                    <div className="w-px h-8 bg-neutral-200"></div>
                    <select
                      value={filters.ville}
                      onChange={(e) => handleFilterChange('ville', e.target.value)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-neutral-200 hover:bg-neutral-50 transition-all outline-none"
                    >
                      <option value="">Toutes les villes</option>
                      {uniqueVilles.map((ville) => (
                        <option key={ville} value={ville}>
                          {ville}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>

            {/* Liste des projets */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
                  <p className="text-neutral-600">Chargement des projets...</p>
                </div>
              </div>
            ) : filteredProjets.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full mb-4">
                  <Grid className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-neutral-500 mb-6">
                  {searchTerm || filters.type_projet || filters.ville
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Commencez par créer votre premier projet'}
                </p>
                <Button
                  onClick={() => navigate('/projets/create')}
                  icon={<Plus className="w-5 h-5" />}
                >
                  Créer un projet
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProjets.map((projet) => (
                  <ProjetCard
                    key={projet.id}
                    projet={projet}
                    viewMode={viewMode}
                    onRefresh={fetchProjets}
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

export default ProjetsList;