import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  ChevronRight,
} from "lucide-react";

const EspaceCard = ({ espace, projetType, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet espace ?')) {
      onDelete(espace.id);
    }
  };

  const getDetailsCount = () => {
    if (projetType === "RIDEAU") {
      return espace.rideaux?.length || 0;
    } else if (projetType === "WALLPAPER") {
      return espace.wallpapers?.length || 0;
    }
    return 0;
  };

  const detailsCount = getDetailsCount();

  return (
    <div 
      className="group bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 rounded-2xl p-6 border-2 border-transparent hover:border-indigo-300 transition-all duration-300 cursor-pointer relative overflow-hidden"
      onClick={() => navigate(`/espaces/${espace.id}`)}
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Content */}
      <div className="relative">
        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {espace.espace_name}
        </h3>
        {/* Bottom row */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-sm">
            {detailsCount > 0 ? (
              <span className="font-bold text-slate-700">
                {detailsCount} {projetType === "RIDEAU" ? "rideau" : "papier"}{detailsCount > 1 ? projetType === "RIDEAU" ?"x":"s" : ""}
              </span>
            ) : (
              <span className="text-slate-400 font-medium">Aucun détail</span>
            )}
          </div>

          {/* Actions on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/espaces/${espace.id}/edit`);
              }}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
            <ChevronRight className="w-5 h-5 text-indigo-600 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspaceCard;