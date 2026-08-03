# Forest Guardian Dashboard

Prompt: Build a Responsive React Frontend for "Smart Forest Guardian"

Create a professional, responsive React.js frontend for a Final Year Engineering Project named:

Smart Forest Guardian: AI-Powered Footprint Recognition and Poaching Detection

This application is developed exclusively for Forest Department officials to monitor wildlife movement, detect suspicious human movement through footprints, receive alerts, and maintain records of animal sightings.

This project currently requires ONLY THE FRONTEND. Do NOT implement backend logic, databases, authentication services, or AI models. Use realistic mock data and structure the application so it can later integrate seamlessly with a Spring Boot backend and Machine Learning footprint detection model.

---

Primary Workflow

The application's main workflow is:

1. Forest Ranger logs into the system.

2. Ranger reaches the Dashboard.

3. Ranger discovers an animal or human footprint in the forest.

4. Ranger captures or uploads an image of the footprint.

5. The frontend sends the image to a placeholder AI service.

6. Display a mock AI detection result showing:

   - Detected Species (or Human)

   - Confidence Percentage

   - Forest Zone

   - GPS Coordinates (mock)

   - Date & Time

7. Ranger confirms and saves the detection.

8. Saving the detection automatically:

   - Creates a new alert.

   - Adds the detection to Detection History.

   - Places a new marker in the Last Spotted Locations map.

9. Dashboard statistics update automatically using mock state.

Design every page around this workflow.

---

Tech Stack

- React.js (Vite)

- React Router DOM

- Material UI (MUI)

- React Context API

- Axios

- React Hook Form

- React Leaflet

- Recharts

- Framer Motion

Use functional components only.

---

Responsive Design

The application must work perfectly on:

- Mobile phones

- Tablets

- Laptops

- Desktop monitors

Requirements:

- Responsive sidebar

- Collapsible mobile menu

- Responsive tables

- Responsive cards

- No horizontal scrolling

- Proper spacing

- Touch-friendly UI

- Modern dashboard appearance

---

Color Theme

Professional Forest Department theme.

Primary:

#1B5E20

Secondary:

#4CAF50

Sidebar:

#173A1A

Background:

#F5F7F5

Cards:

White

Success:

#43A047

Warning:

#FB8C00

Danger:

#D32F2F

Text:

#263238

Style:

Modern

Minimal

Government dashboard

Rounded cards

Soft shadows

Clean typography

---

Pages

1. Login

Simple login interface.

Contains:

- Forest Department logo

- Project title

- Username

- Password

- Login button

Background:

Blurred forest image with dark overlay.

---

2. Dashboard

Show summary cards:

- Total Animal Detections

- Human Movement Alerts

- Active Alerts

- Today's Detections

Below the cards display:

Recent Alerts

Example:

Human footprint detected

Tiger footprint detected

Elephant spotted

Each alert should display:

- Icon

- Location

- Time

- Status

---

Last Spotted Locations

Display an interactive Leaflet map.

Show markers for:

Tiger

Elephant

Leopard

Bear

Human Footprint

Clicking a marker should open:

Species/Human

Forest Zone

Coordinates

Last Seen

Date

Time

---

Recent Detection History

Responsive table showing:

Image

Species

Confidence

Location

Time

---

3. Footprint Detection

This is the most important page.

Purpose:

Allow a Forest Ranger to upload a footprint image.

Features:

Large upload area

Drag & Drop

Browse Image

Camera Upload placeholder

Image Preview

Detect Button

When Detect is clicked:

Show loading animation.

Then display a mock AI response.

Example:

Detected Species:

Tiger

Confidence:

96%

Forest Zone:

Zone C

Coordinates:

12.9231, 77.5342

Detected Time:

03 Aug 2026

10:42 AM

Buttons:

Save Detection

Clear

After Save Detection:

Display success message.

Automatically:

- Add record to Detection History.

- Add new alert.

- Add marker to Last Spotted Locations map.

- Update Dashboard counts.

Implement this entirely using mock React state so it behaves like a real application.

---

4. Alerts

Display alert cards.

Alert types:

Human Movement

Tiger Detected

Elephant Near Village

Bear Footprint

Each alert contains:

Priority

Location

Date

Time

Status

Status Chips:

New

Acknowledged

Filters:

All

Animals

Human

High Priority

---

5. Tracking

Purpose:

Display only Last Spotted Locations.

Large interactive map.

Markers:

Tiger

Elephant

Leopard

Bear

Human Footprint

Clicking a marker shows:

Species

Location

Date

Time

Coordinates

Below the map:

Recent Sightings timeline.

---

6. Detection History

Responsive table.

Columns:

Image

Species

Confidence

Location

Date

Time

Search bar.

Species filter.

Date sorting.

Pagination.

---

7. Settings

Simple page.

Officer Name

Department

Theme

Notifications

About Project

---

Sidebar

Dashboard

Footprint Detection

Alerts

Tracking

Detection History

Settings

Logout

On mobile:

Convert into hamburger navigation.

---

Reusable Components

Create reusable components:

Navbar

Sidebar

Summary Card

Alert Card

Upload Box

Image Preview

Detection Result Card

Map Component

Status Chip

Detection Table

Search Bar

Modal

Loading Skeleton

Empty State

Confirmation Dialog

Toast Notification

---

Folder Structure

src/

assets/

components/

pages/

layouts/

context/

hooks/

services/

routes/

theme/

utils/

---

Mock Data Architecture

Store mock data separately.

Create mock services for:

Dashboard

Alerts

Detection History

Map Markers

Footprint Detection Results

These services should later be easily replaceable with Spring Boot REST API calls.

---

Future Backend Compatibility

Design the frontend so it can later integrate with:

- Spring Boot REST APIs

- JWT Authentication

- PostgreSQL/MySQL

- AI Footprint Detection Model

- GPS Location APIs

Keep all business logic modular and avoid hardcoding values inside components.

---

Expected Result

Generate a polished, enterprise-style React application that feels like software used by a real Forest Department. The application should be simple, intuitive, highly responsive, and centered around the core workflow of uploading footprint images, detecting animal or human footprints, generating alerts, updating last spotted locations on a map, and maintaining a searchable detection history. Use realistic mock data and ensure every feature is ready for future integration with Spring Boot and machine learning models.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a870e198-de04-4cbb-a0bf-7fd097d72ce9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
