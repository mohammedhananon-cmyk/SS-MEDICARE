package models

import "gorm.io/gorm"

type AuthUser struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex" json:"email"`
	Mobile   string `gorm:"uniqueIndex" json:"mobile"` // Added for OTP
	Password string `json:"-"`
	Role     string `json:"role"` // 'patient', 'doctor', 'admin'
}
