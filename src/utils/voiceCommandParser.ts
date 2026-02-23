export interface ParsedCommand {
    isValid: boolean;
    pointType?: 'winner' | 'error';
    hand?: string;
    shotType?: string;
}

export function parseVoiceCommand(text: string): ParsedCommand {
    const normalizedText = text.toLowerCase().trim();

    const result: ParsedCommand = {
        isValid: false,
    };

    // 1. Detect Result (Winner vs Error)
    const isWinner = /(buena|ganadora|winner|punto|adentro)/i.test(normalizedText);
    const isError = /(mala|error|afuera|red|fuera)/i.test(normalizedText);

    if (isWinner && !isError) {
        result.pointType = 'winner';
    } else if (isError && !isWinner) {
        result.pointType = 'error';
    }

    // 2. Detect Shot Type & Hand
    const isDrive = /(drive|derecha)/i.test(normalizedText);
    const isReves = /(revés|reves)/i.test(normalizedText);

    const isVolea = /(volea)/i.test(normalizedText);
    const isBandeja = /(bandeja)/i.test(normalizedText);
    const isRemate = /(remate|smash)/i.test(normalizedText);

    // Hand resolution
    if (isDrive) {
        result.hand = 'drive';
    } else if (isReves) {
        result.hand = 'reves';
    }

    // Shot Type resolution
    if (isVolea) {
        result.shotType = 'volea';
    } else if (isBandeja) {
        result.shotType = 'bandeja';
    } else if (isRemate) {
        result.shotType = 'remate';
    } else if (isDrive || isReves) {
        // Default to fondo (groundstroke) if it's just drive or reves 
        result.shotType = 'fondo';
    }

    // Validation: A command is valid if we detected BOTH a pointType AND a hand/shot
    if (result.pointType && (result.hand || result.shotType)) {
        result.isValid = true;

        // Safety defaults for incomplete but 'valid' commands
        if (!result.hand) result.hand = 'drive'; // Default to drive if not specified but shot type was
        if (!result.shotType) result.shotType = 'fondo'; // Default to fondo if hand was specified but not shot type
    }

    return result;
}
