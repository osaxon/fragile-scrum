package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
)

type application struct {
	pb     *pocketbase.PocketBase
	config appConfig
}

type appConfig struct {
	dbDir              string
	mailerCronSchedule string
}

func newApplication() *application {
	dbDir := getEnvOrDefault("DB_DIR", "db")
	return &application{
		pb: pocketbase.NewWithConfig(pocketbase.Config{DefaultDataDir: dbDir}),
		config: appConfig{
			dbDir:              dbDir,
			mailerCronSchedule: getEnvOrDefault("MAILER_CRON_SCHEDULE", "0 9 * * *"),
		},
	}
}

func main() {
	app := newApplication()

	app.mountFs()
	app.setupAuthHooks()
	app.startMailer()

	log.Fatal(app.pb.Start())
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
