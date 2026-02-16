/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  UserPlus,
  Shield,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Users,
  Loader2
} from 'lucide-react';
import { userService } from '../../services/api';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (roleFilter) filters.role = roleFilter;
      if (statusFilter) filters.is_active = statusFilter;

      const response = await userService.getAll(filters);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.delete(userId);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-300',
      USER: 'bg-blue-100 text-blue-800 border-blue-300',
      MANAGER: 'bg-green-100 text-green-800 border-green-300'
    };
    return styles[role] || styles.USER;
  };

  const getRoleLabel = (role) => {
    const labels = {
      ADMIN: 'Administrateur',
      USER: 'Utilisateur',
    };
    return labels[role] || role;
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestion des Utilisateurs" subtitle="Gérez les comptes utilisateurs" />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {/* Actions & Filtres */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Filtre Rôle */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-sm font-medium"
                >
                  <option value="">Tous les rôles</option>
                  <option value="ADMIN">Administrateur</option>
                  <option value="UTILISATEUR">Utilisateur</option>
                </select>

                {/* Filtre Statut */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-sm font-medium"
                >
                  <option value="">Tous les statuts</option>
                  <option value="true">Actifs</option>
                  <option value="false">Inactifs</option>
                </select>

                <Button
                  onClick={() => navigate('/users/create')}
                  icon={<UserPlus className="w-5 h-5" />}
                >
                  Nouvel Utilisateur
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium mb-1">Total</p>
                    <p className="text-3xl font-bold text-blue-900">{users.length}</p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 font-medium mb-1">Admins</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {users.filter(u => u.role === 'ADMIN').length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500 rounded-xl">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Card>

              {/* <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">Actifs</p>
                    <p className="text-3xl font-bold text-green-900">
                      {users.filter(u => u.is_active).length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700 font-medium mb-1">Inactifs</p>
                    <p className="text-3xl font-bold text-red-900">
                      {users.filter(u => !u.is_active).length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-500 rounded-xl">
                    <XCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Card> */}
            </div>

            {/* Liste des utilisateurs */}
            {filteredUsers.length === 0 ? (
              <Card className="text-center py-12">
                <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {searchTerm ? 'Aucun résultat' : 'Aucun utilisateur'}
                </h3>
                <p className="text-neutral-500 mb-6">
                  {searchTerm
                    ? `Aucun utilisateur ne correspond à "${searchTerm}"`
                    : 'Commencez par créer votre premier utilisateur'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => navigate('/users/create')}
                    icon={<UserPlus className="w-5 h-5" />}
                  >
                    Créer un utilisateur
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <Card key={user.ID} className="hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                          {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-900">
                            {user.first_name} {user.last_name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                            <Shield className="w-3 h-3" />
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setShowMenu(showMenu === user.ID ? null : user.ID)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-neutral-600" />
                        </button>

                        {showMenu === user.ID && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowMenu(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-neutral-200 py-2 z-20 animate-scale-in">
                              <button
                                onClick={() => {
                                  setShowMenu(null);
                                  navigate(`/users/${user.ID}/edit`);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">Modifier</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShowMenu(null);
                                  handleDelete(user.ID);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="font-medium">Supprimer</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Phone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        {user.is_active ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">Actif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-semibold text-red-700">Inactif</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500 font-mono">ID: {user.ID}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;