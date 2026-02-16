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
  Download,
  Printer,
  Share2,
  ChevronRight,
  Building2,
  Grid3x3,
  Eye,
  EyeOff,
  Package,
  Info,
  Settings,
  X,
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

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await espaceService.getById(id);

      if (response.success && response.data) {
        setEspace(response.data);

        const projetResponse = await projetService.getById(
          response.data.projet_id,
        );
        if (projetResponse.success) {
          setProjet(projetResponse.data);
        }
      } else {
        setError("Espace non trouvé");
      }
    } catch (err) {
      setError("Erreur lors du chargement de l'espace");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet espace ?")) {
      try {
        await espaceService.delete(id);
        navigate(`/projets/${espace.projet_id}/espaces`);
      } catch (err) {
        setError("Erreur lors de la suppression de l'espace");
        console.error("Erreur:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-neutral-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !espace) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-10 h-10 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Espace introuvable
            </h2>
            <p className="text-neutral-600">{error}</p>
          </div>
          <Button onClick={() => navigate(-1)}>Retour</Button>
        </div>
      </div>
    );
  }

  const rideauxCount = espace.rideaux?.length || 0;
  const wallpapersCount = espace.wallpapers?.length || 0;
  const totalDetails = rideauxCount + wallpapersCount;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={espace.espace_name}
          subtitle={projet?.nom || "Détails de l'espace"}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* Top Bar - Navigation & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <button
                onClick={() => navigate(`/projets/${espace.projet_id}/espaces`)}
                className="group inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <div className="p-2 rounded-lg bg-white border border-neutral-200 group-hover:border-primary-300 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-semibold">Retour</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/espaces/${id}/edit`)}
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
            </div>

            {/* Hero Card */}
            <div className="mb-6 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative p-6 lg:p-8">
                {/* Decorative background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl"></div>
                </div>

                <div className="relative">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Title Section */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {projet && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-bold">
                            <Building2 className="w-4 h-4" />
                            {projet.projet_name}
                          </span>
                        )}
                        {projet?.type_projet && (
                          <span className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                            {projet.type_projet === "WALLPAPER"
                              ? "Papier Peint"
                              : "Rideau"}
                          </span>
                        )}
                        {totalDetails > 0 && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 rounded-full text-white text-sm font-bold">
                            <Package className="w-4 h-4" />
                            {totalDetails}
                          </span>
                        )}
                      </div>

                      <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2">
                        {espace.espace_name}
                      </h1>

                      {espace.created_at && (
                        <p className="text-primary-100 text-sm font-medium">
                          Créé le{" "}
                          {new Date(espace.created_at).toLocaleDateString(
                            "fr-FR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Rideaux Details */}
                {projet?.type_projet === "RIDEAU" &&
                  espace.rideaux &&
                  espace.rideaux.length > 0 && (
                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-neutral-900">
                          Détails des rideaux
                        </h2>
                        <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-bold">
                          {espace.rideaux.length} rideau
                          {espace.rideaux.length > 1 ? "x" : ""}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {espace.rideaux.map((rideau, index) => (
                          <div
                            key={index}
                            className="border-2 border-neutral-200 rounded-2xl overflow-hidden hover:border-primary-300 transition-colors"
                          >
                            <button
                              onClick={() =>
                                setExpandedRideau(
                                  expandedRideau === index ? null : index,
                                )
                              }
                              className="w-full flex items-center justify-between p-5 bg-white hover:bg-neutral-50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                  {index + 1}
                                </div>
                                <div className="text-left">
                                  <h3 className="text-lg font-bold text-neutral-900">
                                    Rideau {index + 1}
                                  </h3>
                                  {/* ✅ AJOUT: Affichage des dimensions dans le header */}
                                  {(rideau.largeur || rideau.hauteur) && (
                                    <p className="text-sm font-semibold text-primary-600">
                                      {rideau.largeur && `${rideau.largeur}m`}
                                      {rideau.largeur &&
                                        rideau.hauteur &&
                                        " × "}
                                      {rideau.hauteur && `${rideau.hauteur}m`}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <ChevronRight
                                className={`w-6 h-6 text-neutral-400 transition-transform ${
                                  expandedRideau === index ? "rotate-90" : ""
                                }`}
                              />
                            </button>

                            {expandedRideau === index && (
                              <div className="p-5 bg-neutral-50 border-t-2 border-neutral-200">
                                {/* ✅ AJOUT: Section dimensions en haut */}
                                {(rideau.largeur || rideau.hauteur) && (
                                  <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                                    {rideau.largeur && (
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                          <Ruler className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-indigo-600 font-semibold uppercase">
                                            Largeur
                                          </p>
                                          <p className="text-lg font-black text-indigo-900">
                                            {rideau.largeur}{" "}
                                            <span className="text-sm font-normal">
                                              m
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {rideau.hauteur && (
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                          <Ruler className="w-5 h-5 text-blue-600 rotate-90" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-blue-600 font-semibold uppercase">
                                            Hauteur
                                          </p>
                                          <p className="text-lg font-black text-blue-900">
                                            {rideau.hauteur}{" "}
                                            <span className="text-sm font-normal">
                                              m
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                  {rideau.type_tringles && (
                                    <DetailItem
                                      icon={Tag}
                                      label="Type de tringles"
                                      value={rideau.type_tringles}
                                    />
                                  )}
                                  {rideau.type_rideau && (
                                    <DetailItem
                                      icon={Layers}
                                      label="Type de rideau"
                                      value={rideau.type_rideau}
                                    />
                                  )}
                                  {rideau.type_ouverture && (
                                    <DetailItem
                                      icon={ChevronRight}
                                      label="Type d'ouverture"
                                      value={rideau.type_ouverture}
                                    />
                                  )}
                                  {rideau.type_confection && (
                                    <DetailItem
                                      icon={Grid3x3}
                                      label="Type de confection"
                                      value={rideau.type_confection}
                                    />
                                  )}
                                  {rideau.ampleur && (
                                    <DetailItem
                                      icon={Maximize2}
                                      label="Ampleur"
                                      value={`× ${rideau.ampleur}`}
                                    />
                                  )}
                                  {rideau.finition_au_sol && (
                                    <DetailItem
                                      icon={Ruler}
                                      label="Finition au sol"
                                      value={rideau.finition_au_sol}
                                    />
                                  )}
                                  {rideau.ref_tissu && (
                                    <DetailItem
                                      icon={Tag}
                                      label="Référence tissu"
                                      value={rideau.ref_tissu}
                                    />
                                  )}
                                  {rideau.ourlet && (
                                    <DetailItem
                                      icon={Ruler}
                                      label="Ourlet"
                                      value={`${rideau.ourlet}`}
                                    />
                                  )}
                                </div>

                                {rideau.remarque_client && (
                                  <div className="p-4 bg-amber-100 border-2 border-amber-300 rounded-xl">
                                    <div className="flex items-start gap-3">
                                      <FileText className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-xs text-amber-800 font-bold uppercase mb-2">
                                          Remarque client
                                        </p>
                                        <p className="text-sm text-amber-900 leading-relaxed">
                                          {rideau.remarque_client}
                                        </p>
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

                {/* Wallpapers Details */}
                {projet?.type_projet === "WALLPAPER" &&
                  espace.wallpapers &&
                  espace.wallpapers.length > 0 && (
                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-neutral-900">
                          Détails des papiers peints
                        </h2>
                        <div className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-bold">
                          {espace.wallpapers.length} papier
                          {espace.wallpapers.length > 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {espace.wallpapers.map((wallpaper, index) => (
                          <div
                            key={index}
                            className="p-5 bg-white rounded-2xl border-2 border-neutral-200 hover:border-accent-300 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-center gap-4 mb-5">
                              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-neutral-900">
                                  Papier peint {index + 1}
                                </h3>
                                {/* ✅ AJOUT: Affichage des dimensions */}
                                {(wallpaper.largeur || wallpaper.hauteur) && (
                                  <p className="text-sm font-semibold text-accent-600">
                                    {wallpaper.largeur &&
                                      `${wallpaper.largeur}m`}
                                    {wallpaper.largeur &&
                                      wallpaper.hauteur &&
                                      " × "}
                                    {wallpaper.hauteur &&
                                      `${wallpaper.hauteur}m`}
                                  </p>
                                )}
                                <p className="text-sm text-neutral-500">
                                  Configuration
                                </p>
                              </div>
                            </div>

                            {/* ✅ AJOUT: Section dimensions avec style visuel */}
                            {(wallpaper.largeur || wallpaper.hauteur) && (
                              <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border-2 border-cyan-200">
                                {wallpaper.largeur && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                      <Ruler className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-cyan-600 font-semibold uppercase">
                                        Largeur
                                      </p>
                                      <p className="text-lg font-black text-cyan-900">
                                        {wallpaper.largeur}{" "}
                                        <span className="text-sm font-normal">
                                          m
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {wallpaper.hauteur && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                      <Ruler className="w-5 h-5 text-teal-600 rotate-90" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-teal-600 font-semibold uppercase">
                                        Hauteur
                                      </p>
                                      <p className="text-lg font-black text-teal-900">
                                        {wallpaper.hauteur}{" "}
                                        <span className="text-sm font-normal">
                                          m
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {wallpaper.type_prise && (
                                <DetailItem
                                  icon={Ruler}
                                  label="Type de prise"
                                  value={wallpaper.type_prise}
                                  accent
                                />
                              )}
                              {wallpaper.type_produit && (
                                <DetailItem
                                  icon={Layers}
                                  label="Type de produit"
                                  value={wallpaper.type_produit}
                                  accent
                                />
                              )}
                              {wallpaper.etat_mur && (
                                <DetailItem
                                  icon={Building2}
                                  label="État du mur"
                                  value={wallpaper.etat_mur}
                                  accent
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Info Card */}
                <Card>
                  <div className="flex items-center gap-2 mb-5">
                    <Info className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-neutral-900">Informations</h3>
                  </div>
                  <div className="space-y-3">
                    <InfoRow
                      icon={Tag}
                      label="ID"
                      value={`#${espace.id}`}
                      mono
                    />
                    {projet && (
                      <InfoRow
                        icon={Building2}
                        label="Projet"
                        value={projet.nom}
                      />
                    )}
                    <InfoRow
                      icon={Calendar}
                      label="Créé le"
                      value={
                        espace.created_at &&
                        new Date(espace.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      }
                    />
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <div className="flex items-center gap-2 mb-5">
                    <Package className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-neutral-900">
                      Actions rapides
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <QuickAction
                      icon={Edit}
                      label="Modifier"
                      onClick={() => navigate(`/espaces/${id}/edit`)}
                      color="blue"
                    />
                    <QuickAction
                      icon={Eye}
                      label="Voir les mesures"
                      onClick={() => navigate(`/projets/${projet.id}/mesures`)}
                      color="purple"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const DetailItem = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-neutral-200">
    <Icon
      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${accent ? "text-accent-600" : "text-primary-600"}`}
    />
    <div className="min-w-0 flex-1">
      <p className="text-xs text-neutral-500 font-semibold uppercase mb-1">
        {label}
      </p>
      <p className="font-semibold text-neutral-900 break-words">{value}</p>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, mono }) => (
  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
    <Icon className="w-5 h-5 text-neutral-400 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-neutral-500 font-medium mb-0.5">{label}</p>
      <p
        className={`font-semibold text-neutral-900 truncate ${mono ? "font-mono text-sm" : ""}`}
      >
        {value}
      </p>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, onClick, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    green: "bg-green-100 text-green-700 hover:bg-green-200",
    purple: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    orange: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${colors[color]}`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

const StatBadge = ({ label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-900 border-blue-200",
    green: "bg-green-50 text-green-900 border-green-200",
    purple: "bg-purple-50 text-purple-900 border-purple-200",
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border-2 ${colors[color]}`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
};

export default EspaceDetails;
