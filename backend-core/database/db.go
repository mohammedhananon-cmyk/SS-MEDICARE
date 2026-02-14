package database

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"backend-core/models"
)

var DB *gorm.DB

func Connect() {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	
	if dsn != "" {
		log.Println("Connecting to Postgres database...")
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	} else {
		log.Println("Connecting to SQLite database (Default)...")
		DB, err = gorm.Open(sqlite.Open("ss_medicare.db"), &gorm.Config{})
	}

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connection established")

	// Migration
	DB.AutoMigrate(&models.AuthUser{}, &models.Profile{}, &models.HealthRecord{}, &models.Appointment{}, &models.Hospital{}, &models.Doctor{})

	// Seed Global Data (Hospitals, Doctors) - Always needed
	SeedDoctorsAndHospitals(DB)

	// Seed User Data - Only if requested (e.g. for local dev or demo)
	if os.Getenv("SEED_USER_DATA") == "true" {
		var count int64
		DB.Model(&models.HealthRecord{}).Count(&count)
		if count == 0 {
			log.Println("Seeding Health Records...")
			records := []models.HealthRecord{
				{UserID: 1, Date: "2024-01-15", Type: "Vaccination", Doctor: "Dr. Smith", Facility: "City Hospital", Status: "Completed", Details: "COVID-19 Booster Dose"},
				{UserID: 1, Date: "2023-11-20", Type: "Annual Physical", Doctor: "Dr. Sarah", Facility: "SS Medicare Center", Status: "Completed", Details: "All vitals normal. Creating plan for diet."},
				{UserID: 1, Date: "2023-08-10", Type: "Dental Checkup", Doctor: "Dr. Lee", Facility: "Bright Smiles", Status: "Completed", Details: "Routine cleaning."},
			}
			DB.Create(&records)
		}
		
		DB.Model(&models.Profile{}).Count(&count)
		if count == 0 {
			log.Println("Seeding Profile...")
			profile := models.Profile{
				UserID: 1,
				Name: "John Doe",
				HealthID: "NHA-1982-392",
				DOB: "1982-01-12",
				Gender: "Male",
				BloodType: "O+",
				Phone: "+91 98765 43210", 
				Email: "john.doe@email.com",
				Address: "123, Green Park Ave",
				EmergencyName: "Jane Doe",
				EmergencyRelationship: "Spouse",
				EmergencyPhone: "+91 98765 09876",
			}
			DB.Create(&profile)
		}
	}
}
