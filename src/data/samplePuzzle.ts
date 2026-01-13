/**
 * samplePuzzle.ts
 *
 * Test puzzle with 10 diverse categories for development and testing.
 * In production, puzzles would be fetched from an API or loaded from a larger dataset.
 */

import { Puzzle, Category } from '../types/game';

// =============================================================================
// CATEGORIES (Ordered by difficulty 1-10)
// =============================================================================

const fruits: Category = {
    id: 'cat-fruits',
    name: 'Fruits',
    difficulty: 1,
    items: [
        'Apple', 'Banana', 'Orange', 'Grape', 'Mango',
        'Pineapple', 'Strawberry', 'Watermelon', 'Peach', 'Cherry',
    ],
};

const countries: Category = {
    id: 'cat-countries',
    name: 'Countries',
    difficulty: 2,
    items: [
        'France', 'Japan', 'Brazil', 'Egypt', 'Canada',
        'Australia', 'Mexico', 'India', 'Spain', 'Italy',
    ],
};

const dogBreeds: Category = {
    id: 'cat-dogs',
    name: 'Dog Breeds',
    difficulty: 3,
    items: [
        'Labrador', 'Poodle', 'Bulldog', 'Beagle', 'Husky',
        'Boxer', 'Dalmatian', 'Chihuahua', 'Rottweiler', 'Collie',
    ],
};

const elements: Category = {
    id: 'cat-elements',
    name: 'Chemical Elements',
    difficulty: 4,
    items: [
        'Oxygen', 'Hydrogen', 'Carbon', 'Gold', 'Silver',
        'Iron', 'Copper', 'Helium', 'Neon', 'Zinc',
    ],
};

const greekGods: Category = {
    id: 'cat-greek-gods',
    name: 'Greek Gods',
    difficulty: 5,
    items: [
        'Zeus', 'Hera', 'Poseidon', 'Athena', 'Apollo',
        'Artemis', 'Hermes', 'Hades', 'Ares', 'Aphrodite',
    ],
};

const pasta: Category = {
    id: 'cat-pasta',
    name: 'Pasta Shapes',
    difficulty: 6,
    items: [
        'Spaghetti', 'Penne', 'Rigatoni', 'Fusilli', 'Linguine',
        'Fettuccine', 'Ravioli', 'Lasagna', 'Orzo', 'Farfalle',
    ],
};

const instruments: Category = {
    id: 'cat-instruments',
    name: 'Musical Instruments',
    difficulty: 7,
    items: [
        'Piano', 'Guitar', 'Violin', 'Drums', 'Flute',
        'Trumpet', 'Saxophone', 'Cello', 'Harp', 'Clarinet',
    ],
};

const gemstones: Category = {
    id: 'cat-gemstones',
    name: 'Gemstones',
    difficulty: 8,
    items: [
        'Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Amethyst',
        'Topaz', 'Opal', 'Pearl', 'Jade', 'Garnet',
    ],
};

const currencies: Category = {
    id: 'cat-currencies',
    name: 'World Currencies',
    difficulty: 9,
    items: [
        'Dollar', 'Euro', 'Pound', 'Yen', 'Peso',
        'Franc', 'Rupee', 'Won', 'Krona', 'Baht',
    ],
};

const dances: Category = {
    id: 'cat-dances',
    name: 'Types of Dance',
    difficulty: 10,
    items: [
        'Waltz', 'Tango', 'Salsa', 'Ballet', 'Foxtrot',
        'Rumba', 'Swing', 'Polka', 'Mambo', 'Samba',
    ],
};

// =============================================================================
// PUZZLE
// =============================================================================

export const SAMPLE_PUZZLE: Puzzle = {
    id: 'puzzle-sample-001',
    month: '2026-01',
    categories: [
        fruits,
        countries,
        dogBreeds,
        elements,
        greekGods,
        pasta,
        instruments,
        gemstones,
        currencies,
        dances,
    ],
};

// =============================================================================
// HELPERS (Useful for testing and debugging)
// =============================================================================

/**
 * Find which category an item belongs to.
 * Returns undefined if item not found in any category.
 */
export const findCategoryForItem = (
    puzzle: Puzzle,
    item: string
): Category | undefined => {
    return puzzle.categories.find((cat) => cat.items.includes(item));
};

/**
 * Get all 100 items as a flat array (useful for initializing game grid).
 */
export const getAllItems = (puzzle: Puzzle): string[] => {
    return puzzle.categories.flatMap((cat) => cat.items);
};

/**
 * Shuffle an array using Fisher-Yates algorithm.
 * Returns a new array, does not mutate original.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};