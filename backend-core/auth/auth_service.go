package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"backend-core/database"
	"backend-core/models"
)

var SecretKey = []byte("super_secret_key_ss_medicare")

// Signup creates a new user
func Signup(email, password, role string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := models.AuthUser{
		Email:    email,
		Password: string(hashedPassword),
		Role:     role, // 'patient'
	}

	result := database.DB.Create(&user)
	if result.Error != nil {
		return result.Error
	}
	
	// Create an empty profile for the new user
	profile := models.Profile{
		UserID: user.ID,
		Name: "New User",
		HealthID: fmt.Sprintf("NHA-%d-%04d", time.Now().Year(), user.ID+1000),
	}
	database.DB.Create(&profile)

	return nil
}

// Login validates user and returns token
func Login(email, password string) (string, error) {
	var user models.AuthUser
	result := database.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return "", result.Error
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID,
		"email":  user.Email,
		"role":   user.Role,
		"exp":    time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
