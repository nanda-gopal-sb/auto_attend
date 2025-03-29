package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()
	r.StaticFile("/", "../public/index.html")
	r.StaticFile("/lmao", "../public/pages/students/students.html")
	r.GET("/ping", func(c *gin.Context) {
		println("Hello")
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.Run(":3000") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
