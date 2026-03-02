/* eslint-disable react-hooks/static-components */
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
  X,
  ChevronRight,
} from "lucide-react";
import { projetService } from "../../services/api";

const ProjetCard = ({ projet, viewMode, onRefresh }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);
  const [showBottomSheet, setShowBottomSheet] = React.useState(false);

  const handleDelete = async () => {
    setShowBottomSheet(false);
    setShowMenu(false);
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await projetService.delete(projet.id);
        onRefresh();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const getTypeIcon = (type) => (type === "RIDEAU" ? "🪟" : "🖼️");
  const getTypeLabel = (type) => (type === "RIDEAU" ? "Rideau" : "Papier Peint");
  const getTypeColor = (type) =>
    type === "RIDEAU"
      ? "bg-blue-50 text-blue-600 border-blue-100"
      : "bg-violet-50 text-violet-600 border-violet-100";
  const getTypeAccent = (type) =>
    type === "RIDEAU" ? "bg-blue-500" : "bg-violet-500";

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ──────────────────────────────────────────
     BOTTOM SHEET (actions mobile)
  ────────────────────────────────────────── */
  const BottomSheet = () => (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 sm:hidden backdrop-blur-sm"
        onClick={() => setShowBottomSheet(false)}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white rounded-t-2xl shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-neutral-200 rounded-full" />
        </div>

        {/* En-tête projet */}
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${getTypeColor(projet.type_projet)}`}>
            {getTypeIcon(projet.type_projet)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-neutral-900 truncate text-sm">{projet.projet_name}</p>
            <p className="text-xs text-neutral-400 truncate">{projet.client_name}</p>
          </div>
          <button
            onClick={() => setShowBottomSheet(false)}
            className="p-1.5 rounded-full bg-neutral-100 text-neutral-500 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liste d'actions */}
        <div className="py-2 pb-10">
          {[
            { icon: <Eye className="w-5 h-5" />, label: "Voir le projet", color: "text-neutral-800", bg: "hover:bg-neutral-50", action: () => { setShowBottomSheet(false); navigate(`/projets/${projet.id}`); } },
            { icon: <Building2 className="w-5 h-5" />, label: "Gérer les espaces", color: "text-primary-600", bg: "hover:bg-primary-50", action: () => { setShowBottomSheet(false); navigate(`/projets/${projet.id}/espaces`); } },
            { icon: <Ruler className="w-5 h-5" />, label: "Voir les mesures", color: "text-primary-600", bg: "hover:bg-primary-50", action: () => { setShowBottomSheet(false); navigate(`/projets/${projet.id}/mesures`); } },
            { icon: <Edit className="w-5 h-5" />, label: "Modifier le projet", color: "text-blue-600", bg: "hover:bg-blue-50", action: () => { setShowBottomSheet(false); navigate(`/projets/${projet.id}/edit`); } },
            { icon: <Trash2 className="w-5 h-5" />, label: "Supprimer", color: "text-red-500", bg: "hover:bg-red-50", action: handleDelete, separator: true },
          ].map((item, i) => (
            <React.Fragment key={i}>
              {item.separator && <div className="h-px bg-neutral-100 mx-5 my-1" />}
              <button
                onClick={item.action}
                className={`w-full flex items-center gap-4 px-5 py-3.5 ${item.bg} transition-colors active:scale-98`}
              >
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

  /* ──────────────────────────────────────────
     MODE LISTE
  ────────────────────────────────────────── */
  if (viewMode === "list") {
    return (
      <>
        {showBottomSheet && <BottomSheet />}

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
          <div className="flex items-stretch">

            {/* Barre accent gauche */}
            <div className={`w-1 flex-shrink-0 ${getTypeAccent(projet.type_projet)}`} />

            {/* Contenu */}
            <div className="flex-1 min-w-0 px-4 py-3.5 sm:px-5 sm:py-4">

              {/* Ligne titre */}
              <div className="flex items-start gap-2.5 mb-2">
                <span className="text-xl leading-none mt-0.5 flex-shrink-0">
                  {getTypeIcon(projet.type_projet)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors leading-snug">
                      {projet.projet_name}
                    </h3>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeColor(projet.type_projet)}`}>
                      {getTypeLabel(projet.type_projet)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <User className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{projet.client_name}</span>
                  </p>
                </div>
              </div>

              {/* Chips méta */}
              <div className="flex flex-wrap gap-1.5">
                {projet.ville && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-2.5 py-1">
                    <MapPin className="w-3 h-3" /> {projet.ville}
                  </span>
                )}
                {projet.responsable && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-2.5 py-1">
                    <UserCog className="w-3 h-3" /> {projet.responsable}
                  </span>
                )}
                {projet.contact_client && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-2.5 py-1">
                    <Phone className="w-3 h-3" /> {projet.contact_client}
                  </span>
                )}
                {projet.created_at && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-2.5 py-1">
                    <Calendar className="w-3 h-3" /> {formatDate(projet.created_at)}
                  </span>
                )}
              </div>
            </div>

            {/* MOBILE : bouton ⋯ → bottom sheet */}
            <div className="flex sm:hidden items-center px-3">
              <button
                onClick={() => setShowBottomSheet(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-500 active:scale-95 transition-all"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* DESKTOP : icônes d'action */}
            <div className="hidden sm:flex items-center gap-0.5 pr-3">
              {[
                { icon: <Building2 className="w-4 h-4" />, color: "hover:bg-primary-50 text-primary-500", action: () => navigate(`/projets/${projet.id}/espaces`), title: "Espaces" },
                { icon: <Ruler className="w-4 h-4" />, color: "hover:bg-primary-50 text-primary-500", action: () => navigate(`/projets/${projet.id}/mesures`), title: "Mesures" },
                { icon: <Eye className="w-4 h-4" />, color: "hover:bg-primary-50 text-primary-500", action: () => navigate(`/projets/${projet.id}`), title: "Voir" },
                { icon: <Edit className="w-4 h-4" />, color: "hover:bg-blue-50 text-blue-500", action: () => navigate(`/projets/${projet.id}/edit`), title: "Modifier" },
                { icon: <Trash2 className="w-4 h-4" />, color: "hover:bg-red-50 text-red-400", action: handleDelete, title: "Supprimer" },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  title={btn.title}
                  className={`p-2 rounded-lg transition-colors ${btn.color}`}
                >
                  {btn.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ──────────────────────────────────────────
     MODE GRILLE
  ────────────────────────────────────────── */
  return (
    <>
      {showBottomSheet && <BottomSheet />}

      <div
        className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col"
        onClick={() => navigate(`/projets/${projet.id}`)}
      >
        {/* Barre top colorée */}
        <div className={`h-1 w-full flex-shrink-0 ${getTypeAccent(projet.type_projet)}`} />

        <div className="p-5 flex-1">
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getTypeIcon(projet.type_projet)}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getTypeColor(projet.type_projet)}`}>
                {getTypeLabel(projet.type_projet)}
              </span>
            </div>

            {/* Desktop : dropdown | Mobile : bottom sheet */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Mobile → bottom sheet, desktop → dropdown
                  if (window.innerWidth < 640) setShowBottomSheet(true);
                  else setShowMenu(!showMenu);
                }}
                className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-neutral-500" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-neutral-100 py-1.5 z-10">
                  {[
                    
                    { icon: <Edit className="w-4 h-4" />, label: "Modifier", action: () => navigate(`/projets/${projet.id}/edit`), color: "text-neutral-700" },
                    { icon: <Trash2 className="w-4 h-4" />, label: "Supprimer", action: handleDelete, color: "text-red-500", separator: true },
                  ].map((item, i) => (
                    <React.Fragment key={i}>
                      {item.separator && <div className="h-px bg-neutral-100 my-1" />}
                      <button
                        onClick={(e) => { e.stopPropagation(); item.action(); }}
                        className={`w-full px-4 py-2.5 text-left hover:bg-neutral-50 flex items-center gap-2.5 text-sm ${item.color}`}
                      >
                        {item.icon} {item.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nom */}
          <h3 className="text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
            {projet.projet_name}
          </h3>

          {/* Client */}
          <div className="flex items-center gap-1.5 mb-3 text-neutral-500">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-sm font-medium truncate">{projet.client_name}</span>
          </div>

          {/* Chips méta */}
          <div className="flex flex-wrap gap-1.5">
            {projet.ville && (
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-2.5 py-1">
                <MapPin className="w-3 h-3" /> {projet.ville}
              </span>
            )}
            {projet.created_at && (
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-2.5 py-1">
                <Calendar className="w-3 h-3" /> {formatDate(projet.created_at)}
              </span>
            )}
          </div>
        </div>

        {/* Footer raccourcis */}
        <div className="border-t border-neutral-50 px-5 py-2.5 flex items-center justify-between bg-neutral-50/60">
          {[
            { icon: <Building2 className="w-3.5 h-3.5" />, label: "Espaces", action: () => navigate(`/projets/${projet.id}/espaces`), color: "text-primary-600 hover:text-primary-700" },
            { icon: <Ruler className="w-3.5 h-3.5" />, label: "Mesures", action: () => navigate(`/projets/${projet.id}/mesures`), color: "text-primary-600 hover:text-primary-700" },
            { icon: <Edit className="w-3.5 h-3.5" />, label: "Modifier", action: () => navigate(`/projets/${projet.id}/edit`), color: "text-blue-500 hover:text-blue-600" },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); btn.action(); }}
              className={`text-xs font-medium flex items-center gap-1 transition-colors ${btn.color}`}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjetCard;