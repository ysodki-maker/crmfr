/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X, Loader2, Plus, Trash2 } from "lucide-react";
import { espaceService, authService } from "../../services/api";
import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

const EspaceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [espace, setEspace] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    espace_name: "",
  });

  // Nouvel état pour le nom de l'enfant
  const [nomEnfant, setNomEnfant] = useState("");

  const [rideauxDetails, setRideauxDetails] = useState([]);
  const [wallpapersDetails, setWallpapersDetails] = useState([]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Charger l'utilisateur actuel
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    fetchEspace();
  }, [id]);

  const fetchEspace = async () => {
    try {
      setLoading(true);
      const response = await espaceService.getById(id);

      if (response.success && response.data) {
        const data = response.data;
        setEspace(data);

        // Extraire le nom de l'enfant si c'est "Chambre Enfant"
        let espaceName = data.espace_name || "";
        let extractedNomEnfant = "";

        if (espaceName.startsWith("Chambre Enfant")) {
          // Extraire le nom après "Chambre Enfant "
          extractedNomEnfant = espaceName.replace("Chambre Enfant", "").trim();
          espaceName = "Chambre Enfant";
        }

        setFormData({
          espace_name: espaceName,
        });

        setNomEnfant(extractedNomEnfant);

        // Charger les détails rideaux
        if (data.type_projet === "RIDEAU") {
          if (data.rideaux && data.rideaux.length > 0) {
            setRideauxDetails(
              data.rideaux.map((rideau) => ({
                ...rideau,
                id: rideau.id || Date.now() + Math.random(),
                largeur: rideau.largeur ? String(rideau.largeur) : "",
                hauteur: rideau.hauteur ? String(rideau.hauteur) : "",
                ampleur: rideau.ampleur ? String(rideau.ampleur) : "",
                ourlet: rideau.ourlet ? String(rideau.ourlet) : "",
              })),
            );
          } else {
            // Au moins un rideau vide si aucun existant
            setRideauxDetails([
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
          }
        }

        // Charger les détails wallpapers
        if (data.type_projet === "WALLPAPER") {
          if (data.wallpapers && data.wallpapers.length > 0) {
            setWallpapersDetails(
              data.wallpapers.map((wallpaper) => ({
                ...wallpaper,
                id: wallpaper.id || Date.now() + Math.random(),
                largeur: wallpaper.largeur ? String(wallpaper.largeur) : "",
                hauteur: wallpaper.hauteur ? String(wallpaper.hauteur) : "",
              })),
            );
          } else {
            setWallpapersDetails([
              {
                id: Date.now(),
                largeur: "",
                hauteur: "",
                type_produit: "",
                etat_mur: "",
              },
            ]);
          }
        }
      }
    } catch (err) {
      setError("Erreur lors du chargement de l'espace");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Réinitialiser le nom de l'enfant si on change de type d'espace
    if (name === "espace_name" && value !== "Chambre Enfant") {
      setNomEnfant("");
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRideauChange = (index, e) => {
    const { name, value } = e.target;
    const newRideaux = [...rideauxDetails];
    newRideaux[index][name] = value;
    setRideauxDetails(newRideaux);
  };

  const addRideau = () => {
    const isSomfyUser =
      currentUser?.role === "SOMFY" || currentUser?.data?.role === "SOMFY";

    setRideauxDetails([
      ...rideauxDetails,
      {
        id: Date.now(),
        largeur: "",
        hauteur: "",
        type_tringles: isSomfyUser ? "Tringle Somfy" : "", // Pré-remplir pour SOMFY
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

    // Validation du nom de l'enfant si "Chambre Enfant" est sélectionné
    if (formData.espace_name === "Chambre Enfant" && !nomEnfant.trim()) {
      newErrors.nomEnfant = "Le nom de l'enfant est requis";
    }

    // Validation pour les rideaux - au moins un rideau doit avoir largeur et hauteur
    if (espace?.type_projet === "RIDEAU") {
      const hasValidRideau = rideauxDetails.some(
        (rideau) => rideau.largeur && rideau.hauteur,
      );
      if (!hasValidRideau) {
        newErrors.rideaux =
          "Au moins un rideau doit avoir une largeur et une hauteur";
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

    setSaving(true);

    try {
      // Construire le nom complet de l'espace
      let finalEspaceName = formData.espace_name;
      if (formData.espace_name === "Chambre Enfant" && nomEnfant.trim()) {
        finalEspaceName = `Chambre Enfant ${nomEnfant.trim()}`;
      }

      const espaceData = {
        ...formData,
        espace_name: finalEspaceName, // Utiliser le nom combiné
        details: null,
      };

      if (espace.type_projet === "RIDEAU") {
        const filteredRideaux = rideauxDetails.filter((rideau) => {
          return Object.entries(rideau).some(
            ([key, value]) => key !== "id" && value !== "" && value !== null,
          );
        });

        espaceData.details = {
          rideaux: filteredRideaux.map(({ id, ...rideau }) => rideau),
        };
      } else if (espace.type_projet === "WALLPAPER") {
        const filteredWallpapers = wallpapersDetails.filter((wallpaper) => {
          return Object.entries(wallpaper).some(
            ([key, value]) => key !== "id" && value !== "" && value !== null,
          );
        });

        espaceData.details = {
          wallpapers: filteredWallpapers.map(
            ({ id, ...wallpaper }) => wallpaper,
          ),
        };
      }

      const response = await espaceService.update(id, espaceData);

      if (response.success) {
        navigate(`/espaces/${espace.id}`);
      } else {
        setError(
          response.message || "Erreur lors de la mise à jour de l'espace",
        );
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour de l'espace");
      console.error("Erreur:", err);
    } finally {
      setSaving(false);
    }
  };

  // Vérifier si l'utilisateur est SOMFY
  const isSomfyUser =
    currentUser?.role === "SOMFY" || currentUser?.data?.role === "SOMFY";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!espace) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Espace introuvable
          </h2>
          <Button onClick={() => navigate(-1)}>Retour</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Modifier l'Espace"
          subtitle={
            formData.espace_name === "Chambre Enfant" && nomEnfant
              ? `Chambre Enfant ${nomEnfant}`
              : formData.espace_name
          }
        />

        <div className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="p-8 max-w-5xl mx-auto">
            <button
              onClick={() => navigate(`/projets/${espace.projet_id}/espaces`)}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour aux espaces</span>
            </button>

            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-xl font-semibold">
                <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                Type de projet:{" "}
                {espace.type_projet === "WALLPAPER" ? "Papier Peint" : "Rideau"}
              </span>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3">
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

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <Card title="Informations de l'espace">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Nom de l'espace
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        name="espace_name"
                        value={formData.espace_name}
                        onChange={handleChange}
                        className={`
                          w-full px-4 py-2.5 rounded-xl border-2 
                          bg-white text-neutral-900
                          transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                          ${
                            errors.espace_name
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-neutral-200 hover:border-neutral-300"
                          }
                        `}
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
                      {errors.espace_name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.espace_name}
                        </p>
                      )}
                    </div>

                    {/* Champ conditionnel pour le nom de l'enfant */}
                    {formData.espace_name === "Chambre Enfant" && (
                      <div className="animate-slide-down">
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Nom de l'enfant
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={nomEnfant}
                          onChange={(e) => {
                            setNomEnfant(e.target.value);
                            // Effacer l'erreur quand l'utilisateur tape
                            if (errors.nomEnfant) {
                              setErrors((prev) => ({
                                ...prev,
                                nomEnfant: "",
                              }));
                            }
                          }}
                          className={`
                            w-full px-4 py-2.5 rounded-xl border-2 
                            bg-white text-neutral-900
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                            ${
                              errors.nomEnfant
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-neutral-200 hover:border-neutral-300"
                            }
                          `}
                          placeholder="Ex: Yahya"
                        />
                        {errors.nomEnfant && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {errors.nomEnfant}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-neutral-500 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          L'espace sera enregistré comme:{" "}
                          <strong>Chambre Enfant {nomEnfant || "..."}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Détails RIDEAU multiples avec largeur/hauteur */}
                {espace?.type_projet === "RIDEAU" && (
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
                              Largeur (cm)
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
                              Hauteur (cm)
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
                            {isSomfyUser ? (
                              // Si utilisateur SOMFY, afficher uniquement les options SOMFY
                              <select
                                name="type_tringles"
                                value={rideau.type_tringles}
                                onChange={(e) => handleRideauChange(index, e)}
                                className="input"
                              >
                                <option value="">Sélectionner...</option>
                                <option value="Tringle Somfy Manuelle">
                                  Tringle Somfy Manuelle
                                </option>
                                <option value="Tringle Somfy Motorisé">
                                  Tringle Somfy Motorisé
                                </option>
                              </select>
                            ) : (
                              // Sinon, afficher la liste complète
                              <select
                                name="type_tringles"
                                value={rideau.type_tringles}
                                onChange={(e) => handleRideauChange(index, e)}
                                className="input"
                              >
                                <option value="">Sélectionner...</option>
                                <option value="Tringle Magicwalls Manuelle">
                                  Tringle Magicwalls Manuelle
                                </option>
                                <option value="Tringle Magicwalls Motorisé">
                                  Tringle Magicwalls Motorisé
                                </option>
                                <option value="Tringle Somfy Manuelle">
                                  Tringle Somfy Manuelle
                                </option>
                                <option value="Tringle Somfy Motorisé">
                                  Tringle Somfy Motorisé
                                </option>
                                <option value="Tringle Store bateau">
                                  Tringle Store bateau
                                </option>
                              </select>
                            )}
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
                            <input
                              type="text"
                              name="ref_tissu"
                              value={rideau.ref_tissu}
                              onChange={(e) => handleRideauChange(index, e)}
                              className="input"
                              placeholder="Référence Tissu"
                            />
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
                {espace?.type_projet === "WALLPAPER" && (
                  <div className="space-y-4">
                    {wallpapersDetails.map((wallpaper, index) => (
                      <Card
                        key={wallpaper.id}
                        title={`Mur ${index + 1}`}
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
                              Largeur (cm)
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

                <div className="flex items-center justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      navigate(`/projets/${espace.projet_id}/espaces`)
                    }
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={saving}
                    icon={<Save className="w-5 h-5" />}
                  >
                    Enregistrer les modifications
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

export default EspaceEdit;
