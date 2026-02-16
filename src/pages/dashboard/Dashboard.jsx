import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  Building2, 
  Users, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { projetService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/layout/Header';
import Card from '../../components/common/Card';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjets: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    projetsEnAttente: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await projetService.getAll();
      if (response.success && response.data) {
        const projets = response.data;
        setStats({
          totalProjets: projets.length,
          projetsEnCours: projets.filter(p => p.statut === 'En cours').length,
          projetsTermines: projets.filter(p => p.statut === 'Terminé').length,
          projetsEnAttente: projets.filter(p => p.statut === 'En attente').length,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projets',
      value: stats.totalProjets,
      icon: FolderKanban,
      color: 'from-primary-500 to-primary-700',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      title: 'En Cours',
      value: stats.projetsEnCours,
      icon: Clock,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Terminés',
      value: stats.projetsTermines,
      icon: CheckCircle,
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'En Attente',
      value: stats.projetsEnAttente,
      icon: AlertCircle,
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={`Bienvenue, ${user?.first_name || 'Utilisateur'} 👋`}
          subtitle={`Voici un aperçu de vos projets`}
        />

        <div className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 hidden">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="card-hover cursor-pointer"
                  onClick={() => navigate('/projets')}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        <span>+12%</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-neutral-600 text-sm font-medium mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-neutral-900">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 hidden">
              <Card 
                title="Actions Rapides"
                className="lg:col-span-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('/projets/create')}
                    className="p-6 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                  >
                    <FolderKanban className="w-8 h-8 text-neutral-400 group-hover:text-primary-600 mx-auto mb-3 transition-colors" />
                    <p className="font-semibold text-neutral-900 text-center">
                      Nouveau Projet
                    </p>
                  </button>

                  <button
                    onClick={() => navigate('/espaces')}
                    className="p-6 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                  >
                    <Building2 className="w-8 h-8 text-neutral-400 group-hover:text-primary-600 mx-auto mb-3 transition-colors" />
                    <p className="font-semibold text-neutral-900 text-center">
                      Gérer Espaces
                    </p>
                  </button>

                  <button
                    onClick={() => navigate('/users')}
                    className="p-6 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                  >
                    <Users className="w-8 h-8 text-neutral-400 group-hover:text-primary-600 mx-auto mb-3 transition-colors" />
                    <p className="font-semibold text-neutral-900 text-center">
                      Voir Utilisateurs
                    </p>
                  </button>
                </div>
              </Card>

              <Card title="Activité Récente">
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          Nouveau projet créé
                        </p>
                        <p className="text-xs text-neutral-500">Il y a 2 heures</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">
                  Bienvenue dans votre CRM 🎉
                </h2>
                <p className="text-primary-100 text-lg leading-relaxed mb-6">
                  Gérez efficacement tous vos projets en un seul endroit. Suivez l'avancement, 
                  organisez vos espaces et collaborez avec votre équipe.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/projets/create')}
                    className="px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                  >
                    Créer un projet
                  </button>
                  <button
                    onClick={() => navigate('/projets')}
                    className="px-6 py-3 bg-primary-700/50 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors border border-white/20"
                  >
                    Voir tous les projets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;