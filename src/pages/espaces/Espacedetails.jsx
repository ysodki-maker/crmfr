/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Ruler,
  Maximize2,
  Calendar,
  Tag,
  Layers,
  FileText,
  ChevronRight,
  Building2,
  Grid3x3,
  Eye,
  Package,
  Info,
  X,
  MoreVertical,
} from "lucide-react";
import { projetService, espaceService } from "../../services/api";
import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const EspaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [espace, setEspace] = useState(null);
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRideau, setExpandedRideau] = useState(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await espaceService.getById(id);
      if (response.success && response.data) {
        setEspace(response.data);
        const projetResponse = await projetService.getById(response.data.projet_id);
        if (projetResponse.success) setProjet(projetResponse.data);
      } else {
        setError("Espace non trouvé");
      }
    } catch (err) {
      setError("Erreur lors du chargement de l'espace");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowActionSheet(false);
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet espace ?")) {
      try {
        await espaceService.delete(id);
        navigate(`/projets/${espace.projet_id}/espaces`);
      } catch (err) {
        setError("Erreur lors de la suppression de l'espace");
      }
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <div className="relative w-14 h-14 mx-auto">
            <div className="w-14 h-14 border-4 border-primary-200 rounded-full" />
            <div className="w-14 h-14 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0" />
          </div>
          <p className="text-neutral-500 text-sm font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  /* ── Erreur ── */
  if (error || !espace) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50 px-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Espace introuvable</h2>
          <p className="text-neutral-500 text-sm">{error}</p>
          <Button onClick={() => navigate(-1)}>Retour</Button>
        </div>
      </div>
    );
  }

  const rideauxCount = espace.rideaux?.length || 0;
  const wallpapersCount = espace.wallpapers?.length || 0;
  const totalDetails = rideauxCount + wallpapersCount;

  /* ── Bottom Sheet (mobile) ── */
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
          <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-primary-600" />
          </div>
          <p className="flex-1 font-semibold text-neutral-900 text-sm truncate">{espace.espace_name}</p>
          <button onClick={() => setShowActionSheet(false)} className="p-1.5 bg-neutral-100 rounded-full">
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
        <div className="py-2 pb-10">
          {[
            { icon: <Edit className="w-5 h-5" />, label: "Modifier l'espace", color: "text-blue-600", bg: "hover:bg-blue-50", action: () => { setShowActionSheet(false); navigate(`/espaces/${id}/edit`); } },
            { icon: <Eye className="w-5 h-5" />, label: "Voir les mesures", color: "text-primary-600", bg: "hover:bg-primary-50", action: () => { setShowActionSheet(false); navigate(`/projets/${projet?.id}/mesures`); } },
            { icon: <Trash2 className="w-5 h-5" />, label: "Supprimer l'espace", color: "text-red-500", bg: "hover:bg-red-50", action: handleDelete, separator: true },
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

      <div className="flex h-screen overflow-hidden bg-neutral-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={espace.espace_name}
            subtitle={projet?.nom || "Détails de l'espace"}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

              {/* ── Nav bar ── */}
              <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
                <button
                  onClick={() => navigate(`/projets/${espace.projet_id}/espaces`)}
                  className="group inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-white border border-neutral-200 group-hover:border-primary-300 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline font-semibold">Retour</span>
                </button>

                {/* Desktop */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" onClick={() => navigate(`/espaces/${id}/edit`)} icon={<Edit className="w-4 h-4" />}>
                    Modifier
                  </Button>
                  <Button variant="danger" onClick={handleDelete} icon={<Trash2 className="w-4 h-4" />}>
                    Supprimer
                  </Button>
                </div>

                {/* Mobile */}
                <button
                  onClick={() => setShowActionSheet(true)}
                  className="sm:hidden w-9 h-9 flex items-center justify-center bg-white border border-neutral-200 rounded-xl text-neutral-600"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* ── Hero card ── */}
              <div className="mb-5 sm:mb-6 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
                <div className="relative p-5 sm:p-6 lg:p-8">
                  {/* Déco bg */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl" />
                  </div>

                  <div className="relative">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {projet && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                          <Building2 className="w-3.5 h-3.5" />
                          {projet.projet_name}
                        </span>
                      )}
                      {projet?.type_projet && (
                        <span className="px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                          {projet.type_projet === "WALLPAPER" ? "Papier Peint" : "Rideau"}
                        </span>
                      )}
                      {totalDetails > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-500 rounded-full text-white text-xs font-bold">
                          <Package className="w-3.5 h-3.5" />
                          {totalDetails}
                        </span>
                      )}
                    </div>

                    {/* Titre */}
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-1.5 leading-tight">
                      {espace.espace_name}
                    </h1>

                    {espace.created_at && (
                      <p className="text-primary-200 text-xs sm:text-sm font-medium">
                        Créé le{" "}
                        {new Date(espace.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Actions rapides mobile (pills) ── */}
              <div className="flex sm:hidden gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => navigate(`/espaces/${id}/edit`)}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-100 active:scale-95 transition-all"
                >
                  <Edit className="w-3.5 h-3.5" /> Modifier
                </button>
                <button
                  onClick={() => navigate(`/projets/${projet?.id}/mesures`)}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-primary-50 text-primary-600 border border-primary-100 active:scale-95 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> Mesures
                </button>
              </div>

              {/* ── Grille principale ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-5 sm:space-y-6">

                  {/* ── Rideaux ── */}
                  {projet?.type_projet === "RIDEAU" && espace.rideaux?.length > 0 && (
                    <Card>
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-xl font-bold text-neutral-900">
                          Détails des rideaux
                        </h2>
                        <div className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-bold">
                          {espace.rideaux.length} rideau{espace.rideaux.length > 1 ? "x" : ""}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {espace.rideaux.map((rideau, index) => (
                          <div
                            key={index}
                            className="border-2 border-neutral-200 rounded-2xl overflow-hidden hover:border-primary-300 transition-colors"
                          >
                            <button
                              onClick={() => setExpandedRideau(expandedRideau === index ? null : index)}
                              className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-neutral-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-md flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div className="text-left">
                                  <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                                    Rideau {index + 1}
                                  </h3>
                                  {(rideau.largeur || rideau.hauteur) && (
                                    <p className="text-xs sm:text-sm font-semibold text-primary-600">
                                      {rideau.largeur && `${rideau.largeur}cm`}
                                      {rideau.largeur && rideau.hauteur && " × "}
                                      {rideau.hauteur && `${rideau.hauteur}cm`}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <ChevronRight
                                className={`w-5 h-5 text-neutral-400 transition-transform flex-shrink-0 ${expandedRideau === index ? "rotate-90" : ""}`}
                              />
                            </button>

                            {expandedRideau === index && (
                              <div className="p-4 sm:p-5 bg-neutral-50 border-t-2 border-neutral-200">
                                {/* Dimensions */}
                                {(rideau.largeur || rideau.hauteur) && (
                                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 p-3 sm:p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                                    {rideau.largeur && (
                                      <DimItem icon={<Ruler className="w-4 h-4 text-indigo-600" />} label="Largeur" value={rideau.largeur} color="indigo" />
                                    )}
                                    {rideau.hauteur && (
                                      <DimItem icon={<Ruler className="w-4 h-4 text-blue-600 rotate-90" />} label="Hauteur" value={rideau.hauteur} color="blue" />
                                    )}
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                                  {rideau.type_tringles && <DetailItem icon={Tag} label="Type de tringles" value={rideau.type_tringles} />}
                                  {rideau.type_rideau && <DetailItem icon={Layers} label="Type de rideau" value={rideau.type_rideau} />}
                                  {rideau.type_ouverture && <DetailItem icon={ChevronRight} label="Type d'ouverture" value={rideau.type_ouverture} />}
                                  {rideau.type_confection && <DetailItem icon={Grid3x3} label="Type de confection" value={rideau.type_confection} />}
                                  {rideau.ampleur && <DetailItem icon={Maximize2} label="Ampleur" value={`× ${rideau.ampleur}`} />}
                                  {rideau.finition_au_sol && <DetailItem icon={Ruler} label="Finition au sol" value={rideau.finition_au_sol} />}
                                  {rideau.ref_tissu && <DetailItem icon={Tag} label="Référence tissu" value={rideau.ref_tissu} />}
                                  {rideau.ourlet && <DetailItem icon={Ruler} label="Ourlet" value={`${rideau.ourlet}`} />}
                                </div>

                                {rideau.remarque_client && (
                                  <div className="p-3 sm:p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                    <div className="flex items-start gap-2.5">
                                      <FileText className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-xs text-amber-700 font-bold uppercase mb-1">Remarque client</p>
                                        <p className="text-sm text-amber-900 leading-relaxed">{rideau.remarque_client}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* ── Wallpapers ── */}
                  {projet?.type_projet === "WALLPAPER" && espace.wallpapers?.length > 0 && (
                    <Card>
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-xl font-bold text-neutral-900">Détails des murs</h2>
                        <div className="px-2.5 py-1 bg-accent-100 text-accent-700 rounded-full text-xs sm:text-sm font-bold">
                          {espace.wallpapers.length} mur{espace.wallpapers.length > 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {espace.wallpapers.map((wallpaper, index) => (
                          <div
                            key={index}
                            className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-neutral-200 hover:border-accent-300 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-500 to-accent-700 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-md flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm sm:text-base font-bold text-neutral-900">Mur {index + 1}</h3>
                                {(wallpaper.largeur || wallpaper.hauteur) && (
                                  <p className="text-xs sm:text-sm font-semibold text-accent-600">
                                    {wallpaper.largeur && `${wallpaper.largeur}cm`}
                                    {wallpaper.largeur && wallpaper.hauteur && " × "}
                                    {wallpaper.hauteur && `${wallpaper.hauteur}cm`}
                                  </p>
                                )}
                              </div>
                            </div>

                            {(wallpaper.largeur || wallpaper.hauteur) && (
                              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 p-3 sm:p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border-2 border-cyan-200">
                                {wallpaper.largeur && (
                                  <DimItem icon={<Ruler className="w-4 h-4 text-cyan-600" />} label="Largeur" value={wallpaper.largeur} color="cyan" />
                                )}
                                {wallpaper.hauteur && (
                                  <DimItem icon={<Ruler className="w-4 h-4 text-teal-600 rotate-90" />} label="Hauteur" value={wallpaper.hauteur} color="teal" />
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {wallpaper.type_prise && <DetailItem icon={Ruler} label="Type de prise" value={wallpaper.type_prise} accent />}
                              {wallpaper.type_produit && <DetailItem icon={Layers} label="Type de produit" value={wallpaper.type_produit} accent />}
                              {wallpaper.etat_mur && <DetailItem icon={Building2} label="État du mur" value={wallpaper.etat_mur} accent />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-4 sm:space-y-5">
                  {/* Infos */}
                  <Card>
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-4 h-4 text-primary-600" />
                      <h3 className="font-bold text-neutral-900 text-sm sm:text-base">Informations</h3>
                    </div>
                    <div className="space-y-2">
                      <InfoRow icon={Tag} label="ID" value={`#${espace.id}`} mono />
                      {projet && <InfoRow icon={Building2} label="Projet" value={projet.nom} />}
                      <InfoRow
                        icon={Calendar}
                        label="Créé le"
                        value={espace.created_at && new Date(espace.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      />
                    </div>
                  </Card>

                  {/* Actions rapides — desktop uniquement */}
                  <div className="hidden sm:block">
                    <Card>
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="w-4 h-4 text-primary-600" />
                        <h3 className="font-bold text-neutral-900 text-sm sm:text-base">Actions rapides</h3>
                      </div>
                      <div className="space-y-2">
                        <QuickAction icon={Edit} label="Modifier" onClick={() => navigate(`/espaces/${id}/edit`)} color="blue" />
                        <QuickAction icon={Eye} label="Voir les mesures" onClick={() => navigate(`/projets/${projet?.id}/mesures`)} color="purple" />
                      </div>
                    </Card>
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

/* ── Sub-components ── */

const DimItem = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className={`text-[10px] sm:text-xs text-${color}-600 font-semibold uppercase`}>{label}</p>
      <p className={`text-base sm:text-lg font-black text-${color}-900 leading-none`}>
        {value} <span className="text-xs font-normal">cm</span>
      </p>
    </div>
  </div>
);

const DetailItem = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-neutral-200">
    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${accent ? "text-accent-600" : "text-primary-600"}`} />
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-neutral-400 font-semibold uppercase mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-neutral-900 break-words">{value}</p>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, mono }) => (
  <div className="flex items-center gap-2.5 p-2.5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
    <Icon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-neutral-400 font-medium mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-neutral-900 truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, onClick, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100",
    green: "bg-green-50 text-green-700 hover:bg-green-100 border border-green-100",
    purple: "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100",
    orange: "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-100",
  };
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${colors[color]}`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
    </button>
  );
};

export default EspaceDetails;