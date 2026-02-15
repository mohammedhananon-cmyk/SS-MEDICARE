package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"backend-core/database"
	"backend-core/models"
)

type SearchResult struct {
	Category string `json:"category"`
	Title    string `json:"title"`
	Detail   string `json:"detail"`
	Link     string `json:"link"`
}

// GlobalSearch searches across all user data
func GlobalSearch(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}
	query = strings.ToLower(query)

	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var results []SearchResult

	// 0. Navigation Keywords (Static)
	if strings.Contains(strings.ToLower("profile"), query) || strings.Contains(query, "profile") {
		results = append(results, SearchResult{Category: "Navigation", Title: "Go to My Profile", Detail: "View your personal details", Link: "/profile"})
	}
	if strings.Contains(strings.ToLower("dashboard"), query) || strings.Contains(strings.ToLower("home"), query) {
		results = append(results, SearchResult{Category: "Navigation", Title: "Go to Dashboard", Detail: "Return to main overview", Link: "/"})
	}
	if strings.Contains(strings.ToLower("appointment"), query) {
		results = append(results, SearchResult{Category: "Navigation", Title: "Go to Appointments", Detail: "View all appointments", Link: "/appointments"})
	}

	// 1. Search Profile
	var profile models.Profile
	if err := database.DB.Where("user_id = ?", userID).First(&profile).Error; err == nil {
		if strings.Contains(strings.ToLower(profile.Name), query) {
			results = append(results, SearchResult{Category: "Profile", Title: "My Profile", Detail: "Name: " + profile.Name, Link: "/profile"})
		}
		if strings.Contains(strings.ToLower(profile.HealthID), query) {
			results = append(results, SearchResult{Category: "Profile", Title: "Health ID", Detail: "ID: " + profile.HealthID, Link: "/profile"})
		}
		if strings.Contains(strings.ToLower(profile.BloodType), query) {
			results = append(results, SearchResult{Category: "Profile", Title: "Blood Type", Detail: "Type: " + profile.BloodType, Link: "/profile"})
		}
		if strings.Contains(strings.ToLower(profile.Allergies), query) {
			results = append(results, SearchResult{Category: "Profile", Title: "Allergies", Detail: "Allergy matches: " + query, Link: "/profile"})
		}
	}

	// 2. Search Appointments
	var appointments []models.Appointment
	database.DB.Where("user_id = ?", userID).Find(&appointments)
	for _, apt := range appointments {
		if strings.Contains(strings.ToLower(apt.Doctor), query) || 
		   strings.Contains(strings.ToLower(apt.Specialty), query) ||
		   strings.Contains(strings.ToLower(apt.Facility), query) {
			results = append(results, SearchResult{
				Category: "Appointment", 
				Title: fmt.Sprintf("Appt with %s", apt.Doctor), 
				Detail: fmt.Sprintf("%s at %s", apt.Specialty, apt.Facility), 
				Link: "/appointments",
			})
		}
	}

	// 3. Search Health Records
	var records []models.HealthRecord
	database.DB.Where("user_id = ?", userID).Find(&records) 
	for _, rec := range records {
		if strings.Contains(strings.ToLower(rec.Type), query) || 
		   strings.Contains(strings.ToLower(rec.Details), query) ||
		   strings.Contains(strings.ToLower(rec.Doctor), query) {
			results = append(results, SearchResult{
				Category: "Record", 
				Title: rec.Type, 
				Detail: fmt.Sprintf("%s (%s)", rec.Details, rec.Date), 
				Link: "/results", 
			})
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
