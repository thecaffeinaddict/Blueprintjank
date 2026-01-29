import {Layer} from "./classes/Layer.ts";

// Deck card backs are in Enhancers.png
export function getDeckBackPosition(deckName: string): { x: number, y: number } {
    // Deck backs in Enhancers.png - 7 columns, 5 rows
    const deckBackMap: Record<string, { x: number, y: number }> = {
        "Red Deck": { x: 0, y: 0 },
        "Blue Deck": { x: 1, y: 0 },
        "Yellow Deck": { x: 2, y: 0 },
        "Green Deck": { x: 3, y: 0 },
        "Black Deck": { x: 4, y: 0 },
        "Magic Deck": { x: 5, y: 0 },
        "Nebula Deck": { x: 6, y: 0 },
        "Ghost Deck": { x: 0, y: 1 },
        "Abandoned Deck": { x: 1, y: 1 },
        "Checkered Deck": { x: 2, y: 1 },
        "Zodiac Deck": { x: 3, y: 1 },
        "Painted Deck": { x: 4, y: 1 },
        "Anaglyph Deck": { x: 5, y: 1 },
        "Plasma Deck": { x: 6, y: 1 },
        "Erratic Deck": { x: 0, y: 2 }
    };
    return deckBackMap[deckName] || { x: 0, y: 0 };
}

// Stake chips/seals - these are in Enhancers.png based on seal positions
export function getStakeChipPosition(stakeName: string): { x: number, y: number } {
    // Stake chips use similar positions to seals in Enhancers.png
    const stakeChipMap: Record<string, { x: number, y: number }> = {
        "White Stake": { x: 0, y: 0 }, // Placeholder
        "Red Stake": { x: 5, y: 4 }, // Red Seal position
        "Green Stake": { x: 3, y: 0 }, // Placeholder
        "Black Stake": { x: 4, y: 0 }, // Placeholder
        "Blue Stake": { x: 6, y: 4 }, // Blue Seal position
        "Purple Stake": { x: 4, y: 4 }, // Purple Seal position
        "Orange Stake": { x: 2, y: 0 }, // Placeholder
        "Gold Stake": { x: 2, y: 0 } // Gold Seal position
    };
    return stakeChipMap[stakeName] || { x: 0, y: 0 };
}

export function createDeckBackLayer(deckName: string): Layer {
    const pos = getDeckBackPosition(deckName);
    return new Layer({
        pos,
        name: `${deckName} Back`,
        order: 0,
        source: 'images/Enhancers.png',
        rows: 5,
        columns: 7
    });
}

export function createStakeChipLayer(stakeName: string): Layer {
    const pos = getStakeChipPosition(stakeName);
    return new Layer({
        pos,
        name: `${stakeName} Chip`,
        order: 0,
        source: 'images/Enhancers.png',
        rows: 5,
        columns: 7
    });
}
