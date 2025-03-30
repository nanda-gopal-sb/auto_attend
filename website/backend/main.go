package main

import (
	"auto_attend/db"
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // Import the pq driver
	"log"
	"net/http"
)

// Database connection details (move this to a config or environment variables in real applications)

// Function to execute the query and return the raw data
func queryUsers(db *sql.DB, query string) ([]map[string]interface{}, error) {
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query failed: %w", err)
	}
	defer rows.Close()

	var results []map[string]interface{}
	columns, err := rows.Columns()
	if err != nil {
		return nil, fmt.Errorf("failed to get columns: %w", err)
	}

	for rows.Next() {
		values := make([]interface{}, len(columns))
		valuePtrs := make([]interface{}, len(columns))
		for i := range values {
			valuePtrs[i] = &values[i]
		}

		if err := rows.Scan(valuePtrs...); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		row := make(map[string]interface{})
		for i, col := range columns {
			val := values[i]
			if b, ok := val.([]byte); ok {
				row[col] = string(b)
			} else {
				row[col] = val
			}
		}
		results = append(results, row)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error during rows iteration: %w", err)
	}

	return results, nil
}

func main() {

	db_params := db.GetDatabase()
	var dbinfo = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		db_params.Host, db_params.Port, db_params.User, db_params.Password, db_params.DB_name)

	// Open a database connection
	db, err := sql.Open("postgres", dbinfo)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	defer db.Close()

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}
	fmt.Println("Successfully connected to the database")

	// Initialize the Gin router
	router := gin.Default()

	// Define an endpoint to fetch users using the separate query function
	router.GET("/users", func(c *gin.Context) {
		usersData, err := queryUsers(db, "select * from attendance")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, usersData)
	})

	// Run the Gin server
	port := ":3000"
	fmt.Printf("Server listening on port %s\n", port)
	if err := router.Run(port); err != nil {
		log.Fatalf("Error running server: %v", err)
	}
}
