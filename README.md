# SkillBridgeAI

**Verified Skills. Real Opportunities. For Every Indian.**

SkillBridgeAI is a trust-based employability platform designed for rural and Tier 2/3 Indian youth. It leverages blockchain for credential verification and AI for skill-gap analysis to bridge the gap between talent and opportunities.

## Features

- **Candidate Onboarding**: Aadhaar/OTP-based identity verification and drag-and-drop skill profiling.
- **Skill Gap Analysis**: Visual radar charts showing strengths vs. industry demand.
- **Job Matching**: AI-powered job recommendations with "Why you match" explanations.
- **Blockchain Wallet**: Verifiable digital credentials with QR code sharing.
- **Employer Portal**: Dashboard for managing job postings and searching verified candidates.
- **Offline Kiosk Mode**: High-contrast, touch-friendly interface for public access points.

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS with CSS Variables (Design System) & Utility Classes
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/skillbridge-ai.git
    cd skillbridge-ai
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/components`: Reusable UI components (`ui`, `layout`, `dashboard`, `jobs`).
- `src/pages`: Page components organized by feature (`landing`, `auth`, `dashboard`, `jobs`, `wallet`, `employer`, `kiosk`).
- `src/styles`: Global variables, resets, and component-specific CSS.
- `src/context`: React Context for state management (`AuthContext`).

## Accessibility & Design

- **Typography**: Mukta (Headings) and DM Sans (Body) for readability.
- **Colors**: High-contrast Govt-grade Indigo mixed with vibrant Saffron and Emerald.
- **Responsive**: Fully responsive layouts for Mobile, Tablet, and Desktop.
