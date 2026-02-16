import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Enregistrer les polices (optionnel mais recommandé)
// Vous pouvez télécharger IBM Plex et les ajouter au projet
// Pour l'instant, on utilise les polices par défaut

// Styles du PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  
  // Header
  header: {
    marginBottom: 30,
    borderBottom: 4,
    borderBottomColor: "#000",
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  badge: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "4 10",
    fontSize: 7,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1,
  },
  reference: {
    fontSize: 14,
    color: "#666",
  },
  referenceNumber: {
    fontWeight: "bold",
    color: "#000",
  },
  dateBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    border: 2,
    borderColor: "#000",
  },
  dateLabel: {
    fontSize: 7,
    color: "#666",
    marginBottom: 5,
    letterSpacing: 1,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeValue: {
    fontSize: 10,
    color: "#666",
    marginTop: 3,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  statBox: {
    flex: 1,
    border: 2,
    borderColor: "#000",
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
  statLabel: {
    fontSize: 7,
    color: "#666",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },

  // Info Projet
  projetSection: {
    border: 2,
    borderColor: "#000",
    marginBottom: 25,
  },
  sectionHeader: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "3 10",
    fontSize: 7,
    letterSpacing: 1,
  },
  infoTable: {
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  infoLabel: {
    width: "33%",
    fontSize: 8,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f5f5f5",
    padding: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoValue: {
    flex: 1,
    fontSize: 10,
    padding: 8,
    color: "#000",
  },
  infoValueLarge: {
    fontSize: 12,
    fontWeight: "bold",
  },

  // Liste espaces
  espacesListSection: {
    marginBottom: 25,
  },
  espacesListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  espacesListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  espacesListCount: {
    fontSize: 8,
    color: "#666",
  },
  espacesListCountNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  espacesTable: {
    border: 2,
    borderColor: "#000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000",
    color: "#fff",
    padding: 10,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#ddd",
    padding: 10,
  },
  tableCell: {
    fontSize: 9,
  },
  tableCellBold: {
    fontWeight: "bold",
  },

  // Détails espace
  espaceDetail: {
    border: 2,
    borderColor: "#000",
    marginBottom: 25,
    breakInside: "avoid",
  },
  espaceHeader: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  espaceNumber: {
    fontSize: 36,
    fontWeight: "bold",
    opacity: 0.5,
    marginRight: 15,
  },
  espaceName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  espaceReference: {
    fontSize: 9,
    color: "#ccc",
  },

  // Dimensions
  dimensionsSection: {
    backgroundColor: "#e0e7ff",
    padding: 12,
    borderBottom: 2,
    borderBottomColor: "#818cf8",
  },
  dimensionsGrid: {
    flexDirection: "row",
    gap: 15,
  },
  dimensionBox: {
    flex: 1,
    alignItems: "center",
  },
  dimensionLabel: {
    fontSize: 7,
    color: "#4338ca",
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dimensionValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dimensionUnit: {
    fontSize: 9,
    marginLeft: 2,
  },

  // Détails rideaux/wallpapers
  detailsSection: {
    padding: 15,
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  detailsCount: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "5 12",
    fontSize: 9,
    fontWeight: "bold",
  },
  detailCard: {
    border: 2,
    borderColor: "#000",
    marginBottom: 15,
    breakInside: "avoid",
  },
  detailCardHeader: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailCardNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  detailCardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  detailTable: {
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#e5e5e5",
  },
  detailLabel: {
    width: "33%",
    fontSize: 7,
    fontWeight: "bold",
    color: "#555",
    backgroundColor: "#f5f5f5",
    padding: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  detailValue: {
    flex: 1,
    fontSize: 9,
    padding: 8,
    fontWeight: "bold",
  },
  remarqueRow: {
    backgroundColor: "#fef3c7",
    borderTop: 2,
    borderTopColor: "#fbbf24",
    padding: 10,
  },
  remarqueLabel: {
    fontSize: 7,
    fontWeight: "bold",
    marginBottom: 5,
  },
  remarqueValue: {
    fontSize: 9,
    fontStyle: "italic",
    fontWeight: "bold",
  },

  // Footer
  footer: {
    borderTop: 2,
    borderTopColor: "#000",
    paddingTop: 15,
    marginTop: 30,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  footerLabel: {
    fontSize: 7,
    color: "#666",
    marginBottom: 5,
    letterSpacing: 1,
  },
  footerValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  signatureLine: {
    borderBottom: 2,
    borderBottomColor: "#ccc",
    width: 150,
    height: 40,
  },
  footerCenter: {
    textAlign: "center",
    fontSize: 7,
    color: "#666",
  },
});

const MesuresPDF = ({ projet, espaces, showEmptyFields, totalDetails }) => {
  const formatDate = () => {
    return new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const padNumber = (num, length) => {
    return String(num).padStart(length, "0");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <View style={styles.badge}>
                <Text>DOCUMENT TECHNIQUE</Text>
              </View>
              <Text style={styles.mainTitle}>FICHE DE MESURES</Text>
              <Text style={styles.reference}>
                Référence{" "}
                <Text style={styles.referenceNumber}>
                  #{padNumber(projet.id, 6)}
                </Text>
              </Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>DATE D'ÉDITION</Text>
              <Text style={styles.dateValue}>{formatDate()}</Text>
              <Text style={styles.timeValue}>{formatTime()}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Nombre d'espaces</Text>
            <Text style={styles.statValue}>{espaces.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Nombre de détails</Text>
            <Text style={styles.statValue}>{totalDetails}</Text>
          </View>
        </View>

        {/* Info Projet */}
        <View style={styles.projetSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>INFORMATIONS DU PROJET</Text>
            <Text style={styles.typeBadge}>
              {projet.type_projet === "WALLPAPER" ? "PAPIER PEINT" : "RIDEAUX"}
            </Text>
          </View>
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom du projet</Text>
              <Text style={[styles.infoValue, styles.infoValueLarge]}>
                {projet.projet_name}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Client</Text>
              <Text style={styles.infoValue}>{projet.client_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ville</Text>
              <Text style={styles.infoValue}>{projet.ville}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Responsable</Text>
              <Text style={styles.infoValue}>{projet.responsable}</Text>
            </View>
          </View>
        </View>

        {/* Liste des espaces */}
        <View style={styles.espacesListSection}>
          <View style={styles.espacesListHeader}>
            <Text style={styles.espacesListTitle}>LISTE DES ESPACES</Text>
            <Text style={styles.espacesListCount}>
              Total:
              <Text style={styles.espacesListCountNumber}>{espaces.length}</Text>
            </Text>
          </View>

          <View style={styles.espacesTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "10%" }]}>N°</Text>
              <Text style={[styles.tableHeaderCell, { width: "60%" }]}>
                NOM DE L'ESPACE
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "30%", textAlign: "center" }]}>
                DÉTAILS
              </Text>
            </View>

            {espaces.map((espace, index) => {
              const detailsCount =
                (espace.rideaux?.length || 0) + (espace.wallpapers?.length || 0);
              return (
                <View key={espace.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellBold, { width: "10%" }]}>
                    {padNumber(index + 1, 2)}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellBold, { width: "60%" }]}>
                    {espace.espace_name}
                  </Text>
                  <Text style={[styles.tableCell, { width: "30%", textAlign: "center" }]}>
                    {detailsCount}{" "}
                    {projet.type_projet === "RIDEAU" ? "rideau(x)" : "papier(s)"}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>

      {/* Pages détails des espaces */}
      {espaces.map((espace, index) => (
        <Page key={espace.id} size="A4" style={styles.page}>
          {/* En-tête espace */}
          <View style={styles.espaceDetail}>
            <View style={styles.espaceHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.espaceNumber}>{padNumber(index + 1, 2)}</Text>
                <View style={{ borderLeft: 2, borderLeftColor: "rgba(255,255,255,0.3)", paddingLeft: 15 }}>
                  <Text style={styles.espaceName}>{espace.espace_name}</Text>
                  <Text style={styles.espaceReference}>
                    Référence: ESP-{padNumber(espace.id, 4)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Détails RIDEAU */}
            {projet.type_projet === "RIDEAU" &&
              espace.rideaux &&
              espace.rideaux.length > 0 && (
                <View style={styles.detailsSection}>
                  <View style={styles.detailsHeader}>
                    <Text style={styles.detailsTitle}>DÉTAILS DES RIDEAUX</Text>
                    <Text style={styles.detailsCount}>{espace.rideaux.length}</Text>
                  </View>

                  {espace.rideaux.map((rideau, rIndex) => (
                    <View key={rIndex} style={styles.detailCard}>
                      <View style={styles.detailCardHeader}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={styles.detailCardNumber}>
                            {padNumber(rIndex + 1, 2)}
                          </Text>
                          <Text style={styles.detailCardTitle}>
                            RIDEAU {rIndex + 1}
                          </Text>
                        </View>
                        <Text>✓</Text>
                      </View>

                      {/* Dimensions */}
                      {(rideau.largeur || rideau.hauteur) && (
                        <View style={styles.dimensionsSection}>
                          <View style={styles.dimensionsGrid}>
                            {rideau.largeur && (
                              <View style={styles.dimensionBox}>
                                <Text style={styles.dimensionLabel}>Largeur</Text>
                                <Text style={styles.dimensionValue}>
                                  {rideau.largeur}
                                  <Text style={styles.dimensionUnit}>m</Text>
                                </Text>
                              </View>
                            )}
                            {rideau.hauteur && (
                              <View style={styles.dimensionBox}>
                                <Text style={styles.dimensionLabel}>Hauteur</Text>
                                <Text style={styles.dimensionValue}>
                                  {rideau.hauteur}
                                  <Text style={styles.dimensionUnit}>m</Text>
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      )}

                      {/* Table des détails */}
                      <View style={styles.detailTable}>
                        {(rideau.type_tringles || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Type de tringles</Text>
                            <Text style={styles.detailValue}>
                              {rideau.type_tringles || "—"}
                            </Text>
                          </View>
                        )}
                        {(rideau.type_rideau || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Type de rideau</Text>
                            <Text style={styles.detailValue}>
                              {rideau.type_rideau || "—"}
                            </Text>
                          </View>
                        )}
                        {(rideau.type_ouverture || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Type d'ouverture</Text>
                            <Text style={styles.detailValue}>
                              {rideau.type_ouverture || "—"}
                            </Text>
                          </View>
                        )}
                        {(rideau.type_confection || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Type de confection</Text>
                            <Text style={styles.detailValue}>
                              {rideau.type_confection || "—"}
                            </Text>
                          </View>
                        )}
                        {(rideau.ampleur || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Ampleur</Text>
                            <Text style={styles.detailValue}>
                              {rideau.ampleur ? `× ${rideau.ampleur}` : "—"}
                            </Text>
                          </View>
                        )}
                        {(rideau.finition_au_sol || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Finition au sol</Text>
                            <Text style={styles.detailValue}>
                              {rideau.finition_au_sol || "—"}
                            </Text>
                          </View>
                        )}
                        {(rideau.ref_tissu || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Référence tissu</Text>
                            <Text style={styles.detailValue}>
                              {rideau.ref_tissu || "—"}
                            </Text>
                          </View>
                        )}
                        {(rideau.ourlet || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Ourlet</Text>
                            <Text style={styles.detailValue}>
                              {rideau.ourlet || "—"}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Remarque */}
                      {rideau.remarque_client && (
                        <View style={styles.remarqueRow}>
                          <Text style={styles.remarqueLabel}>⚠ REMARQUE CLIENT</Text>
                          <Text style={styles.remarqueValue}>
                            {rideau.remarque_client}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

            {/* Détails WALLPAPER */}
            {projet.type_projet === "WALLPAPER" &&
              espace.wallpapers &&
              espace.wallpapers.length > 0 && (
                <View style={styles.detailsSection}>
                  <View style={styles.detailsHeader}>
                    <Text style={styles.detailsTitle}>DÉTAILS DES PAPIERS PEINTS</Text>
                    <Text style={styles.detailsCount}>{espace.wallpapers.length}</Text>
                  </View>

                  {espace.wallpapers.map((wallpaper, wIndex) => (
                    <View key={wIndex} style={styles.detailCard}>
                      <View style={styles.detailCardHeader}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={styles.detailCardNumber}>
                            {padNumber(wIndex + 1, 2)}
                          </Text>
                          <Text style={styles.detailCardTitle}>
                            PAPIER PEINT {wIndex + 1}
                          </Text>
                        </View>
                        <Text>✓</Text>
                      </View>

                      {/* Dimensions */}
                      {(wallpaper.largeur || wallpaper.hauteur) && (
                        <View style={[styles.dimensionsSection, { backgroundColor: "#e0f2fe" }]}>
                          <View style={styles.dimensionsGrid}>
                            {wallpaper.largeur && (
                              <View style={styles.dimensionBox}>
                                <Text style={[styles.dimensionLabel, { color: "#0369a1" }]}>
                                  Largeur
                                </Text>
                                <Text style={styles.dimensionValue}>
                                  {wallpaper.largeur}
                                  <Text style={styles.dimensionUnit}>m</Text>
                                </Text>
                              </View>
                            )}
                            {wallpaper.hauteur && (
                              <View style={styles.dimensionBox}>
                                <Text style={[styles.dimensionLabel, { color: "#0369a1" }]}>
                                  Hauteur
                                </Text>
                                <Text style={styles.dimensionValue}>
                                  {wallpaper.hauteur}
                                  <Text style={styles.dimensionUnit}>m</Text>
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      )}

                      <View style={styles.detailTable}>
                        {(wallpaper.type_prise || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Type de prise</Text>
                            <Text style={styles.detailValue}>
                              {wallpaper.type_prise || "—"}
                            </Text>
                          </View>
                        )}
                        {(wallpaper.type_produit || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Type de produit</Text>
                            <Text style={styles.detailValue}>
                              {wallpaper.type_produit || "—"}
                            </Text>
                          </View>
                        )}
                        {(wallpaper.etat_mur || showEmptyFields) && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>État du mur</Text>
                            <Text style={styles.detailValue}>
                              {wallpaper.etat_mur || "—"}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
          </View>

          {/* Footer (sur la dernière page seulement) */}
          {index === espaces.length - 1 && (
            <View style={styles.footer}>
              <View style={styles.footerTop}>
                <View>
                  <Text style={styles.footerLabel}>DOCUMENT GÉNÉRÉ PAR</Text>
                  <Text style={styles.footerValue}>Système CRM - Mesures v2.0</Text>
                </View>
                <View>
                  <Text style={styles.footerLabel}>SIGNATURE</Text>
                  <View style={styles.signatureLine} />
                </View>
              </View>
              <Text style={styles.footerCenter}>
                {projet.projet_name} - Réf. #{padNumber(projet.id, 6)} - {formatDate()}
              </Text>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};

export default MesuresPDF;