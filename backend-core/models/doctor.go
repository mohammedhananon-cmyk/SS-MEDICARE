package models

import (
	"gorm.io/gorm"
)

type Doctor struct {
	gorm.Model
	Name         string   `json:"name"`
	Specialty    string   `json:"specialty"`
	Qualification string   `json:"qualification"`
	Experience   int      `json:"experience"` // Years of experience
	HospitalID   uint     `json:"hospitalId"` // Foreign key
	HospitalName string   `json:"hospitalName"`
	ConsultationFee float64 `json:"consultationFee"`
	Location     string   `json:"location"` // City/Town in Kerala
	AvailableDays string  `json:"availableDays"` // e.g., "Mon,Wed,Fri"
	Rating       float32  `json:"rating"`
	ImageURL     string   `json:"imageUrl"`
}

type Hospital struct {
	gorm.Model
	Name     string `json:"name"`
	Location string `json:"location"` // e.g., "Kochi", "Trivandrum"
	Type     string `json:"type"`     // "Hospital" or "Clinic"
	Rating   float32 `json:"rating"`
	Address  string `json:"address"`
	ContactNumber string `json:"contactNumber"`
}
