# UI Components Specification

## Purpose

This spec defines the reusable UI controls for the Padel Insight application. These components provide the user interface for selecting shot types, hands, and managing training mode controls.

## Requirements

### Requirement: ShotSelector

The system SHALL provide a reusable component for selecting shot type and hand (drive/reves).

#### Scenario: Select winner shot type

- GIVEN the ShotSelector is rendered
- WHEN user clicks on "Winner" button
- THEN the point type is set to 'winner'
- AND the button displays active styling (green background)

#### Scenario: Select error shot type

- GIVEN the ShotSelector is rendered
- WHEN user clicks on "Error" button
- THEN the point type is set to 'error'
- AND the button displays active styling (red background)

#### Scenario: Select drive hand

- GIVEN the ShotSelector is rendered
- WHEN user clicks on "drive" button
- THEN the hand is set to 'drive'
- AND the button displays active styling

#### Scenario: Select reves hand

- GIVEN the ShotSelector is rendered
- WHEN user clicks on "reves" button
- THEN the hand is set to 'reves'
- AND the button displays active styling

#### Scenario: Select shot type

- GIVEN the ShotSelector is rendered with shot types: ['saque', 'resto', 'fondo', 'bole', 'bande', 'globo', 'smash']
- WHEN user clicks on any shot type button
- THEN the shotType is updated to the selected value
- AND the button displays active styling

#### Scenario: Deselect shot type by clicking again

- GIVEN a shot type is currently selected
- WHEN user clicks on the same shot type button again
- THEN the shotType remains unchanged (toggle behavior NOT implemented)
- AND the button remains active

### Requirement: Training Mode Labels

The system SHALL display "Aciertos" instead of "Winner" in training mode while maintaining "Winner" in match/stats mode.

#### Scenario: ShotSelector displays training labels

- GIVEN the ShotSelector is rendered with mode='training'
- WHEN the component renders
- THEN the positive outcome button SHALL display "Aciertos" as its label
- AND the negative outcome button SHALL display "Errores" as its label

#### Scenario: ShotSelector displays match labels

- GIVEN the ShotSelector is rendered with mode='stats' or mode='tactics' (or mode not provided)
- WHEN the component renders
- THEN the positive outcome button SHALL display "Winner" as its label
- AND the negative outcome button SHALL display "Error" as its label

### Requirement: TrainingControls

The system SHALL provide a dedicated control panel for training mode that handles session management.

#### Scenario: Render training controls

- GIVEN the mode is set to 'training'
- WHEN the component mounts
- THEN all training controls are visible including:
  - ShotSelector (winner/error, hand, shot type)
  - Heatmap toggle button
  - Undo button
  - Save session button
  - Clear session button
  - History button

#### Scenario: Save training session with points

- GIVEN the user has recorded at least one training point
- WHEN user clicks "Finalizar y Guardar" button
- THEN the system prompts for session duration
- AND on valid input, saves the session to storage
- AND displays success confirmation

#### Scenario: Save training session with no points

- GIVEN the user has recorded zero training points
- WHEN user clicks "Finalizar y Guardar" button
- THEN the system shows alert: "Registra al menos un golpe antes de guardar"
- AND the session is NOT saved

#### Scenario: Clear training session

- GIVEN the user has recorded training points
- WHEN user clicks "Reiniciar" button
- THEN the system shows confirmation dialog: "¿Reiniciar sesión? Se perderán los golpes registrados."
- AND on confirm, clears all training points
- AND resets the session

#### Scenario: Clear empty training session

- GIVEN the user has zero training points
- WHEN user clicks "Reiniciar" button
- THEN the session is cleared without confirmation dialog
- AND the component resets to initial state

### Requirement: App Refactor - Handler Extraction

The system SHALL extract click and drag handlers into a custom hook for better separation of concerns.

#### Scenario: Court click in stats mode

- GIVEN the user is in stats mode
- WHEN user clicks on the court
- THEN handleCourtClick is called
- AND a point is added with current pointType, shotType, and hand
- AND score is incremented accordingly

#### Scenario: Court click in training mode

- GIVEN the user is in training mode
- WHEN user clicks on the court
- THEN handleCourtClick is called
- AND a point is added WITHOUT updating score

#### Scenario: Token drag end

- GIVEN a player token is being dragged
- WHEN user releases the token
- THEN handleTokenDragEnd is called
- AND the token position is updated in state
