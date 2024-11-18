# Configurations for Pocketbase Admin Dashboard

## Mail Settings - Verification Email Template

### Subject

`{APP_NAME} - Verify email`

### Action URL

`{APP_URL}/verify-email?token={TOKEN}`

### Body

```html
<style>
  body,
  html {
    padding: 0;
    margin: 0;
    border: 0;
    color: #1a191a;
    background: #fff;
    font-size: 14px;
    line-height: 20px;
    font-weight: normal;
    font-family: Inter, sans-serif, emoji;
  }

  body {
    padding: 20px 30px;
  }

  strong {
    font-weight: bold;
  }

  em,
  i {
    font-style: italic;
  }

  p {
    display: block;
    margin: 10px 0;
    font-family: inherit;
  }

  small {
    font-size: 12px;
    line-height: 16px;
  }

  hr {
    display: block;
    height: 1px;
    border: 0;
    width: 100%;
    background: #e1e6ea;
    margin: 10px 0;
  }

  a {
    color: inherit;
  }

  .hidden {
    display: none !important;
  }

  .btn {
    display: inline-block;
    cursor: pointer;
    color: #fff !important;
    background: #8a40bf !important;
    text-decoration: none !important;
    width: auto;
    min-width: 150px;
    line-height: 40px;
    height: 40px;
    text-align: center;
    padding: 0 20px;
    margin: 5px 0;
    font-family: Inter, sans-serif, emoji;
    font-weight: normal;
    font-size: 14px;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .btn:hover {
    opacity: 0.9;
  }

  .reminders {
    margin-left: 16px;
    padding-left: 0;
  }

  .reminders li {
    margin-left: 0;
    padding-left: 0;
  }
</style>

<p>Hi,</p>
<p>Thank you for signing up to {APP_NAME}.</p>
<p>Click on the button below to verify your email address.</p>
<p>
  <a class="btn" href="{ACTION_URL}" target="_blank" rel="noopener">Verify</a>
</p>

<p>Alternatively, you can copy the token below to verify your email in the browser.</p>
<p>{TOKEN}</p>

<p>
  Thanks,<br />
  Long Habit
</p>

```

## Mail Settings - Password Reset Template

### Subject

`{APP_NAME} - Reset password`

### Action URL

`{APP_URL}/reset-password?token={TOKEN}`

### Body

```html
<style>
  body,
  html {
    padding: 0;
    margin: 0;
    border: 0;
    color: #1a191a;
    background: #fff;
    font-size: 14px;
    line-height: 20px;
    font-weight: normal;
    font-family: Inter, sans-serif, emoji;
  }

  body {
    padding: 20px 30px;
  }

  strong {
    font-weight: bold;
  }

  em,
  i {
    font-style: italic;
  }

  p {
    display: block;
    margin: 10px 0;
    font-family: inherit;
  }

  small {
    font-size: 12px;
    line-height: 16px;
  }

  hr {
    display: block;
    height: 1px;
    border: 0;
    width: 100%;
    background: #e1e6ea;
    margin: 10px 0;
  }

  a {
    color: inherit;
  }

  .hidden {
    display: none !important;
  }

  .btn {
    display: inline-block;
    cursor: pointer;
    color: #fff !important;
    background: #8a40bf !important;
    text-decoration: none !important;
    width: auto;
    min-width: 150px;
    line-height: 40px;
    height: 40px;
    text-align: center;
    padding: 0 20px;
    margin: 5px 0;
    font-family: Inter, sans-serif, emoji;
    font-weight: normal;
    font-size: 14px;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .btn:hover {
    opacity: 0.9;
  }

  .reminders {
    margin-left: 16px;
    padding-left: 0;
  }

  .reminders li {
    margin-left: 0;
    padding-left: 0;
  }
</style>

<p>Hi,</p>
<p>Click on the button below to reset your password.</p>
<p>
  <a class="btn" href="{ACTION_URL}" target="_blank" rel="noopener">Reset password</a>
</p>
<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>

<p>
  Thanks,<br />
  Long Habit
</p>

```