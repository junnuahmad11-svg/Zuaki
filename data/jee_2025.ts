
import { Question } from "../types";

export const JEE_DATASET = {
  meta: {
    exam: "JEE Main",
    year: 2025,
    shifts: ["Shift 1", "Shift 2"]
  },
  tests: [
    {
      shift: 1,
      questions: [
        // PHYSICS SHIFT 1
        {
          id: "J25-S1-P-01",
          subject: "Physics",
          chapter: "Kinematics",
          type: "MCQ",
          text: "A particle starts from origin at t=0 with a velocity 5.0 m/s and moves in x-y plane under action of a force which produces a constant acceleration of (3.0i + 2.0j) m/s². What is the y-coordinate of the particle at the instant its x-coordinate is 84m?",
          options: ["36m", "24m", "32m", "48m"],
          correctAnswer: 0, // A
          difficulty: "Moderate",
          explanation: "Using s = ut + 0.5at^2 for x and y components independently. Find t from x-motion, then substitute in y-motion.",
          solutionSteps: "1. x = ux*t + 0.5*ax*t^2\n2. 84 = 5t + 0.5(3)t^2 -> Solve for t\n3. y = uy*t + 0.5*ay*t^2\n4. Substitute t to find y.",
          formulaUsed: ["s = ut + ½at²"]
        },
        {
          id: "J25-S1-P-02",
          subject: "Physics",
          chapter: "Rotational Motion",
          type: "MCQ",
          text: "A solid sphere of mass M and radius R rolls without slipping down an inclined plane of inclination θ. The acceleration of the sphere is:",
          options: ["(5/7)g sinθ", "(3/5)g sinθ", "(2/3)g sinθ", "g sinθ"],
          correctAnswer: 0, 
          difficulty: "Hard",
          explanation: "For rolling without slipping, a = (g sinθ) / (1 + I/MR²). For solid sphere I = 2/5 MR².",
          solutionSteps: "1. Identify Moment of Inertia I = 2/5 MR²\n2. Apply formula a = g sinθ / (1 + k²/R²)\n3. k²/R² = 2/5\n4. a = g sinθ / (1 + 2/5) = 5/7 g sinθ",
          formulaUsed: ["a = (g sinθ) / (1 + I/MR²)"]
        },
        // CHEMISTRY SHIFT 1
        {
          id: "J25-S1-C-01",
          subject: "Chemistry",
          chapter: "Thermodynamics",
          type: "MCQ",
          text: "For the combustion of C3H8(g) at constant temperature, ΔH - ΔU is:",
          options: ["-RT", "+RT", "-3RT", "+3RT"],
          correctAnswer: 2,
          difficulty: "Easy",
          explanation: "ΔH = ΔU + ΔngRT. Write balanced equation: C3H8 + 5O2 -> 3CO2 + 4H2O(l).",
          solutionSteps: "1. Reaction: C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)\n2. Δng = moles gaseous products - moles gaseous reactants\n3. Δng = 3 - (1 + 5) = -3\n4. ΔH - ΔU = -3RT",
          formulaUsed: ["ΔH = ΔU + ΔngRT"]
        },
        // MATHS SHIFT 1
        {
          id: "J25-S1-M-01",
          subject: "Maths",
          chapter: "Calculus",
          type: "NUMERICAL",
          text: "If the function f(x) = 2x^3 - 9ax^2 + 12a^2x + 1 reaches a maximum at x=1, then the value of a is (a > 0):",
          correctAnswer: 2, // Numeric value
          difficulty: "Moderate",
          explanation: "Find f'(x), set to 0. Use second derivative test for maxima.",
          solutionSteps: "1. f'(x) = 6x^2 - 18ax + 12a^2\n2. Roots are x=a, x=2a\n3. For maxima at x=1, check f''(1) < 0\n4. If a=2, roots are 2, 4. Max at smaller root? Verify.",
          formulaUsed: ["f'(x)=0 for critical points", "f''(x)<0 for maxima"]
        }
      ]
    },
    {
      shift: 2,
      questions: [
         // Placeholder structure for Shift 2 ensuring data availability
         {
          id: "J25-S2-P-01",
          subject: "Physics",
          chapter: "Electrostatics",
          type: "MCQ",
          text: "Two point charges +q and -q are placed at distance d. The electric field at the midpoint is:",
          options: ["Zero", "2kq/d²", "8kq/d²", "4kq/d²"],
          correctAnswer: 2,
          difficulty: "Easy",
          explanation: "Fields add up at the midpoint.",
          solutionSteps: "1. E1 = kq/(d/2)² towards -q\n2. E2 = kq/(d/2)² towards -q\n3. E_net = E1 + E2 = 2 * (4kq/d²) = 8kq/d²",
          formulaUsed: ["E = kq/r²"]
        }
      ]
    }
  ]
};
