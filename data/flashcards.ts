
import { Flashcard } from "../types";

export const MOCK_FLASHCARDS: Flashcard[] = [
    {
        id: 'fc1',
        classLevel: '11',
        subject: 'Physics',
        chapter: 'Kinematics',
        front: 'Equation for displacement in nth second?',
        back: 'S_n = u + (a/2)(2n - 1)',
        mastered: false
    },
    {
        id: 'fc2',
        classLevel: '11',
        subject: 'Physics',
        chapter: 'Laws of Motion',
        front: 'Impulse formula?',
        back: 'J = F × Δt = Δp (Change in momentum)',
        mastered: false
    },
    {
        id: 'fc3',
        classLevel: '12',
        subject: 'Physics',
        chapter: 'Electrostatics',
        front: 'Electric Field due to infinite line charge?',
        back: 'E = λ / (2πε₀r)',
        mastered: false
    },
    {
        id: 'fc4',
        classLevel: '11',
        subject: 'Chemistry',
        chapter: 'Atomic Structure',
        front: 'Heisenberg Uncertainty Principle',
        back: 'Δx × Δp ≥ h / 4π',
        mastered: false
    },
    {
        id: 'fc5',
        classLevel: '12',
        subject: 'Chemistry',
        chapter: 'Solutions',
        front: 'Raoult\'s Law for volatile liquids',
        back: 'p_total = p_A°x_A + p_B°x_B',
        mastered: false
    },
    {
        id: 'fc6',
        classLevel: '11',
        subject: 'Maths',
        chapter: 'Trigonometry',
        front: 'sin(A+B) formula',
        back: 'sinAcosB + cosAsinB',
        mastered: false
    },
    {
        id: 'fc7',
        classLevel: '12',
        subject: 'Maths',
        chapter: 'Integration',
        front: '∫ tan(x) dx',
        back: 'ln|sec x| + C',
        mastered: false
    }
];
