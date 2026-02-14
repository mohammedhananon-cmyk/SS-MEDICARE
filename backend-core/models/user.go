package models

import "gorm.io/gorm"

type AuthUser struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex" json:"email"`
	Password string `json:"-"`
	Role     string `json:"role"` // 'patient', 'doctor', 'admin'
}
