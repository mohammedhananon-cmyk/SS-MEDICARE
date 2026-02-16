package models

import "gorm.io/gorm"

type Profile struct {
	gorm.Model
	UserID    uint   `json:"userId"` // Foreign Key to AuthUser
	Name      string `json:"name"`
	HealthID  string `json:"healthId" gorm:"unique"`
	DOB       string `json:"dob"`
	Gender    string `json:"gender"`
	BloodType string `json:"bloodType"`
	Phone     string `json:"phone"`
	Email     string `json:"email"`
	Address   string `json:"address"`
	AadharID  string `json:"aadharId"`
	Height    string `json:"height"` // In cm
	Weight    string `json:"weight"` // In kg
	Allergies string `json:"allergies"` // Comma separated for now
	Conditions string `json:"conditions"` // Chronic conditions
	PhotoURL   string `json:"photoUrl"`
	
	// Emergency Contact (Storing as flattened fields for simplicity in SQLite for now or JSON)
	EmergencyName         string `json:"emergencyName"`
	EmergencyRelationship string `json:"emergencyRelationship"`
	EmergencyPhone        string `json:"emergencyPhone"`

	IsProfileComplete bool `json:"isProfileComplete" gorm:"default:false"`
}
