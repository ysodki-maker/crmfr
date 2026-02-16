import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  User,
  Phone,
  UserCog,
  Ruler,
  Building2,
} from "lucide-react";
import { projetService } from "../../services/api";

const ProjetCard = ({ projet, viewMode, onRefresh }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await projetService.delete(projet.id);
        onRefresh();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const getTypeIcon = (type) => {
    return type === "RIDEAU" ? "🪟" : "🖼️";
  };

  const getTypeLabel = (type) => {
    return type === "RIDEAU" ? "Rideau" : "Papier Peint";
  };

  const getTypeColor = (type) => {
    return type === "RIDEAU"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-purple-100 text-purple-700 border-purple-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6 hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            {/* Type Indicator */}
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-xl ${getTypeColor(projet.type_projet)} text-3xl`}
            >
              {getTypeIcon(projet.type_projet)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {projet.projet_name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(projet.type_projet)}`}
                    >
                      {getTypeLabel(projet.type_projet)}
                    </span>
                  </div>
                  <p className="text-neutral-600 font-medium">
                    Client: {projet.client_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-neutral-500">
                {projet.ville && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{projet.ville}</span>
                  </div>
                )}
                {projet.contact_client && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{projet.contact_client}</span>
                  </div>
                )}
                {projet.responsable && (
                  <div className="flex items-center gap-2">
                    <UserCog className="w-4 h-4" />
                    <span>{projet.responsable}</span>
                  </div>
                )}
                {projet.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(projet.created_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-6">
            <button
              onClick={() => navigate(`/projets/${projet.id}/espaces`)}
              className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
              title="Gérer les espaces"
            >
              <Building2 className="w-5 h-5"/>
            </button>
            <button
              onClick={() => navigate(`/projets/${projet.id}/mesures`)}
              className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
              title="Voir les mesures"
            >
              <Ruler className="w-5 h-5"/>
            </button>
            <button
              onClick={() => navigate(`/projets/${projet.id}`)}
              className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
              title="Voir le projet"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(`/projets/${projet.id}/edit`)}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card-hover cursor-pointer"
      onClick={() => navigate(`/projets/${projet.id}`)}
    >
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-t-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{getTypeIcon(projet.type_projet)}</span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(projet.type_projet)}`}
            >
              {getTypeLabel(projet.type_projet)}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-white/50 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-neutral-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projets/${projet.id}/espaces`)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <Building2 className="w-4 h-4" />
                  Gérer les espaces
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projets/${projet.id}/mesures`)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <Eye className="w-4 h-4" />
                  Voir les mesures
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projets/${projet.id}/edit`);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1">
          {projet.projet_name}
        </h3>

        <div className="flex items-center gap-2 mb-4 text-neutral-600">
          <User className="w-4 h-4" />
          <span className="font-medium">{projet.client_name}</span>
        </div>

        <div className="space-y-2 text-sm">
          {projet.ville && (
            <div className="flex items-center gap-2 text-neutral-500">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{projet.ville}</span>
            </div>
          )}
          {projet.contact_client && (
            <div className="flex items-center gap-2 text-neutral-500">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{projet.contact_client}</span>
            </div>
          )}
          {projet.responsable && (
            <div className="flex items-center gap-2 text-neutral-500">
              <UserCog className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{projet.responsable}</span>
            </div>
          )}
          {projet.created_at && (
            <div className="flex items-center gap-2 text-neutral-500">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{formatDate(projet.created_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjetCard;
