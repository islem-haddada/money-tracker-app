package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
)

// Chaîne de connexion PostgreSQL
const dbURL = "postgres://money:1234@localhost:5432/moneydb"

func main() {
	ctx := context.Background()

	// Connexion
	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		log.Fatal("❌ Erreur connexion DB:", err)
	}
	defer conn.Close(ctx)

	// 1. Créer un user
	var userID int
	err = conn.QueryRow(
		ctx,
		"INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
		"Fakher", "fakher@example.com", "secret123", // ⚠️ password doit être hashé plus tard
	).Scan(&userID)
	if err != nil {
		log.Fatal("❌ Erreur création user:", err)
	}
	fmt.Println("✅ User créé avec ID:", userID)

	// 2. Ajouter une transaction
	_, err = conn.Exec(
		ctx,
		"INSERT INTO transactions (user_id, amount, type, description) VALUES ($1, $2, $3, $4)",
		userID, 500.0, "income", "Salaire")
	if err != nil {
		log.Fatal("❌ Erreur ajout transaction:", err)
	}
	fmt.Println("✅ Transaction ajoutée")

	// 3. Lire toutes les transactions de ce user
	rows, err := conn.Query(ctx, "SELECT id, amount, type, description, created_at FROM transactions WHERE user_id=$1", userID)
	if err != nil {
		log.Fatal("❌ Erreur SELECT transactions:", err)
	}
	defer rows.Close()

	fmt.Println("📌 Transactions de l'utilisateur", userID)
	for rows.Next() {
		var id int
		var amount float64
		var ttype, desc, createdAt string

		err := rows.Scan(&id, &amount, &ttype, &desc, &createdAt)
		if err != nil {
			log.Fatal("❌ Erreur lecture row:", err)
		}

		fmt.Printf("➡️ %d | %.2f | %s | %s | %s\n", id, amount, ttype, desc, createdAt)
	}
}
