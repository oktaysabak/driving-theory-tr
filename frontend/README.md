# Driving Theory Frontend

This is a React frontend application for the Driving Theory app.

## Setup

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install` (Already done during creation)

## Running the App

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser at `http://localhost:5173` (or the port shown in terminal).

## Features

-   **Theme Selection**: Choose from available themes.
-   **Quiz Mode**: Answer questions one by one.
-   **Immediate Feedback**: Check answers and see explanations.
-   **Media Support**: Displays images and videos if available for the question.
-   **Responsiveness**: Works on mobile and desktop.

## Data Source

The app fetches questions from `public/data.json`, which is a copy of `../driving_theory_questions_tr.json`.
Images and videos are served from `public/images` and `public/videos`.
