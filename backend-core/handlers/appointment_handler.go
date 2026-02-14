package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"backend-core/database"
	"backend-core/models"
)

// Enable CORS
func EnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// GetAppointments returns all appointments
func GetAppointments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var appointments []models.Appointment
	// Hardcoding user_id = 1 for now
	database.DB.Where("user_id = ?", 1).Find(&appointments)
	json.NewEncoder(w).Encode(appointments)
}

// CreateAppointment handles new bookings
func CreateAppointment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var appt models.Appointment
	if err := json.NewDecoder(r.Body).Decode(&appt); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	appt.UserID = 1 // Hardcode for now
	appt.Status = "Upcoming"

	if result := database.DB.Create(&appt); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(appt)
	fmt.Printf("New Appointment Created: %+v\n", appt)
}
