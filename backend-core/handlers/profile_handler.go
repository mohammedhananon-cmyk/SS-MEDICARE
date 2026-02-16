package handlers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"backend-core/database"
	"backend-core/models"
)

// GetProfile returns the user profile
func GetProfile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var profile models.Profile
	result := database.DB.First(&profile, "user_id = ?", userID)

	if result.Error != nil {
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(profile)
}

// UpdateProfile updates the user profile
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" && r.Method != "POST" { // Allow POST to fix CORS issue if needed, though PUT preferred
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var updatedData models.Profile
	if err := json.NewDecoder(r.Body).Decode(&updatedData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var profile models.Profile
	if result := database.DB.First(&profile, "user_id = ?", userID); result.Error != nil {
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	// Update fields
	database.DB.Model(&profile).Updates(updatedData)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

// UploadProfilePhoto handles photo uploads
func UploadProfilePhoto(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// 5MB max to prevent DB bloat
	r.ParseMultipartForm(5 << 20)

	file, _, err := r.FormFile("photo")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read all bytes
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}

	// Convert to Base64
	mimeType := http.DetectContentType(fileBytes)
	encodedString := base64.StdEncoding.EncodeToString(fileBytes)
	photoDataURI := fmt.Sprintf("data:%s;base64,%s", mimeType, encodedString)

	// Update Profile in DB
	var profile models.Profile
	if result := database.DB.First(&profile, "user_id = ?", userID); result.Error != nil {
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	// Determine strict storage - ensure it fits if not TEXT (but we made it TEXT)
	profile.PhotoURL = photoDataURI
	database.DB.Save(&profile)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"photoUrl": photoDataURI})
}
