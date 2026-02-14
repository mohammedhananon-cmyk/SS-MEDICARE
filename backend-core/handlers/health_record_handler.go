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
	var records []models.HealthRecord
	database.DB.Where("user_id = ?", 1).Find(&records) // Hardcode User 1
	json.NewEncoder(w).Encode(records)
}

// AddHealthRecord for testing populating data
func AddHealthRecord(w http.ResponseWriter, r *http.Request) {
	var record models.HealthRecord
	if err := json.NewDecoder(r.Body).Decode(&record); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	record.UserID = 1
	database.DB.Create(&record)
	json.NewEncoder(w).Encode(record)
}

// GetHealthRecordByID returns a single record
func GetHealthRecordByID(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	var record models.HealthRecord
	if result := database.DB.Where("id = ? AND user_id = ?", id, 1).First(&record); result.Error != nil {
		http.Error(w, "Record not found", http.StatusNotFound)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(record)
}
