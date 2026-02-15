package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"backend-core/database"
	"backend-core/models"
	"strings"
	"github.com/golang-jwt/jwt/v5"
	"backend-core/auth"
)

// Helper to extract user ID from token
func getUserIDFromRequest(r *http.Request) (uint, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return 0, fmt.Errorf("authorization header missing")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return auth.SecretKey, nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// handle float64 typical for json numbers
		if userIdFloat, ok := claims["userId"].(float64); ok {
			return uint(userIdFloat), nil
		}
	}
	
	return 0, fmt.Errorf("invalid token claims")
}

// Enable CORS
func EnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization") // Added Authorization

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
	
	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
		return
	}

	var appointments []models.Appointment
	// Use dynamic user_id
	if result := database.DB.Where("user_id = ?", userID).Find(&appointments); result.Error != nil {
		http.Error(w, "Failed to fetch appointments", http.StatusInternalServerError)
		return
	}
	
	json.NewEncoder(w).Encode(appointments)
}

// CreateAppointment handles new bookings
func CreateAppointment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	userID, err := getUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var appt models.Appointment
	if err := json.NewDecoder(r.Body).Decode(&appt); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	appt.UserID = userID // Use authenticated user ID
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
