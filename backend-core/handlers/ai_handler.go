package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

// Gemini Request Structures
type GeminiPart struct {
	Text       string `json:"text,omitempty"`
	InlineData *Blob  `json:"inline_data,omitempty"`
}

type Blob struct {
	MimeType string `json:"mime_type"`
	Data     string `json:"data"`
}

type GeminiContent struct {
	Parts []GeminiPart `json:"parts"`
}

type GeminiRequest struct {
	Contents []GeminiContent `json:"contents"`
}

type GeminiCandidate struct {
	Content GeminiContent `json:"content"`
}

type GeminiResponse struct {
	Candidates []GeminiCandidate `json:"candidates"`
}

// Internal API Structures
type LabAnalysisRequest struct {
	TestName string `json:"testName"`
	Status   string `json:"status"`
	Date     string `json:"date"`
}

type PrescriptionScanRequest struct {
	ImageBase64 string `json:"imageBase64"` // Expecting raw base64 string
}

// Safety Layer: Define strict system instructions in prompts
const SafetyPrompt = "IMPORTANT: You are an AI medical assistant. Your output is for informational purposes only. ALWAYS advise the user to consult a doctor. Be conservative. If the input is unclear or blurry, say 'Unclear'."

func AnalyzeLabResult(w http.ResponseWriter, r *http.Request) {
	var req LabAnalysisRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		// Mock Response for Demo/Fallback
		mockAnalysis := `{
			"interpretation": "⚠️ DEMO MODE: API Key missing. \n\nBased on the uploaded data, the values appear effectively normal. This is a simulated interpretation for demonstration purposes.",
			"lifestyle": "Maintain a balanced diet rich in vegetables and hydration.",
			"medications": "No medications currently suggested in this demo."
		}`
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"analysis": mockAnalysis})
		return
	}

	// Construct Prompt
	prompt := fmt.Sprintf("%s\n\nAnalyze this lab result: Test: %s, Status: %s, Date: %s.\nProvide:\n1. Interpretation (What does this mean?)\n2. Lifestyle Tips (Diet/Exercise)\n3. Suggested Medications (Generic names, if applicable. Mark as 'Consult Doctor')\nOutput as JSON with keys: interpretation, lifestyle, medications.", SafetyPrompt, req.TestName, req.Status, req.Date)

	response, err := callGemini(apiKey, prompt, nil)
	if err != nil {
		http.Error(w, "Failed to call AI: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"analysis": response})
}

func ScanPrescription(w http.ResponseWriter, r *http.Request) {
	var req PrescriptionScanRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		// Mock Response for Demo/Fallback
		// Returns a JSON list as string, which frontend parses
		mockAnalysis := `[
			{"name": "Paracetamol (Demo)", "dosage": "500mg", "qty": "10", "price": "₹20"},
			{"name": "Amoxicillin (Demo)", "dosage": "250mg", "qty": "15", "price": "₹85"},
			{"name": "Vitamin C (Demo)", "dosage": "500mg", "qty": "30", "price": "₹120"}
		]`
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"analysis": mockAnalysis})
		return
	}

	if req.ImageBase64 == "" {
		http.Error(w, "Image is required", http.StatusBadRequest)
		return
	}

	// Construct Prompt for Vision
	prompt := fmt.Sprintf("%s\n\nIdentify all medicines in this prescription image. Return a JSON list with: name, dosage, qty, price (estimate in INR). If handwriting is illegible, return empty list. MARK this result as 'PENDING_VERIFICATION'.", SafetyPrompt)

	imageBlob := &Blob{
		MimeType: "image/jpeg", // Assuming JPEG for simplicity, can detect if needed
		Data:     req.ImageBase64,
	}

	response, err := callGemini(apiKey, prompt, imageBlob)
	if err != nil {
		http.Error(w, "Failed to call AI: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"analysis": response})
}

// Reuse struct for image upload
func ScanLabReport(w http.ResponseWriter, r *http.Request) {
	var req PrescriptionScanRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		// Mock Response for Demo/Fallback
		mockAnalysis := `{
			"test_name": "General Blood Panel (Demo)",
			"date": "2023-10-24",
			"status": "Normal",
			"interpretation": "⚠️ DEMO MODE: API Key missing. \n\nThe simulated report shows normal interactions. Hemoglobin and RBC counts are within standard range. This is a placeholder analysis.",
			"lifestyle": "Regular exercise is recommended.",
			"medications": "None"
		}`
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"analysis": mockAnalysis})
		return
	}

	if req.ImageBase64 == "" {
		http.Error(w, "Image is required", http.StatusBadRequest)
		return
	}

	// Construct Prompt for Lab Report
	prompt := fmt.Sprintf("%s\n\nAnalyze this lab report image. Extract the following details:\n1. Test Name\n2. Date\n3. Status (Normal/Abnormal/High Risk)\n4. Detailed Interpretation\n5. Lifestyle Tips\n6. Suggested Medications (Generics, only if clearly indicated, else 'Consult Doctor')\n\nReturn ONLY a JSON object with keys: test_name, date, status, interpretation, lifestyle, medications.", SafetyPrompt)

	imageBlob := &Blob{
		MimeType: "image/jpeg",
		Data:     req.ImageBase64,
	}

	response, err := callGemini(apiKey, prompt, imageBlob)
	if err != nil {
		http.Error(w, "Failed to call AI: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"analysis": response})
}

func callGemini(apiKey, text string, imageBlob *Blob) (string, error) {
	// Fallback to gemini-1.5-pro, which is often more stable in free tier for complex multimodal
	modelName := "gemini-1.5-pro"
	url := "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey

	fmt.Printf("Calling Gemini Model: %s\n", modelName)

	// Prepare Parts
	var parts []GeminiPart
	parts = append(parts, GeminiPart{Text: text})

	if imageBlob != nil {
		parts = append(parts, GeminiPart{
			InlineData: &Blob{
				MimeType: imageBlob.MimeType,
				Data:     imageBlob.Data,
			},
		})
	}

	// Payload Structure
	requestBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": parts,
			},
		},
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		// Check for specific error to maybe fallback
		return "", fmt.Errorf("API Error: %s", string(body))
	}

	var geminiResp GeminiResponse
	if err := json.NewDecoder(resp.Body).Decode(&geminiResp); err != nil {
		return "", err
	}

	if len(geminiResp.Candidates) > 0 && len(geminiResp.Candidates[0].Content.Parts) > 0 {
		return geminiResp.Candidates[0].Content.Parts[0].Text, nil
	}

	return "", fmt.Errorf("no content generated")
}
