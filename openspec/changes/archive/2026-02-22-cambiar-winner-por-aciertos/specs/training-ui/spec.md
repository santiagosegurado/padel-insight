# Delta for Training UI

## MODIFIED Requirements

### Requirement: Training Mode Labels

The system SHALL display "Aciertos" instead of "Winner" in all training-related UI components while maintaining "Winner" in match/stats mode.

#### Scenario: ShotSelector displays correct labels in training mode

- GIVEN the user is in training mode
- WHEN the ShotSelector component renders
- THEN the positive outcome button SHALL display "Aciertos" as its label
- AND the negative outcome button SHALL display "Errores" as its label

#### Scenario: ShotSelector displays match labels in stats mode

- GIVEN the user is NOT in training mode (stats or tactics)
- WHEN the ShotSelector component renders
- THEN the positive outcome button SHALL display "Winner" as its label
- AND the negative outcome button SHALL display "Error" as its label

#### Scenario: TrainingHistoryModal displays correct statistics labels

- GIVEN the user opens the TrainingHistoryModal
- WHEN the modal displays session statistics
- THEN successful shots SHALL be labeled as "Aciertos"
- AND failed shots SHALL be labeled as "Errores"

#### Scenario: StatsControls displays correct labels in training mode

- GIVEN the user is viewing stats in training mode
- WHEN the stats are displayed
- THEN the count of successful points SHALL be labeled as "Aciertos"
- AND the count of failed points SHALL be labeled as "Errores"

## REMOVED Requirements

### Requirement: Winner/Error Labels in Training Mode

(Reason: "Winner" is a match-specific term that does not apply to training sessions where there are no opponents, only successful and unsuccessful practice shots)
