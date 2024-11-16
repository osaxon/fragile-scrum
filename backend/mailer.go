package main

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/cron"
	"github.com/s-petr/longhabit/notifier"
)

// startMailer initializes and starts the email notification scheduler.
// It sets up a cron job that periodically sends email reminders
// to users based on the configured schedule.
func (app *application) startMailer() {
	app.pb.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		scheduler := cron.New()
		mailNotifier := notifier.NewNotifier(
			app.config.mailerNumWorkers,
			app.pb,
		)

		scheduler.MustAdd(
			"email-reminders",
			app.config.mailerCronSchedule,
			func() { mailNotifier.NotifyUsers() },
		)

		scheduler.Start()
		return nil
	})
}
