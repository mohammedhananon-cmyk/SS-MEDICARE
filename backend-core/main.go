package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"backend-core/handlers"
	"backend-core/database"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	database.Connect()

	mux := http.NewServeMux()
	
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Welcome to the National EHR Core Service (Go) - API Ready")
	})

	mux.HandleFunc("/api/signup", handlers.RegisterHandler)
	mux.HandleFunc("/api/login", handlers.LoginHandler)

	mux.HandleFunc("/api/appointments", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			handlers.GetAppointments(w, r)
		} else if r.Method == "POST" {
			handlers.CreateAppointment(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/profile", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			handlers.GetProfile(w, r)
		} else if r.Method == "PUT" || r.Method == "POST" { 
			handlers.UpdateProfile(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/records", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			handlers.GetHealthRecords(w, r)
		} else if r.Method == "POST" {
			handlers.AddHealthRecord(w, r) // For testing population
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/records/detail", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			handlers.GetHealthRecordByID(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/search", handlers.GlobalSearch)
	mux.HandleFunc("/api/doctors", handlers.GetDoctors)
	mux.HandleFunc("/api/hospitals", handlers.GetHospitals)

	// AI Features
	mux.HandleFunc("/api/analyze-lab-result", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			handlers.AnalyzeLabResult(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/scan-prescription", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			handlers.ScanPrescription(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/scan-lab-report", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			handlers.ScanLabReport(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Uploads
	os.MkdirAll("uploads", os.ModePerm)
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))
	mux.HandleFunc("/api/profile/upload", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			handlers.UploadProfilePhoto(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	log.Println("Starting Core Backend on :8080...")
	// Apply CORS middleware to the entire mux
	if err := http.ListenAndServe(":8080", handlers.EnableCORS(mux)); err != nil {
		log.Fatal(err)
	}
}
