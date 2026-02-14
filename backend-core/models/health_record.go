package models

import "gorm.io/gorm"

type HealthRecord struct {
	gorm.Model
	UserID    uint   `json:"userId"`
	Date      string `json:"date"`
	Type      string `json:"type"`
	Doctor    string `json:"doctor"`
	Facility  string `json:"facility"`
	Status    string `json:"status"`
	Details   string `json:"details"`
}
