/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";
import { projetService, espaceService } from "../../services/api";
import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

const EspaceCreate = () => {
  const { projetId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProjet, setLoadingProjet] = useState(true);
  const [error, setError] = useState("");
  const [projet, setProjet] = useState(null);

  const [formData, setFormData] = useState({
    projet_id: projetId,
    espace_name: "",
    details: null,
  });

  // État pour plusieurs détails Rideau avec largeur/hauteur
  const [rideauxDetails, setRideauxDetails] = useState([
    {
      id: Date.now(),
      largeur: "",
      hauteur: "",
      type_tringles: "",
      type_rideau: "",
      type_ouverture: "",
      type_confection: "",
      ampleur: "",
      finition_au_sol: "",
      ref_tissu: "",
      ourlet: "",
      remarque_client: "",
    },
  ]);

  // État pour plusieurs détails Wallpaper avec largeur/hauteur
  const [wallpapersDetails, setWallpapersDetails] = useState([
    {
      id: Date.now(),
      largeur: "",
      hauteur: "",
      type_produit: "",
      etat_mur: "",
    },
  ]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProjet();
  }, [projetId]);

  const fetchProjet = async () => {
    try {
      setLoadingProjet(true);
      const response = await projetService.getById(projetId);

      if (response.success && response.data) {
        setProjet(response.data);
      }
    } catch (err) {
      setError("Erreur lors du chargement du projet");
      console.error("Erreur:", err);
    } finally {
      setLoadingProjet(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Gestion des rideaux multiples
  const handleRideauChange = (index, e) => {
    const { name, value } = e.target;
    const newRideaux = [...rideauxDetails];
    newRideaux[index][name] = value;
    setRideauxDetails(newRideaux);
  };

  const addRideau = () => {
    setRideauxDetails([
      ...rideauxDetails,
      {
        id: Date.now(),
        largeur: "",
        hauteur: "",
        type_tringles: "",
        type_rideau: "",
        type_ouverture: "",
        type_confection: "",
        ampleur: "",
        finition_au_sol: "",
        ref_tissu: "",
        ourlet: "",
        remarque_client: "",
      },
    ]);
  };

  const removeRideau = (index) => {
    if (rideauxDetails.length > 1) {
      const newRideaux = rideauxDetails.filter((_, i) => i !== index);
      setRideauxDetails(newRideaux);
    }
  };

  // Gestion des wallpapers multiples
  const handleWallpaperChange = (index, e) => {
    const { name, value } = e.target;
    const newWallpapers = [...wallpapersDetails];
    newWallpapers[index][name] = value;
    setWallpapersDetails(newWallpapers);
  };

  const addWallpaper = () => {
    setWallpapersDetails([
      ...wallpapersDetails,
      {
        id: Date.now(),
        largeur: "",
        hauteur: "",
        type_produit: "",
        etat_mur: "",
      },
    ]);
  };

  const removeWallpaper = (index) => {
    if (wallpapersDetails.length > 1) {
      const newWallpapers = wallpapersDetails.filter((_, i) => i !== index);
      setWallpapersDetails(newWallpapers);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.espace_name.trim()) {
      newErrors.espace_name = "Le nom de l'espace est requis";
    }

    // Validation pour les rideaux - au moins un rideau doit avoir largeur et hauteur
    if (projet?.type_projet === "RIDEAU") {
      const hasValidRideau = rideauxDetails.some(
        (rideau) => rideau.largeur && rideau.hauteur
      );
      if (!hasValidRideau) {
        newErrors.rideaux = "Au moins un rideau doit avoir une largeur et une hauteur";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Préparer les données selon le type de projet
      const espaceData = {
        ...formData,
        details: null,
      };

      if (projet.type_projet === "RIDEAU") {
        // Filtrer les rideaux vides (tous les champs vides)
        const filteredRideaux = rideauxDetails.filter((rideau) => {
          return Object.values(rideau).some(
            (value) => value !== "" && value !== rideau.id,
          );
        });

        espaceData.details = {
          // eslint-disable-next-line no-unused-vars
          rideaux: filteredRideaux.map(({ id, ...rideau }) => rideau), // Enlever l'id temporaire
        };
      } else if (projet.type_projet === "WALLPAPER") {
        // Filtrer les wallpapers vides
        const filteredWallpapers = wallpapersDetails.filter((wallpaper) => {
          return Object.values(wallpaper).some(
            (value) => value !== "" && value !== wallpaper.id,
          );
        });

        espaceData.details = {
          // eslint-disable-next-line no-unused-vars
          wallpapers: filteredWallpapers.map(
            ({ id, ...wallpaper }) => wallpaper,
          ),
        };
      }

      const response = await espaceService.create(espaceData);

      if (response.success) {
        navigate(`/projets/${projetId}/espaces`);
      } else {
        setError(response.message || "Erreur lors de la création de l'espace");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la création de l'espace");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProjet) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Nouvel Espace"
          subtitle={`Ajouter un espace au projet: ${projet?.projet_name || ""}`}
        />

        <div className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="p-8 max-w-5xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(`/projets/${projetId}/espaces`)}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour au espaces</span>
            </button>

            {/* Type de projet badge */}
            {projet && (
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-xl font-semibold">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Type de projet: {projet.type_projet === "WALLPAPER" ? "Papier Peint" : "Rideau"}
                </span>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3 animate-slide-down">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{error}</span>
                <button onClick={() => setError("")} className="ml-auto">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Informations générales - SIMPLIFIED */}
                <Card title="Informations de l'espace">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Nom de l'espace
                      </label>
                      <select
                        name="espace_name"
                        value={formData.espace_name}
                        onChange={handleChange}
                        className="input"
                        required
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Chambre Enfant">Chambre Enfant</option>
                        <option value="Chambre Parent">Chambre Parent</option>
                        <option value="Chambre Invité">Chambre Invité</option>
                        <option value="Chambre 1">Chambre 1</option>
                        <option value="Chambre 2">Chambre 2</option>
                        <option value="Chambre 3">Chambre 3</option>
                        <option value="Chambre 4">Chambre 4</option>
                        <option value="Salon 1">Salon 1</option>
                        <option value="Salon 2">Salon 2</option>
                        <option value="Salon 3">Salon 3</option>
                        <option value="Salon 4">Salon 4</option>
                        <option value="Salon Marocain">Salon Marocain</option>
                        <option value="Cuisine">Cuisine</option>
                        <option value="Cave">Cave</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Détails RIDEAU multiples avec LARGEUR/HAUTEUR */}
                {projet?.type_projet === "RIDEAU" && (
                  <div className="space-y-4">
                    {rideauxDetails.map((rideau, index) => (
                      <Card
                        key={rideau.id}
                        title={`Rideau ${index + 1}`}
                        headerAction={
                          rideauxDetails.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRideau(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer ce rideau"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )
                        }
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* NOUVEAUX CHAMPS: Largeur et Hauteur */}
                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Largeur (m)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="largeur"
                              value={rideau.largeur}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                              placeholder="Ex: 2.5"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Hauteur (m)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="hauteur"
                              value={rideau.hauteur}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                              placeholder="Ex: 2.8"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Type de tringles
                            </label>
                            <select
                              name="type_tringles"
                              value={rideau.type_tringles}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="Tringle Magicwalls">
                                Tringle Magicwalls
                              </option>
                              <option value="Tringle Somfy">
                                Tringle Somfy
                              </option>
                              <option value="Tringle Store bateau">
                                Tringle Store bateau
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Type de rideau
                            </label>
                            <select
                              name="type_rideau"
                              value={rideau.type_rideau}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="Blackout">Blackout</option>
                              <option value="VOILAGE">Voilage</option>
                              <option value="Store Bateau">Store Bateau</option>
                              <option value="Enrouleur">Enrouleur</option>
                              <option value="Store Bateau et Voilage">
                                Store Bateau et Voilage
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Type d'ouverture
                            </label>
                            <select
                              name="type_ouverture"
                              value={rideau.type_ouverture}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="CENTRALE">Centrale</option>
                              <option value="LATERALE">Latérale</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Type de confection
                            </label>
                            <select
                              name="type_confection"
                              value={rideau.type_confection}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="Wave">Wave</option>
                              <option value="Pis plats">Plis plats</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Ampleur
                            </label>
                            <select
                              name="ampleur"
                              value={rideau.ampleur}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="2">2</option>
                              <option value="2.5">2.5</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Finition au sol
                            </label>
                            <select
                              name="finition_au_sol"
                              value={rideau.finition_au_sol}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="à fleur (0,5 cm)">
                                à fleur (0,5 cm)
                              </option>
                              <option value="cassant 1 cm">cassant 1 cm</option>
                              <option value="cassant 2 cm">cassant 2 cm</option>
                              <option value="cassant 3 cm">cassant 3 cm</option>
                              <option value="cassant 4 cm">cassant 4 cm</option>
                              <option value="cassant 5 cm">cassant 5 cm</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Référence tissu
                            </label>
                            <select
                              name="ref_tissu"
                              value={rideau.ref_tissu}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="Manuelle">Manuelle</option>
                              <option value="Motorisé">Motorisé</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Ourlet
                            </label>
                            <select
                              name="ourlet"
                              value={rideau.ourlet}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="5 cm">5 cm</option>
                              <option value="10 cm">10 cm</option>
                              <option value="15 cm">15 cm</option>
                              <option value="Bas plombé">Bas plombé</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Remarque client
                            </label>
                            <textarea
                              name="remarque_client"
                              value={rideau.remarque_client}
                              onChange={(e) => handleRideauChange(index, e)}
                              rows={3}
                              className="input resize-none"
                              placeholder="Remarques ou instructions spéciales..."
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* Bouton ajouter rideau */}
                    <button
                      type="button"
                      onClick={addRideau}
                      className="w-full p-4 border-2 border-dashed border-primary-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2 text-primary-700 font-semibold"
                    >
                      <Plus className="w-5 h-5" />
                      Ajouter un autre rideau
                    </button>
                  </div>
                )}

                {/* Détails WALLPAPER multiples */}
                {projet?.type_projet === "WALLPAPER" && (
                  <div className="space-y-4">
                    {wallpapersDetails.map((wallpaper, index) => (
                      <Card
                        key={wallpaper.id}
                        title={`Papier Peint ${index + 1}`}
                        headerAction={
                          wallpapersDetails.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeWallpaper(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer ce papier peint"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )
                        }
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* NOUVEAUX CHAMPS: Largeur et Hauteur */}
                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Largeur (m)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="largeur"
                              value={wallpaper.largeur}
                              onChange={(e) => handleWallpaperChange(index, e)}
                              className="input"
                              placeholder="Ex: 3.5"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Hauteur (m)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="hauteur"
                              value={wallpaper.hauteur}
                              onChange={(e) => handleWallpaperChange(index, e)}
                              className="input"
                              placeholder="Ex: 2.6"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Type de produit
                            </label>
                            <select
                              name="type_produit"
                              value={wallpaper.type_produit}
                              onChange={(e) => handleWallpaperChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="Papier peint petit rouleau">
                                Papier peint petit rouleau
                              </option>
                              <option value="Papier peint grand rouleau">
                                Papier peint grand rouleau
                              </option>
                              <option value="Papier peint uni">
                                Papier peint uni
                              </option>
                              <option value="Papier peint imprimer">
                                Papier peint imprimer
                              </option>
                              <option value="MGW Edition">MGW Édition</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              État du mur
                            </label>
                            <select
                              name="etat_mur"
                              value={wallpaper.etat_mur}
                              onChange={(e) => handleWallpaperChange(index, e)}
                              className="input"
                            >
                              <option value="">Sélectionner...</option>
                              <option value="Mur non posable">
                                Mur non posable
                              </option>
                              <option value="Mur posable">Mur posable</option>
                            </select>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* Bouton ajouter wallpaper */}
                    <button
                      type="button"
                      onClick={addWallpaper}
                      className="w-full p-4 border-2 border-dashed border-primary-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2 text-primary-700 font-semibold"
                    >
                      <Plus className="w-5 h-5" />
                      Ajouter un autre papier peint
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate(`/projets/${projetId}`)}
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon={<Save className="w-5 h-5" />}
                  >
                    Créer l'espace
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspaceCreate;