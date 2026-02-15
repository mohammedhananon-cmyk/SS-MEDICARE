package handlers

import (
	"encoding/json"
	"net/http"
	"backend-core/database"
	"backend-core/models"
)

// GetHealthRecords returns all health records
func GetHealthRecords(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var records []models.HealthRecord
	database.DB.Where("user_id = ?", userID).Find(&records)
	json.NewEncoder(w).Encode(records)
}

// AddHealthRecord for testing populating data
func AddHealthRecord(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var record models.HealthRecord
	if err := json.NewDecoder(r.Body).Decode(&record); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	record.UserID = userID
	database.DB.Create(&record)
	json.NewEncoder(w).Encode(record)
}

// GetHealthRecordByID returns a single record
func GetHealthRecordByID(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	var record models.HealthRecord
	if result := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&record); result.Error != nil {
		http.Error(w, "Record not found", http.StatusNotFound)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(record)
}
