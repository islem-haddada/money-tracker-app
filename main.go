package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("replace-with-secure-secret")

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

var (
	users   = map[string]*User{} // key by email
	usersMu sync.Mutex
	nextID  = 1
)

func signupHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid", http.StatusBadRequest)
		return
	}
	usersMu.Lock()
	defer usersMu.Unlock()
	if _, ok := users[body.Email]; ok {
		http.Error(w, "user_exists", http.StatusBadRequest)
		return
	}
	hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	u := &User{ID: nextID, Email: body.Email, Password: string(hash)}
	nextID++
	users[body.Email] = u

	token, err := makeToken(u.ID)
	if err != nil {
		http.Error(w, "token_error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]interface{}{"token": token, "user": map[string]interface{}{"id": u.ID, "email": u.Email}})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid", http.StatusBadRequest)
		return
	}
	usersMu.Lock()
	u, ok := users[body.Email]
	usersMu.Unlock()
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(body.Password)) != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	token, err := makeToken(u.ID)
	if err != nil {
		http.Error(w, "token_error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]interface{}{"token": token, "user": map[string]interface{}{"id": u.ID, "email": u.Email}})
}

func meHandler(w http.ResponseWriter, r *http.Request) {
	userID, ok := authFromReq(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	usersMu.Lock()
	defer usersMu.Unlock()
	for _, u := range users {
		if u.ID == userID {
			json.NewEncoder(w).Encode(map[string]interface{}{"user": map[string]interface{}{"id": u.ID, "email": u.Email}})
			return
		}
	}
	http.Error(w, "not_found", http.StatusNotFound)
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
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userID, ok := authFromReq(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var body struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	usersMu.Lock()
	defer usersMu.Unlock()
	var currentUser *User
	for _, u := range users {
		if u.ID == userID {
			currentUser = u
			break
		}
	}
	if currentUser == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(currentUser.Password), []byte(body.OldPassword)); err != nil {
		http.Error(w, "Ancien mot de passe incorrect", http.StatusUnauthorized)
		return
	}
	newHash, _ := bcrypt.GenerateFromPassword([]byte(body.NewPassword), bcrypt.DefaultCost)
	currentUser.Password = string(newHash)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "success"})
}

func main() {
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
