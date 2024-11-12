package main

import (
	"fmt"
	"net/mail"
	"strings"
	"time"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/cron"
	"github.com/pocketbase/pocketbase/tools/mailer"
)

func (app *application) startMailer() {
	app.pb.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		scheduler := cron.New()

		scheduler.MustAdd("email-reminders", app.config.mailerCronSchedule, func() {
			userSettings, err := app.pb.Dao().FindRecordsByFilter("settings", "remindByEmailEnabled = true", "", 0, 0)
			if err != nil {
				app.pb.Logger().Error(
					"EMAIL reminder",
					"error", err.Error(),
				)
				return
			}

			for _, settings := range userSettings {
				remindEmail := settings.GetString("remindEmail")
				userId := settings.GetString("user")

				if remindEmail == "" {
					continue
				}

				userTasks, err := app.pb.Dao().FindRecordsByFilter(
					"tasks",
					fmt.Sprintf("user = '%s' && remindByEmail = true", userId),
					"",
					0,
					0,
				)
				if err != nil {
					app.pb.Logger().Error(
						"EMAIL reminder",
						"error", err.Error(),
						"email", remindEmail,
						"userId", userId,
					)
					continue
				}

				var reminders []string

				for _, record := range userTasks {
					history := record.GetStringSlice("history")
					daysRepeat := record.GetInt("daysRepeat")
					daysRemind := record.GetInt("daysRemind")
					taskName := record.GetString("name")

					if len(history) == 0 || daysRepeat <= 0 {
						continue
					}

					lastDone, err := time.Parse("2006-01-02", history[0])
					if err != nil {
						app.pb.Logger().Error(
							"EMAIL reminder",
							"error", err.Error(),
							"email", remindEmail,
							"userId", userId,
						)
						continue
					}

					nextDue := lastDone.AddDate(0, 0, daysRepeat)
					today := time.Now()

					daysLate := int(today.Sub(nextDue).Hours() / 24)

					if daysLate == 0 && daysRemind == 0 {
						reminderText := fmt.Sprintf("%s (due today)", taskName)
						reminders = append(reminders, reminderText)
					} else if daysLate >= 0 && daysRemind > 0 && daysLate%daysRemind == 0 {
						var reminderText string
						if daysLate == 0 {
							reminderText = fmt.Sprintf("%s (due today)", taskName)
						} else {
							reminderText = fmt.Sprintf("%s (%d days late)", taskName, daysLate)
						}
						reminders = append(reminders, reminderText)
					}
				}

				if len(reminders) > 0 {
					message := &mailer.Message{
						From: mail.Address{
							Address: "noreply@longhabit.com",
							Name:    "Long Habit",
						},
						To:      []mail.Address{{Address: remindEmail}},
						Subject: "Long Habit - Tasks Reminder",
						Text: fmt.Sprintf("Reminder to complete the following tasks:\n%s",
							strings.Join(reminders, "\n")),
					}

					if err := app.pb.NewMailClient().Send(message); err != nil {
						app.pb.Logger().Error(
							"EMAIL reminder",
							"error", err.Error(),
							"email", remindEmail,
							"userId", userId,
						)
					}
					app.pb.Logger().Info(
						"EMAIL reminder",
						"email", remindEmail,
						"userId", userId,
					)
				}
			}
		})

		scheduler.Start()
		return nil
	})
}
