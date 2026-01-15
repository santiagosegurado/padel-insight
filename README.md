# Padel Insight - MVP

**Padel Insight** is a Progressive Web Application (PWA) designed to track advanced padel statistics and visualize tactical data on a virtual court. It combines a scoreboard, tactical board, and statistical tracker into a single mobile-first interface.

## 🚀 Features

### Core Functionality
*   **Visual Point Tracking**: Drag and drop points on the court to record where winners or errors occurred.
*   **Heatmaps**: Visualize player activity and shot distribution on the court.
*   **Scoreboard**: Automated score tracking (Points, Games, Sets) adhering to standard Padel rules (Golden Point / No Ad).
*   **Match History**: Automatically saves completed matches to local storage for later review.

### Advanced Stats
*   **Shot Details**: Record specific shot types (Volea, Bandeja, Smash, Globo, etc.) and hand used (Forehand/Backhand).
*   **Tactics Board**: A "Coach Mode" with draggable tokens to plan plays and strategies without affecting stats.

### User Experience (MVP Refinements)
*   **Mobile First Design**: Controls positioned at the bottom for easy one-handed operation on smartphones.
*   **Hideable UI**: Toggle visibility of the scoreboard and controls for full-screen analysis.
*   **Team Names**: Customizable team names ("Nosotros" vs "Ellos" default).
*   **Manual Score Control**: `+` and `-` buttons to manually correct the score in case of input errors.
*   **Serve Indicator**: Visual `🥎` icon indicating the serving team. Auto-switches on game win.
*   **Coin Toss**: Built-in "Sorteo" feature to decide the first server fairly.
*   **PWA**: Installable as a native app on iOS and Android.

## 🛠️ Technical Stack

*   **Frontend**: React 18 + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS v3
*   **State Management**: Zustand (with Persist middleware)
*   **Canvas/Graphics**: React Konva (for the tactical board and heatmaps)
*   **PWA**: `vite-plugin-pwa`

## 📂 Project Structure

```bash
src/
├── components/         # UI Components (Court, Controls, etc.)
├── store/
│   └── matchStore.ts   # Central Zustand Store (Match Logic)
├── assets/             # Images and Icons
├── App.tsx             # Main Application Logic
└── main.tsx            # Entry Point
```

## 💾 Data Model

The application state is managed by a central `MatchStore` which persists to `localStorage`.

### Key Interfaces

**Point**
```typescript
interface Point {
    x: number;
    y: number;
    type: 'winner' | 'error';
    player: 'me' | 'partner' | 'opponent';
    shotType?: 'resto' | 'fondo' | 'volea' | 'bandeja' | 'saque' | 'globo' | 'smash';
    hand?: 'drive' | 'reves';
}
```

**Score**
```typescript
interface Score {
    sets: { us: number; them: number }[];
    currentSet: { us: number; them: number };
    points: { us: string; them: string }; // "0", "15", "30", "40"
}
```

**Match State**
```typescript
interface MatchState {
    points: Point[];
    score: Score;
    teamNames: { us: string; them: string };
    servingTeam: 'us' | 'them';
    matches: SavedMatch[];
    // ... Actions
}
```

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd padel-insight
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📱 PWA Installation

*   **iOS**: Open in Safari -> Share -> "Add to Home Screen".
*   **Android**: Open in Chrome -> Menu -> "Install App".
