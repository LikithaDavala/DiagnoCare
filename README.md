# DiagnoCare

DiagnoCare is a React-based healthcare application. The current project includes a registration route and a responsive login page designed for users to sign in to their healthcare account.

## Technologies Used

- React 19
- React Router DOM 6
- Create React App / `react-scripts`
- CSS3 with responsive media queries
- React Testing Library and Jest setup

## Project Structure

```text
src/
|-- App.js
|-- index.js
|-- index.css
|-- App.css
|-- Pages/
	|-- LoginPage/
		|-- loginPage.jsx
		|-- loginPage.css
	|-- RegistrationForm/
		|-- registrationForm.jsx
		|-- registrationForm.css
```

## Running the Project

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application normally opens at `http://localhost:3000`.

Create a production build:

```bash
npm run build
```

The current login implementation has been verified with a successful production build.

## Login Route Flow

### 1. Application routing

The `App` component uses `BrowserRouter`, `Routes`, and `Route` from `react-router-dom`.

- `/` renders `RegistrationForm`.
- `/login` renders `LoginPage`.

The registration page can send a user to the login page through its login link when that link is used. The login page sends a user back to `/` through the `Sign Up` link.

### 2. Login page loads

When the user visits `/login`, the `LoginPage` component renders a full viewport layout with two sections:

- The left visual panel contains a healthcare image, the `DIAGNOCARE` label, a care message, and supporting text.
- The right panel contains the login form.

The login page imports its styles directly with:

```js
import "./loginPage.css";
```

### 3. Left image panel

The `.login-visual` section uses a background image from Unsplash. A translucent dark overlay is placed over the image using a CSS linear gradient so that the white text remains readable.

The panel includes:

- Brand label: `DIAGNOCARE`
- Heading: `Your health deserves thoughtful care.`
- Supporting message about appointments, records, and the care journey

The image is applied as a CSS background rather than an `<img>` element. `background-size: cover` keeps the image filling the panel, and `background-position: center` keeps the focal area centered.

### 4. Login form fields

The form contains the following controls:

#### Email or username

- Label: `Email/UsserName`
- Input type: `email`
- Placeholder: `Enter your email or username`
- Required field
- Controlled by the `email` state variable

When the user types, `onChange` calls `setEmail`, which updates the value displayed in the input.

#### Password

- Label: `Password`
- Input type: `password`
- Placeholder: `Enter your password`
- Required field
- Controlled by the `password` state variable

The browser hides the password characters because the input uses `type="password"`. Typing updates the `password` state through `setPassword`.

#### Remember me

The checkbox lets the user select the `Remember me` option visually. It is styled with the application teal color.

At the moment, this checkbox is not connected to React state and does not save a session or persist a login preference. Persistence can be added later with an authentication service and `localStorage` or secure server-side session handling.

#### Forgot Password

The `Forgot Password?` link uses React Router's `Link` component and targets `/forgot-password`.

The link is present in the UI, but `/forgot-password` has not yet been registered in `App.js`. A forgot-password page and route must be added before this link becomes functional.

### 5. Login button behavior

The `Login` button is rendered as a submit button inside the form. The browser's built-in required-field validation prevents submission when either required field is empty.

Currently, the form does not have an `onSubmit` handler. Therefore:

- No API request is made.
- No email or password is checked against a database.
- No success or error message is displayed.
- No authentication token or session is created.
- No redirect occurs after clicking `Login`.

The current implementation is the frontend layout and input-state foundation for authentication. The next implementation step is to connect the submit event to a backend login endpoint.

### 6. Sign-up navigation

The text at the bottom of the form contains a `Sign Up` link. It uses React Router and navigates to `/`, where the registration form is currently rendered.

## Responsive Design

The desktop layout uses CSS Grid with two columns:

- The visual panel occupies the left side.
- The form panel occupies the right side.

At screen widths of `760px` or less:

- The two-column grid changes to a single-column layout.
- The image panel appears above the form.
- The image panel height becomes approximately `330px`.
- The form width and padding are reduced for smaller screens.

At screen widths of `420px` or less, the `Remember me` and `Forgot Password?` controls stack vertically to prevent horizontal crowding.

## Visual Styling

The login page defines reusable CSS variables for its visual system:

- `--login-teal`: primary button, link, and focus color
- `--login-dark`: headings and labels
- `--login-muted`: secondary text
- `--login-border`: input borders

Input focus states use a teal border and a light focus ring. The login button darkens and moves slightly upward on hover. Form width, heading size, and panel padding use responsive CSS constraints.

## Current Functional Flow

```text
User visits /login
		|
		v
LoginPage renders image panel and login form
		|
		+--> User enters email/username --> email state updates
		|
		+--> User enters password -------> password state updates
		|
		+--> User checks Remember me ----> checkbox changes visually
		|
		+--> User clicks Forgot Password -> navigates to /forgot-password
		|
		+--> User clicks Sign Up ---------> navigates to /
		|
		+--> User clicks Login -----------> browser validation only
										   (no authentication yet)
```

## Recommended Next Authentication Steps

To make the login flow fully functional:

1. Add an `onSubmit` handler and call `event.preventDefault()`.
2. Validate the email/username and password on the client.
3. Send the credentials to a backend login endpoint over HTTPS.
4. Display a loading state while the request is in progress.
5. Display a useful error message for invalid credentials or server errors.
6. Store authentication using a secure, preferably HTTP-only, cookie-based session.
7. Redirect authenticated users to the application dashboard.
8. Connect `Remember me` to the chosen session strategy.
9. Add the `/forgot-password` route and password-reset flow.
10. Add tests for successful login, invalid credentials, empty fields, navigation, and loading/error states.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Runs the development server |
| `npm run build` | Creates an optimized production build |
| `npm test` | Runs the test suite in watch mode |
| `npm run eject` | Ejects Create React App configuration |
