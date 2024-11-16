package notifier

import (
	"fmt"
	"log"

	"github.com/alitto/pond/v2"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/mailer"
)

// Notifier handles the sending of email notifications using a worker pool.
type Notifier struct {
	pool pond.Pool
	pb   *pocketbase.PocketBase
}

// EmailNotification represents an email to be sent to a user.
type EmailNotification struct {
	emailAddress string
	userID       string
	message      *mailer.Message
}

// TaskReminder contains information about a task.
type TaskReminder struct {
	taskName string
	daysLate int
}

// NewNotifier creates a new Notifier with the specified
// number of worker goroutines.
func NewNotifier(numWorkers int, pb *pocketbase.PocketBase) *Notifier {
	if numWorkers < 1 {
		log.Fatal("invalid number of mailer workers")
	}

	return &Notifier{
		pool: pond.NewPool(numWorkers),
		pb:   pb,
	}
}

func (n *Notifier) NotifyUsers() {
	userSettings, err := n.allUserSettings()
	if err != nil {
		n.pb.Logger().Error(
			"EMAIL reminders job",
			"status", "failed",
			"error", err.Error(),
		)
		return
	}

	notificationEmails := n.constructNotificationEmails(userSettings)
	if len(notificationEmails) == 0 {
		return
	}

	if err := n.sendEmails(notificationEmails); err != nil {
		n.pb.Logger().Error(
			"EMAIL reminders job",
			"status", "failed",
			"error", err.Error(),
		)
		return
	}

	n.pb.Logger().Info(
		"EMAIL reminders job",
		"status", "success",
		"details", fmt.Sprintf("%d emails sent", len(notificationEmails)),
	)
}

func (n *Notifier) allUserSettings() ([]*models.Record, error) {
	return n.pb.Dao().FindRecordsByFilter("settings",
		"remindByEmailEnabled = true", "", 0, 0)
}
