package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	_ "modernc.org/sqlite"
)

var jwtKey = []byte("replace-with-secure-secret")
var db *sql.DB

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"-"`
}

func initDB() {
	var err error
	db, err = sql.Open("sqlite", "./moneytracker.db")
	if err != nil {
		log.Fatal(err)
	}

	query := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		name TEXT,
		password TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`
	_, err = db.Exec(query)
	if err != nil {
		log.Fatal(err)
	}
}

func sendError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"message": msg})
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		sendError(w, "JSON invalide", http.StatusBadRequest)
		return
	}

	if body.Email == "" || body.Password == "" {
		sendError(w, "Email et mot de passe requis", http.StatusBadRequest)
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)

	res, err := db.Exec("INSERT INTO users (email, name, password) VALUES (?, ?, ?)", body.Email, body.Name, string(hash))
	if err != nil {
		sendError(w, "Cet email est déjà utilisé", http.StatusBadRequest)
		return
	}

	id, _ := res.LastInsertId()
	uID := int(id)

	token, _ := makeToken(uID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":    uID,
			"email": body.Email,
			"name":  body.Name,
		},
	})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		sendError(w, "JSON invalide", http.StatusBadRequest)
		return
	}

	var u User
	err := db.QueryRow("SELECT id, email, name, password FROM users WHERE email = ?", body.Email).Scan(&u.ID, &u.Email, &u.Name, &u.Password)
	if err != nil {
		sendError(w, "Email ou mot de passe incorrect", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(body.Password)); err != nil {
		sendError(w, "Email ou mot de passe incorrect", http.StatusUnauthorized)
		return
	}

	token, _ := makeToken(u.ID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":    u.ID,
			"email": u.Email,
			"name":  u.Name,
		},
	})
}

func meHandler(w http.ResponseWriter, r *http.Request) {
	userID, ok := authFromReq(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var u User
	err := db.QueryRow("SELECT id, email, name FROM users WHERE id = ?", userID).Scan(&u.ID, &u.Email, &u.Name)
	if err != nil {
		http.Error(w, "not_found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user": map[string]interface{}{
			"id":    u.ID,
			"email": u.Email,
			"name":  u.Name,
		},
	})
}

func makeToken(userID int) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return tok.SignedString(jwtKey)
}

func authFromReq(r *http.Request) (int, bool) {
	h := r.Header.Get("Authorization")
	if len(h) < 7 || h[:7] != "Bearer " {
		return 0, false
	}
	tokenStr := h[7:]
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return 0, false
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if sub, ok := claims["sub"].(float64); ok {
			return int(sub), true
		}
	}
	return 0, false
}

func changePasswordHandler(w http.ResponseWriter, r *http.Request) {
	userID, ok := authFromReq(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	var body struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	var currentHash string
	err := db.QueryRow("SELECT password FROM users WHERE id = ?", userID).Scan(&currentHash)
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(currentHash), []byte(body.OldPassword)); err != nil {
		http.Error(w, "ancien mot de passe incorrect", http.StatusUnauthorized)
		return
	}

	newHash, _ := bcrypt.GenerateFromPassword([]byte(body.NewPassword), bcrypt.DefaultCost)
	_, err = db.Exec("UPDATE users SET password = ? WHERE id = ?", string(newHash), userID)
	if err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "success"})
}

func main() {
	initDB()
	mux := http.NewServeMux()
	mux.HandleFunc("/api/auth/signup", signupHandler)
	mux.HandleFunc("/api/auth/login", loginHandler)
	mux.HandleFunc("/api/auth/me", meHandler)
	mux.HandleFunc("/api/auth/change-password", changePasswordHandler)

	// CORS Middleware
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		mux.ServeHTTP(w, r)
	})

	log.Println("Starting auth server on :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
