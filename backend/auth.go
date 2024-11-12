package main

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func (app *application) setupAuthHooks() {
	app.pb.OnModelAfterCreate("users").Add(func(e *core.ModelEvent) error {
		record := e.Model.(*models.Record)
		userId := record.Id

		settingsCollection, err := app.pb.Dao().FindCollectionByNameOrId("settings")
		if err != nil {
			return err
		}

		newSettingsRecord := models.NewRecord(settingsCollection)
		newSettingsRecord.Set("user", userId)
		newSettingsRecord.Set("remindEmail", record.Get("email"))
		newSettingsRecord.Set("remindByEmailEnabled", true)

		return app.pb.Dao().SaveRecord(newSettingsRecord)
	})

	app.pb.OnRecordAfterAuthWithPasswordRequest().Add(func(e *core.RecordAuthWithPasswordEvent) error {
		userRecord := e.Record
		userRecord.Set("authWithPasswordAvailable", true)

		return app.pb.Dao().SaveRecord(userRecord)
	})
}
