package main

import (
	"github.com/pocketbase/pocketbase/core"
)

// disableHealthRouteLogging disables logging of successful requests
// hitting the /api/health endpoint from user agent "Wget".
// This prevents Docker Compose from polluting the logs with
// constant healthcheck pings.
func (app *application) disableHealthRouteLogging() {
	app.pb.OnServe().BindFunc(func(e *core.ServeEvent) error {
		e.Router.BindFunc(func(e *core.RequestEvent) error {
			if e.Request.URL.Path == "/api/health" && e.Request.UserAgent() == "Wget" {
				e.Set("__skipSuccessActivityLogger", true)
			}
			return e.Next()
		})

		return e.Next()
	})
}
