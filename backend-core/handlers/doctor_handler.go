package handlers

import (
	"backend-core/database"
	"backend-core/models"
	"encoding/json"
	"net/http"
	"strings"
)

func GetDoctors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var doctors []models.Doctor
	query := database.DB.Model(&models.Doctor{})

	// Search by Name or Specialty
	search := r.URL.Query().Get("search")
	if search != "" {
		search = strings.ToLower(search)
		query = query.Where("LOWER(name) LIKE ? OR LOWER(specialty) LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Filter by Location
	location := r.URL.Query().Get("location")
	if location != "" && location != "All" {
		query = query.Where("location = ?", location)
	}

	// Filter by Specialty
	specialty := r.URL.Query().Get("specialty")
	if specialty != "" && specialty != "All" {
		query = query.Where("specialty = ?", specialty)
	}

	query.Find(&doctors)
	json.NewEncoder(w).Encode(doctors)
}

func GetHospitals(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var hospitals []models.Hospital
	database.DB.Find(&hospitals)
	json.NewEncoder(w).Encode(hospitals)
}
