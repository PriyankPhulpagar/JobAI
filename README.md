# JobAI

AI-powered job interview preparation platform. Upload a resume, paste a job description, and get a personalized interview report — match score, technical and behavioral questions with model answers, skill gap analysis, a day-wise preparation roadmap, and an ATS-optimized resume PDF tailored to the role.

## Features

- **Resume + JD analysis** — upload a resume (PDF) or provide a quick self-description, paste a target job description, and generate a full interview report powered by Google Gemini.
- **Match score** — a 0–100 score estimating how well the candidate's profile fits the role.
- **Technical & behavioral questions** — likely interview questions, each with the interviewer's intention behind asking it and a model answer.
- **Skill gap detection** — missing or weak skills relative to the job description, tagged by severity (low / medium / high).
- **Preparation roadmap** — a day-by-day study plan with focus areas and concrete tasks.
- **ATS-optimized resume generation** — generates a tailored, human-sounding resume as a downloadable PDF (via Puppeteer), designed to pass ATS parsing while staying visually clean.
- **Auth** — JWT-based authentication with token blacklisting on logout, so logged-out tokens can't be reused.
- **Report history** — view all previously generated interview reports for the logged-in user.

## Tech Stack

**Frontend**
- React.js (Vite)
- React Router
- SCSS
- Context API + custom hooks for state management
- Axios

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication with token blacklisting
- Multer (resume file upload)
- pdf-parse (resume text extraction)
- Google Gemini API (`@google/genai`) for report and resume generation
- Puppeteer (HTML → PDF resume generation)

## Architecture

The frontend follows a 4-layer structure to keep concerns separated:
