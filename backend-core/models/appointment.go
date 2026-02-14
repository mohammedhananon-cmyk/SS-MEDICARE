package models

import "gorm.io/gorm"

type Appointment struct {
	gorm.Model
	UserID     uint   `json:"userId"`
	Date       string `json:"date"`
	Time       string `json:"time"`
	DoctorID   string `json:"doctorId"`
	Doctor     string `json:"doctorName"`
	Specialty  string `json:"specialty"`
	HospitalID string `json:"hospitalId"`
	Facility   string `json:"facility"`
	Status     string `json:"status"`
}
