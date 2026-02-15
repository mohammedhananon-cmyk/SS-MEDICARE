package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"backend-core/models"
	"backend-core/database"
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

    // 10MB max
    r.ParseMultipartForm(10 << 20)

    file, handler, err := r.FormFile("photo")
    if err != nil {
        http.Error(w, "Error retrieving file", http.StatusBadRequest)
        return
    }
    defer file.Close()

    // Ensure uploads directory exists
    // In production, this should be an S3 bucket or similar
    // For specific OS/User path, we'll try to use a relative "uploads" folder
    // But since we are running go run main.go from backend-core, "uploads" will be in backend-core
    
    // Create unique filename
    filename := fmt.Sprintf("upload-%d-%d-%s", time.Now().Unix(), userID, handler.Filename)
    
    // Save file
    dst, err := os.Create("uploads/" + filename)
    if err != nil {
        http.Error(w, "Error saving file: " + err.Error(), http.StatusInternalServerError)
        return
    }
    defer dst.Close()

    if _, err := io.Copy(dst, file); err != nil {
        http.Error(w, "Error writing file", http.StatusInternalServerError)
        return
    }

    // Update Profile in DB
    var profile models.Profile
    if result := database.DB.First(&profile, "user_id = ?", userID); result.Error != nil {
        http.Error(w, "Profile not found", http.StatusNotFound)
        return
    }
    
    photoURL := fmt.Sprintf("/uploads/%s", filename)
    profile.PhotoURL = photoURL
    database.DB.Save(&profile)

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"photoUrl": photoURL})
}
