import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  Building2,
  FileText,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { espaceService, projetService } from "../../services/api";
import Button from "../../components/common/Button";

const ProjetMesures = () => {
  const { projetId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const [projet, setProjet] = useState(null);
  const [espaces, setEspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEmptyFields, setShowEmptyFields] = useState(false);

  useEffect(() => {
    fetchData();
  }, [projetId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [projetResponse, espacesResponse] = await Promise.all([
        projetService.getById(projetId),
        espaceService.getByProjet(projetId),
      ]);

      if (projetResponse.success) {
        setProjet(projetResponse.data);
      }

      if (espacesResponse.success) {
        setEspaces(espacesResponse.data);
      }
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getTotalDetails = () => {
    return espaces.reduce((total, espace) => {
      const rideauxCount = espace.rideaux?.length || 0;
      const wallpapersCount = espace.wallpapers?.length || 0;
      return total + rideauxCount + wallpapersCount;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-900" />
          <p className="text-gray-600 font-medium">Chargement des mesures...</p>
        </div>
      </div>
    );
  }

  if (error || !projet) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Building2 className="w-16 h-16 text-gray-900 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Projet introuvable</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => navigate("/projets")}>Retour aux projets</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          .no-break {
            page-break-inside: avoid;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
        }
        
        .monospace {
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>

      {/* Actions Bar */}
      <div className="print:hidden bg-white border-b-2 border-gray-900 px-8 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/projets/${projetId}`)}
            className="group flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-all font-medium"
          >
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span>Retour au projet</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Toggle champs vides */}
            <button
              onClick={() => setShowEmptyFields(!showEmptyFields)}
              className={`flex items-center gap-2 px-4 py-2 border-2 transition-all font-medium ${
                showEmptyFields
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 hover:border-gray-900"
              }`}
            >
              {showEmptyFields ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              <span className="text-sm">
                {showEmptyFields ? "Masquer" : "Afficher"} champs vides
              </span>
            </button>

            {/* Bouton Télécharger */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-700 transition-all font-medium"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Télécharger PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu PDF à télécharger comme PDF */}
      <div ref={printRef} className="max-w-[1200px] mx-auto p-8 print:p-0 h-screen overflow-y-auto">
        {/* En-tête du document */}
        <div className="mb-12 no-break">
          <div className="border-b-4 border-gray-900 pb-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-block bg-gray-900 text-white px-4 py-1 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Document Technique
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight uppercase">
                  Fiche de Mesures
                </h1>
                <p className="text-xl text-gray-600 monospace flex items-center gap-2">
                  <span className="text-gray-400">Référence</span>
                  <span className="font-bold">#{String(projetId).padStart(6, "0")}</span>
                </p>
              </div>
              <div className="text-right bg-gray-50 p-6 border-2 border-gray-900">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  Date d'édition
                </p>
                <p className="text-2xl font-bold monospace text-gray-900">
                  {new Date().toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-500 monospace mt-1">
                  {new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques Rapides */}
          <div className="grid grid-cols-2 gap-4 mb-8 print:mb-6">
            <div className="border-2 border-gray-900 p-4 bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">
                Nombre d'espaces
              </p>
              <p className="text-3xl font-bold monospace text-gray-900">
                {espaces.length}
              </p>
            </div>
            <div className="border-2 border-gray-900 p-4 bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">
                Nombre de détails
              </p>
              <p className="text-3xl font-bold monospace text-gray-900">
                {getTotalDetails()}
              </p>
            </div>
          </div>

          {/* Informations du Projet */}
          <div className="border-2 border-gray-900 mb-8">
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-3">
                <FileText className="w-5 h-5" />
                Informations du Projet
              </h2>
              <span className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded">
                {projet.type_projet === "WALLPAPER" ? "Papier Peint" : "Rideaux"}
              </span>
            </div>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="px-6 py-4 font-bold text-gray-900 bg-gray-50 w-1/3 uppercase text-sm tracking-wider">
                    Nom du projet
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-semibold text-lg">
                    {projet.projet_name}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-6 py-4 font-bold text-gray-900 bg-gray-50 uppercase text-sm tracking-wider">
                    Client
                  </td>
                  <td className="px-6 py-4 text-gray-900">{projet.client_name}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-6 py-4 font-bold text-gray-900 bg-gray-50 uppercase text-sm tracking-wider">
                    Ville
                  </td>
                  <td className="px-6 py-4 text-gray-900">{projet.ville}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-6 py-4 font-bold text-gray-900 bg-gray-50 uppercase text-sm tracking-wider">
                    Responsable
                  </td>
                  <td className="px-6 py-4 text-gray-900">{projet.responsable}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tableau des Espaces - Updated to show details count */}
        <div className="mb-12 no-break">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-3">
              <div className="w-1 h-8 bg-gray-900"></div>
              Liste des Espaces
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 uppercase tracking-wide">Total:</span>
              <span className="font-bold monospace text-xl text-gray-900">
                {espaces.length}
              </span>
            </div>
          </div>

          {espaces.length === 0 ? (
            <div className="border-2 border-gray-300 p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-900 mb-2">Aucun espace</p>
              <p className="text-gray-500">Ce projet ne contient pas encore d'espaces</p>
            </div>
          ) : (
            <div className="border-2 border-gray-900">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-6 py-4 text-left font-bold uppercase text-xs tracking-widest">
                      N°
                    </th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-xs tracking-widest">
                      Nom de l'espace
                    </th>
                    <th className="px-6 py-4 text-center font-bold uppercase text-xs tracking-widest">
                      Détails
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {espaces.map((espace, index) => {
                    const detailsCount = (espace.rideaux?.length || 0) + (espace.wallpapers?.length || 0);
                    return (
                      <tr
                        key={espace.id}
                        className="border-b border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold monospace text-gray-900 text-lg">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {espace.espace_name}
                        </td>
                        <td className="px-6 py-4 text-center monospace font-semibold text-gray-900">
                          {detailsCount}
                          <span className="text-xs text-gray-500 ml-1">
                            {projet.type_projet === "RIDEAU" ? "rideau(x)" : "papier(s)"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Détails de chaque espace */}
        {espaces.map((espace, index) => (
          <div key={espace.id} className="mb-12 no-break page-break">
            <div className="border-2 border-gray-900">
              {/* En-tête espace */}
              <div className="bg-gray-900 text-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold monospace opacity-50">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="border-l-2 border-white/30 pl-4">
                      <h3 className="text-2xl font-bold mb-1">{espace.espace_name}</h3>
                      <p className="text-sm text-gray-300 monospace">
                        Référence: ESP-{String(espace.id).padStart(4, "0")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails RIDEAU avec dimensions */}
              {projet.type_projet === "RIDEAU" &&
                espace.rideaux &&
                espace.rideaux.length > 0 && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-gray-900 uppercase tracking-wide flex items-center gap-3">
                        <div className="w-1 h-6 bg-gray-900"></div>
                        Détails des Rideaux
                      </h4>
                      <span className="bg-gray-900 text-white px-3 py-1 monospace font-bold text-sm">
                        {espace.rideaux.length}
                      </span>
                    </div>

                    {espace.rideaux.map((rideau, rIndex) => (
                      <div key={rIndex} className="mb-6 border-2 border-gray-900">
                        <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
                          <h5 className="font-bold uppercase tracking-wide flex items-center gap-3">
                            <span className="text-2xl monospace">
                              {String(rIndex + 1).padStart(2, "0")}
                            </span>
                            <span>Rideau {rIndex + 1}</span>
                          </h5>
                          <Check className="w-5 h-5" />
                        </div>

                        {/* ✅ AJOUT: Section dimensions */}
                        {(rideau.largeur || rideau.hauteur) && (
                          <div className="bg-indigo-50 border-b-2 border-indigo-200">
                            <div className="grid grid-cols-2 gap-4 p-4">
                              {rideau.largeur && (
                                <div className="text-center">
                                  <p className="text-xs uppercase tracking-wide text-indigo-600 mb-1 font-bold">
                                    Largeur
                                  </p>
                                  <p className="text-2xl font-bold monospace text-gray-900">
                                    {rideau.largeur}
                                    <span className="text-sm ml-1">m</span>
                                  </p>
                                </div>
                              )}
                              {rideau.hauteur && (
                                <div className="text-center">
                                  <p className="text-xs uppercase tracking-wide text-indigo-600 mb-1 font-bold">
                                    Hauteur
                                  </p>
                                  <p className="text-2xl font-bold monospace text-gray-900">
                                    {rideau.hauteur}
                                    <span className="text-sm ml-1">m</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <table className="w-full">
                          <tbody>
                            {(rideau.type_tringles || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 w-1/3 uppercase text-xs tracking-wider">
                                  Type de tringles
                                </td>
                                <td className="px-6 py-3 font-semibold">
                                  {rideau.type_tringles || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {(rideau.type_rideau || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 uppercase text-xs tracking-wider">
                                  Type de rideau
                                </td>
                                <td className="px-6 py-3 font-semibold">
                                  {rideau.type_rideau || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {(rideau.type_ouverture || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 uppercase text-xs tracking-wider">
                                  Type d'ouverture
                                </td>
                                <td className="px-6 py-3 font-semibold">
                                  {rideau.type_ouverture || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {(rideau.type_confection || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 uppercase text-xs tracking-wider">
                                  Type de confection
                                </td>
                                <td className="px-6 py-3 font-semibold">
                                  {rideau.type_confection || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {(rideau.ampleur || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 uppercase text-xs tracking-wider">
                                  Ampleur
                                </td>
                                <td className="px-6 py-3 monospace font-bold">
                                  {rideau.ampleur ? (
                                    `× ${rideau.ampleur}`
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {(rideau.finition_au_sol || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 uppercase text-xs tracking-wider">
                                  Finition au sol
                                </td>
                                <td className="px-6 py-3 font-semibold">
                                  {rideau.finition_au_sol || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {(rideau.ref_tissu || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 uppercase text-xs tracking-wider">
                                  Référence tissu
                                </td>
                                <td className="px-6 py-3 monospace font-semibold">
                                  {rideau.ref_tissu || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {(rideau.ourlet || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 uppercase text-xs tracking-wider">
                                  Ourlet
                                </td>
                                <td className="px-6 py-3 monospace font-semibold">
                                  {rideau.ourlet || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {rideau.remarque_client && (
                              <tr className="bg-yellow-50 border-t-2 border-yellow-400">
                                <td className="px-6 py-4 font-bold text-gray-900 uppercase text-xs tracking-wider">
                                  ⚠ Remarque client
                                </td>
                                <td className="px-6 py-4 italic text-gray-900 font-medium">
                                  {rideau.remarque_client}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

              {/* Détails WALLPAPER avec dimensions */}
              {projet.type_projet === "WALLPAPER" &&
                espace.wallpapers &&
                espace.wallpapers.length > 0 && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-gray-900 uppercase tracking-wide flex items-center gap-3">
                        <div className="w-1 h-6 bg-gray-900"></div>
                        Détails des Papiers Peints
                      </h4>
                      <span className="bg-gray-900 text-white px-3 py-1 monospace font-bold text-sm">
                        {espace.wallpapers.length}
                      </span>
                    </div>

                    {espace.wallpapers.map((wallpaper, wIndex) => (
                      <div key={wIndex} className="mb-6 border-2 border-gray-900">
                        <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
                          <h5 className="font-bold uppercase tracking-wide flex items-center gap-3">
                            <span className="text-2xl monospace">
                              {String(wIndex + 1).padStart(2, "0")}
                            </span>
                            <span>Papier Peint {wIndex + 1}</span>
                          </h5>
                          <Check className="w-5 h-5" />
                        </div>

                        {/* ✅ AJOUT: Section dimensions pour wallpaper */}
                        {(wallpaper.largeur || wallpaper.hauteur) && (
                          <div className="bg-cyan-50 border-b-2 border-cyan-200">
                            <div className="grid grid-cols-2 gap-4 p-4">
                              {wallpaper.largeur && (
                                <div className="text-center">
                                  <p className="text-xs uppercase tracking-wide text-cyan-600 mb-1 font-bold">
                                    Largeur
                                  </p>
                                  <p className="text-2xl font-bold monospace text-gray-900">
                                    {wallpaper.largeur}
                                    <span className="text-sm ml-1">m</span>
                                  </p>
                                </div>
                              )}
                              {wallpaper.hauteur && (
                                <div className="text-center">
                                  <p className="text-xs uppercase tracking-wide text-cyan-600 mb-1 font-bold">
                                    Hauteur
                                  </p>
                                  <p className="text-2xl font-bold monospace text-gray-900">
                                    {wallpaper.hauteur}
                                    <span className="text-sm ml-1">m</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <table className="w-full">
                          <tbody>
                            {(wallpaper.type_prise || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 w-1/3 uppercase text-xs tracking-wider">
                                  Type de prise
                                </td>
                                <td className="px-6 py-3 font-semibold">
                                  {wallpaper.type_prise || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {(wallpaper.type_produit || showEmptyFields) && (
                              <tr className="border-b border-gray-200">
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 uppercase text-xs tracking-wider">
                                  Type de produit
                                </td>
                                <td className="px-6 py-3 font-semibold">
                                  {wallpaper.type_produit || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                            {(wallpaper.etat_mur || showEmptyFields) && (
                              <tr>
                                <td className="px-6 py-3 font-bold text-gray-700 bg-gray-50 uppercase text-xs tracking-wider">
                                  État du mur
                                </td>
                                <td className="px-6 py-3 font-semibold">
                                  {wallpaper.etat_mur || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}

        {/* Footer du document */}
        <div className="border-t-2 border-gray-900 pt-6 mt-12 no-break">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Document généré par
              </p>
              <p className="font-bold text-gray-900">Système CRM - Mesures v2.0</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Signature
              </p>
              <div className="border-b-2 border-gray-300 w-48 h-12"></div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 monospace">
              {projet.projet_name} - Réf. #{String(projetId).padStart(6, "0")} -{" "}
              {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjetMesures;