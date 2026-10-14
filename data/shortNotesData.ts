
import { FullChapterNote } from "../types";

export const JEE_SHORT_NOTES: Record<string, Record<string, FullChapterNote>> = {
    Physics: {
        "Kinematics": {
            title: "Kinematics",
            subject: "Physics",
            sections: [
                {
                    heading: "Rectilinear Motion",
                    content: "Kinematics deals with the study of motion without considering the forces causing it. In rectilinear motion, a particle moves along a straight line.",
                    subsections: [
                        { title: "Distance vs Displacement", text: "Distance is the total path length covered (scalar). Displacement is the change in position vector (vector)." },
                        { title: "Average Velocity", text: "Ratio of total displacement to total time taken. v_avg = Δx / Δt." },
                        { title: "Instantaneous Velocity", text: "Velocity at a specific instant. v = dx/dt." },
                        { title: "Acceleration", text: "Rate of change of velocity. a = dv/dt = v(dv/dx)." }
                    ]
                },
                {
                    heading: "Projectile Motion",
                    content: "Motion in a plane with constant acceleration (g) in the vertical direction.",
                    subsections: [
                        { title: "Trajectory", text: "Path is parabolic. y = x tanθ - (gx²)/(2u²cos²θ)." }
                    ]
                }
            ],
            formulas: [
                { name: "First Eq", eq: "v = u + at" },
                { name: "Second Eq", eq: "s = ut + ½at²" },
                { name: "Third Eq", eq: "v² = u² + 2as" },
                { name: "Trajectory", eq: "y = x tanθ (1 - x/R)" },
                { name: "Range", eq: "R = (u² sin2θ)/g" }
            ],
            ncertPoints: [
                "Slope of x-t graph is velocity.",
                "Slope of v-t graph is acceleration.",
                "Area under v-t graph is displacement."
            ],
            examInsights: {
                weightage: "High (2-3 Qs)",
                commonMistakes: ["Sign conventions in gravity problems.", "Mixing horizontal and vertical components."],
                questionTypes: ["Graph analysis.", "River-Boat problems.", "Projectile on incline."]
            }
        },
        "Laws of Motion": {
            title: "Laws of Motion",
            subject: "Physics",
            sections: [
                {
                    heading: "Newton's Laws",
                    content: "Fundamental laws governing motion.",
                    subsections: [
                        { title: "First Law", text: "Law of Inertia. Body stays at rest/motion unless acted upon by force." },
                        { title: "Second Law", text: "F = dp/dt = ma (for constant mass)." },
                        { title: "Third Law", text: "Action and Reaction are equal and opposite." }
                    ]
                },
                {
                    heading: "Friction",
                    content: "Resistive force acting tangentially at interface.",
                    subsections: [
                        { title: "Static", text: "Self-adjusting. fs ≤ μsN." },
                        { title: "Kinetic", text: "Constant. fk = μkN." }
                    ]
                }
            ],
            formulas: [
                { name: "Force", eq: "F = ma" },
                { name: "Impulse", eq: "J = Δp = F_avg × Δt" },
                { name: "Friction", eq: "f = μN" },
                { name: "Banked Road", eq: "v = √(rg tanθ)" }
            ],
            ncertPoints: ["Inertia depends on mass.", "Action-reaction pair acts on different bodies."],
            examInsights: {
                weightage: "High (2 Qs)",
                commonMistakes: ["Forgetting pseudo force in non-inertial frames.", "Direction of friction."],
                questionTypes: ["Connected bodies (pulleys).", "Block on Block.", "Banking of roads."]
            }
        },
        "Work Energy Power": {
            title: "Work, Energy & Power",
            subject: "Physics",
            sections: [
                {
                    heading: "Work & Energy",
                    content: "Work is done when a force displaces an object.",
                    subsections: [
                        { title: "Work Done", text: "W = F.d = Fd cosθ. Area under F-x graph." },
                        { title: "Kinetic Energy", text: "KE = ½mv². Relation with momentum: KE = p²/2m." }
                    ]
                },
                {
                    heading: "Work Energy Theorem",
                    content: "Net work done by all forces equals change in kinetic energy.",
                    subsections: [
                        { title: "Statement", text: "W_net = ΔKE = Kf - Ki." },
                        { title: "Power", text: "Rate of doing work. P = dW/dt = F.v." }
                    ]
                }
            ],
            formulas: [
                { name: "Work", eq: "W = ∫ F.dr" },
                { name: "KE & Momentum", eq: "KE = p² / 2m" },
                { name: "Power", eq: "P = F.v" },
                { name: "Potential Energy", eq: "F = -dU/dx" }
            ],
            ncertPoints: ["Work done by conservative force depends only on end points.", "Power is scalar."],
            examInsights: {
                weightage: "Moderate (1-2 Qs)",
                commonMistakes: ["Ignoring work done by friction.", "Sign of potential energy change."],
                questionTypes: ["Vertical circular motion.", "Collisions (e < 1).", "Spring problems."]
            }
        },
        "Rotational Motion": {
            title: "Rotational Motion",
            subject: "Physics",
            sections: [
                { heading: "Basics", content: "Motion of rigid bodies.", subsections: [{ title: "Center of Mass", text: "R_cm = ΣmiRi / Σmi." }] },
                { heading: "Dynamics", content: "Torque causes rotation.", subsections: [{ title: "Torque", text: "τ = r × F = Iα." }, { title: "Angular Momentum", text: "L = r × p = Iω." }] }
            ],
            formulas: [
                { name: "Torque", eq: "τ = Iα" },
                { name: "Angular Momentum", eq: "L = Iω" },
                { name: "Rotational KE", eq: "K = ½Iω²" },
                { name: "Rolling Acc", eq: "a = g sinθ / (1 + I/MR²)" }
            ],
            ncertPoints: ["For pure rolling, v = Rω at contact point.", "Angular momentum conserved if τ_ext = 0."],
            examInsights: {
                weightage: "Very High (3 Qs)",
                commonMistakes: ["Axis of rotation for Moment of Inertia.", "Direction of friction in rolling."],
                questionTypes: ["Toppling", "Conservation of L", "Rolling on incline"]
            }
        },
        "Gravitation": {
            title: "Gravitation",
            subject: "Physics",
            sections: [
                { heading: "Newton's Law", content: "Every particle attracts every other particle.", subsections: [{ title: "Force", text: "F = Gm1m2/r²." }] },
                { heading: "Planetary Motion", content: "Kepler's Laws describe orbital motion.", subsections: [{ title: "Kepler's 3rd Law", text: "T² ∝ r³." }, { title: "Escape Velocity", text: "Minimum velocity to escape gravity." }] }
            ],
            formulas: [
                { name: "Gravitational Force", eq: "F = GMm/r²" },
                { name: "g at height h", eq: "g' = g(1 - 2h/R)" },
                { name: "Escape Velocity", eq: "ve = √(2GM/R)" },
                { name: "Orbital Velocity", eq: "vo = √(GM/r)" }
            ],
            ncertPoints: ["g decreases with depth and height.", "Potential is scalar, Field is vector."],
            examInsights: {
                weightage: "Moderate (1-2 Qs)",
                commonMistakes: ["Confusing potential energy (-GMm/r) with potential (-GM/r)."],
                questionTypes: ["Variation of g.", "Satellite energy.", "Kepler's laws."]
            }
        },
        "Solids & Fluids": {
            title: "Properties of Solids & Fluids",
            subject: "Physics",
            sections: [
                { heading: "Solids", content: "Elasticity.", subsections: [{ title: "Hooke's Law", text: "Stress ∝ Strain. Y = Stress/Strain." }] },
                { heading: "Fluids", content: "Hydrostatics & Dynamics.", subsections: [{ title: "Bernoulli's", text: "P + ½ρv² + ρgh = Constant." }, { title: "Viscosity", text: "Stokes Law: F = 6πηrv." }] }
            ],
            formulas: [
                { name: "Young's Modulus", eq: "Y = FL / AΔL" },
                { name: "Bernoulli", eq: "P + ½ρv² + ρgh = K" },
                { name: "Terminal Velocity", eq: "vt = 2r²(ρ-σ)g / 9η" },
                { name: "Capillary Rise", eq: "h = 2Tcosθ / rρg" }
            ],
            ncertPoints: ["Surface tension forces minimize surface area.", "Viscosity is internal friction."],
            examInsights: {
                weightage: "Moderate (2 Qs)",
                commonMistakes: ["Units of pressure.", "Contact angle in capillary."],
                questionTypes: ["Thermal expansion.", "Bernoulli applications.", "Young's modulus."]
            }
        },
        "Thermodynamics": {
            title: "Thermodynamics",
            subject: "Physics",
            sections: [
                { heading: "Laws", content: "Heat and Work.", subsections: [{ title: "First Law", text: "ΔQ = ΔU + ΔW." }, { title: "Processes", text: "Isobaric, Isochoric, Isothermal, Adiabatic." }] },
                { heading: "Engines", content: "Conversion of heat to work.", subsections: [{ title: "Carnot Engine", text: "Efficiency η = 1 - T2/T1." }] }
            ],
            formulas: [
                { name: "First Law", eq: "dQ = dU + dW" },
                { name: "Work (IsoT)", eq: "nRT ln(V2/V1)" },
                { name: "Work (Adia)", eq: "(P1V1 - P2V2)/(γ-1)" },
                { name: "Efficiency", eq: "η = 1 - Tc/Th" }
            ],
            ncertPoints: ["Internal energy depends only on T for ideal gas.", "Adiabatic: PV^γ = K."],
            examInsights: {
                weightage: "High (2-3 Qs)",
                commonMistakes: ["Sign of work done.", "Degrees of freedom f."],
                questionTypes: ["Graph conversion.", "Efficiency calculation.", "Mixture of gases."]
            }
        },
        "SHM & Waves": {
            title: "Oscillations & Waves",
            subject: "Physics",
            sections: [
                { heading: "SHM", content: "Periodic motion.", subsections: [{ title: "Equation", text: "x = A sin(ωt + φ). a = -ω²x." }] },
                { heading: "Waves", content: "Energy transport.", subsections: [{ title: "Equation", text: "y = A sin(kx - ωt)." }, { title: "Doppler", text: "Frequency shift due to relative motion." }] }
            ],
            formulas: [
                { name: "Time Period", eq: "T = 2π √(m/k)" },
                { name: "Wave Velocity", eq: "v = ω/k = fλ" },
                { name: "Doppler Effect", eq: "f' = f(v±vo)/(v∓vs)" },
                { name: "Beats", eq: "f_beat = |f1 - f2|" }
            ],
            ncertPoints: ["Resonance occurs when driving freq equals natural freq.", "Sound is longitudinal."],
            examInsights: {
                weightage: "Moderate (2 Qs)",
                commonMistakes: ["Phase difference calculation.", "Signs in Doppler formula."],
                questionTypes: ["Spring-block systems.", "Organ pipes.", "Beats."]
            }
        },
        "Electrostatics": {
            title: "Electrostatics",
            subject: "Physics",
            sections: [
                { heading: "Fields", content: "Static Charges.", subsections: [{ title: "Coulomb's Law", text: "F = kq1q2/r²." }, { title: "Gauss Law", text: "Flux = q_in / ε₀." }] },
                { heading: "Potential", content: "Work done per unit charge.", subsections: [{ title: "Relation", text: "E = -dV/dr." }] }
            ],
            formulas: [
                { name: "Field (Point)", eq: "E = kq/r²" },
                { name: "Potential", eq: "V = kq/r" },
                { name: "Dipole Field", eq: "E_axial = 2kp/r³" },
                { name: "Capacitance", eq: "C = ε₀A/d" }
            ],
            ncertPoints: ["Field lines never cross.", "Conductor interior E = 0."],
            examInsights: { weightage: "High (3 Qs)", commonMistakes: ["Scalar vs Vector addn.", "Gaussian surface choice."], questionTypes: ["Flux.", "Dipole.", "Capacitor circuits."] }
        },
        "Current Electricity": {
            title: "Current Electricity",
            subject: "Physics",
            sections: [
                { heading: "Ohm's Law", content: "V = IR.", subsections: [{ title: "Drift Velocity", text: "vd = I / neA." }] },
                { heading: "Circuits", content: "Kirchhoff's Laws.", subsections: [{ title: "KCL", text: "ΣI = 0 (Charge cons)." }, { title: "KVL", text: "ΣV = 0 (Energy cons)." }] }
            ],
            formulas: [
                { name: "Drift Velocity", eq: "vd = eEτ/m" },
                { name: "Power", eq: "P = VI = I²R" },
                { name: "Potentiometer", eq: "E1/E2 = l1/l2" },
                { name: "Wheatstone", eq: "R1/R2 = R3/R4" }
            ],
            ncertPoints: ["Resistivity depends on material and T.", "Cells in series/parallel."],
            examInsights: { weightage: "High (3 Qs)", commonMistakes: ["Internal resistance.", "Galvanometer conversion."], questionTypes: ["KVL/KCL.", "Meter Bridge.", "Power."] }
        },
        "Magnetism": {
            title: "Magnetic Effects",
            subject: "Physics",
            sections: [
                { heading: "Force", content: "Lorentz Force.", subsections: [{ title: "Moving Charge", text: "F = q(v × B)." }, { title: "Current Wire", text: "F = I(l × B)." }] },
                { heading: "Sources", content: "Biot-Savart Law.", subsections: [{ title: "Wire", text: "B = μ₀I/2πr (Infinite)." }] }
            ],
            formulas: [
                { name: "Lorentz Force", eq: "F = q(v×B)" },
                { name: "Cyclotron Radius", eq: "r = mv/qB" },
                { name: "B (Solenoid)", eq: "B = μ₀nI" },
                { name: "Ampere's Law", eq: "∮ B.dl = μ₀I_in" }
            ],
            ncertPoints: ["Work done by magnetic force is zero.", "Magnetic field lines form closed loops."],
            examInsights: { weightage: "High (2-3 Qs)", commonMistakes: ["Direction (Right Hand Rule).", "Unit conversions."], questionTypes: ["Path of particle.", "Force between wires.", "Galvanometer."] }
        },
        "EMI & AC": {
            title: "EMI & AC",
            subject: "Physics",
            sections: [
                { heading: "Induction", content: "Faraday's Law.", subsections: [{ title: "Flux Change", text: "ε = -dΦ/dt." }, { title: "Lenz Law", text: "Direction opposes cause." }] },
                { heading: "AC Circuits", content: "Alternating Current.", subsections: [{ title: "Impedance", text: "Z = √(R² + (Xl-Xc)²)." }, { title: "Resonance", text: "Xl = Xc." }] }
            ],
            formulas: [
                { name: "EMF", eq: "ε = -N dΦ/dt" },
                { name: "Self Inductance", eq: "L = μ₀n²Al" },
                { name: "RMS Current", eq: "I_rms = I₀/√2" },
                { name: "Resonance Freq", eq: "f = 1/(2π√LC)" }
            ],
            ncertPoints: ["Transformer principle.", "Power factor cosφ = R/Z."],
            examInsights: { weightage: "Moderate (2 Qs)", commonMistakes: ["Phase difference.", "Motional EMF direction."], questionTypes: ["LCR circuits.", "Mutual inductance.", "Power in AC."] }
        },
        "Optics": {
            title: "Ray & Wave Optics",
            subject: "Physics",
            sections: [
                { heading: "Ray", content: "Reflection/Refraction.", subsections: [{ title: "Snell's Law", text: "μ1 sin i = μ2 sin r." }] },
                { heading: "Wave", content: "Interference.", subsections: [{ title: "YDSE", text: "Fringe width β = Dλ/d." }] }
            ],
            formulas: [
                { name: "Mirror Eq", eq: "1/v + 1/u = 1/f" },
                { name: "Lens Eq", eq: "1/v - 1/u = 1/f" },
                { name: "Prism", eq: "μ = sin((A+δm)/2)/sin(A/2)" },
                { name: "Malus Law", eq: "I = I₀ cos²θ" }
            ],
            ncertPoints: ["TIR conditions.", "Resolving power."],
            examInsights: { weightage: "High (3 Qs)", commonMistakes: ["Sign convention.", "Path difference."], questionTypes: ["Lens combinations.", "Prism.", "YDSE."] }
        },
        "Modern Physics": {
            title: "Modern Physics",
            subject: "Physics",
            sections: [
                { heading: "Dual Nature", content: "Photoelectric Effect.", subsections: [{ title: "Einstein Eq", text: "K_max = hν - Φ." }] },
                { heading: "Atoms", content: "Bohr Model.", subsections: [{ title: "Energy", text: "En = -13.6 Z²/n² eV." }] }
            ],
            formulas: [
                { name: "De Broglie", eq: "λ = h/p" },
                { name: "Radioactivity", eq: "N = N₀ e^(-λt)" },
                { name: "Half Life", eq: "T = 0.693/λ" },
                { name: "Mass Defect", eq: "E = Δmc²" }
            ],
            ncertPoints: ["Stopping potential.", "Nuclear density constant."],
            examInsights: { weightage: "High (3-4 Qs)", commonMistakes: ["eV to Joules.", "Isotopes."], questionTypes: ["Transitions.", "Binding Energy.", "Decay."] }
        }
    },
    Chemistry: {
        "Mole Concept": {
            title: "Mole Concept",
            subject: "Chemistry",
            sections: [
                { heading: "Basics", content: "Stoichiometry.", subsections: [{ title: "Mole", text: "6.022 × 10²³ entities." }, { title: "Molarity", text: "Moles of solute / Vol of sol (L)." }] },
                { heading: "Reactions", content: "Limiting Reagent.", subsections: [{ title: "LR", text: "Reactant consumed first determines product." }] }
            ],
            formulas: [
                { name: "Moles", eq: "n = Mass / Molar Mass" },
                { name: "Molarity", eq: "M = n / V(L)" },
                { name: "Molality", eq: "m = n / Mass_solvent(kg)" },
                { name: "Normality", eq: "N = n × n-factor / V" }
            ],
            ncertPoints: ["Avogadro's Law.", "Concentration terms."],
            examInsights: { weightage: "Moderate (1-2 Qs)", commonMistakes: ["n-factor calculation.", "Units of volume."], questionTypes: ["Stoichiometry.", "Empirical formula.", "Concentration."] }
        },
        "Atomic Structure": {
            title: "Atomic Structure",
            subject: "Chemistry",
            sections: [
                { heading: "Models", content: "Bohr & Quantum.", subsections: [{ title: "Bohr", text: "Quantized orbits." }, { title: "Quantum Numbers", text: "n, l, m, s describe electron state." }] },
                { heading: "Principles", content: "Rules for filling.", subsections: [{ title: "Aufbau", text: "Lower energy first." }, { title: "Pauli", text: "Unique set of 4 QNs." }] }
            ],
            formulas: [
                { name: "Radius", eq: "rn = 0.529 n²/Z Å" },
                { name: "Energy", eq: "En = -13.6 Z²/n² eV" },
                { name: "Wavelength", eq: "1/λ = RZ²(1/n1² - 1/n2²)" },
                { name: "Heisenberg", eq: "Δx.Δp ≥ h/4π" }
            ],
            ncertPoints: ["Shapes of orbitals.", "Nodes."],
            examInsights: { weightage: "Moderate (2 Qs)", commonMistakes: ["Unit of R.", "Nodes counting."], questionTypes: ["Quantum numbers.", "Electronic config.", "Spectrum."] }
        },
        "Chemical Bonding": {
            title: "Chemical Bonding",
            subject: "Chemistry",
            sections: [
                { heading: "Theories", content: "VBT & MOT.", subsections: [{ title: "Hybridization", text: "Mixing of orbitals." }, { title: "MOT", text: "Bond Order = (Nb-Na)/2." }] },
                { heading: "VSEPR", content: "Shape prediction.", subsections: [{ title: "Repulsion", text: "LP-LP > LP-BP > BP-BP." }] }
            ],
            formulas: [
                { name: "Bond Order", eq: "BO = ½(Nb - Na)" },
                { name: "Dipole Moment", eq: "μ = q × d" },
                { name: "Formal Charge", eq: "V - L - ½S" }
            ],
            ncertPoints: ["Hydrogen bonding.", "Resonance."],
            examInsights: { weightage: "High (3 Qs)", commonMistakes: ["Geometry vs Shape.", "Paramagnetism of O2."], questionTypes: ["Hybridization.", "MOT.", "Dipole moment."] }
        },
        "States of Matter": {
            title: "States of Matter",
            subject: "Chemistry",
            sections: [
                { heading: "Gases", content: "Ideal & Real.", subsections: [{ title: "Ideal Gas", text: "PV = nRT." }, { title: "Real Gas", text: "Van der Waals equation." }] },
                { heading: "Liquids", content: "Intermolecular forces.", subsections: [{ title: "Vapor Pressure", text: "Pressure exerted by vapor in equilibrium." }] }
            ],
            formulas: [
                { name: "Ideal Gas", eq: "PV = nRT" },
                { name: "Dalton Law", eq: "P_total = ΣPi" },
                { name: "RMS Speed", eq: "u = √(3RT/M)" },
                { name: "Compressibility", eq: "Z = PV/nRT" }
            ],
            ncertPoints: ["Maxwell distribution.", "Critical constants."],
            examInsights: { weightage: "Low (1 Q)", commonMistakes: ["Units of R.", "Z deviation."], questionTypes: ["Gas laws.", "Diffusion.", "Real gas deviation."] }
        },
        "Thermodynamics (Chem)": {
            title: "Thermodynamics",
            subject: "Chemistry",
            sections: [
                { heading: "Laws", content: "Energy changes.", subsections: [{ title: "First Law", text: "ΔU = q + w." }, { title: "Second Law", text: "ΔS_univ > 0 for spontaneous." }] },
                { heading: "Enthalpy", content: "Heat content.", subsections: [{ title: "Hess Law", text: "Constant heat summation." }] }
            ],
            formulas: [
                { name: "Enthalpy", eq: "ΔH = ΔU + ΔngRT" },
                { name: "Gibbs Energy", eq: "ΔG = ΔH - TΔS" },
                { name: "Work", eq: "w = -Pext ΔV" },
                { name: "Entropy", eq: "ΔS = q_rev/T" }
            ],
            ncertPoints: ["State functions vs Path functions.", "Sign convention of w."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Sign of w.", "Spontaneity condition."], questionTypes: ["Hess law.", "Entropy change.", "Gibbs energy."] }
        },
        "Equilibrium": {
            title: "Equilibrium",
            subject: "Chemistry",
            sections: [
                { heading: "Chemical", content: "Keq.", subsections: [{ title: "Kp vs Kc", text: "Kp = Kc(RT)^Δng." }] },
                { heading: "Ionic", content: "Acids/Bases.", subsections: [{ title: "pH", text: "-log[H+]." }, { title: "Buffer", text: "Resists pH change." }] }
            ],
            formulas: [
                { name: "Kp Kc Relation", eq: "Kp = Kc(RT)^Δng" },
                { name: "pH", eq: "-log[H+]" },
                { name: "Henderson", eq: "pH = pKa + log(S/A)" },
                { name: "Ksp", eq: "Product of ion conc" }
            ],
            ncertPoints: ["Le Chatelier Principle.", "Common Ion Effect."],
            examInsights: { weightage: "High (2-3 Qs)", commonMistakes: ["Ignoring water in Ksp.", "Buffer range."], questionTypes: ["pH calc.", "Solubility.", "Kp/Kc."] }
        },
        "Redox": {
            title: "Redox Reactions",
            subject: "Chemistry",
            sections: [
                { heading: "Concepts", content: "Oxidation & Reduction.", subsections: [{ title: "Oxidation Number", text: "Charge on atom." }, { title: "Balancing", text: "Ion-electron method." }] }
            ],
            formulas: [
                { name: "N-factor", eq: "Change in OS per mol" },
                { name: "Titration", eq: "N1V1 = N2V2" }
            ],
            ncertPoints: ["Types of redox.", "Disproportionation."],
            examInsights: { weightage: "Low (1 Q)", commonMistakes: ["Balancing charge.", "n-factor."], questionTypes: ["Balancing.", "Titration.", "Oxidation state."] }
        },
        "Solid State": {
            title: "Solid State",
            subject: "Chemistry",
            sections: [
                { heading: "Lattice", content: "Unit cells.", subsections: [{ title: "Types", text: "SCC, BCC, FCC." }, { title: "Packing", text: "Efficiency: FCC > BCC > SCC." }] },
                { heading: "Defects", content: "Imperfections.", subsections: [{ title: "Schottky", text: "Missing ions." }, { title: "Frenkel", text: "Displaced ions." }] }
            ],
            formulas: [
                { name: "Density", eq: "d = ZM / (a³ Na)" },
                { name: "Packing Eff", eq: "FCC: 74%, BCC: 68%" },
                { name: "Radius Ratio", eq: "r+/r-" }
            ],
            ncertPoints: ["Bragg's Law.", "Magnetic properties."],
            examInsights: { weightage: "Moderate (1-2 Qs)", commonMistakes: ["Coordination number.", "Edge length relation."], questionTypes: ["Density.", "Void location.", "Defects."] }
        },
        "Solutions": {
            title: "Solutions",
            subject: "Chemistry",
            sections: [
                { heading: "Colligative Properties", content: "Depend on number of particles.", subsections: [{ title: "RLVP", text: "Relative Lowering of Vapor Pressure." }, { title: "Osmotic Pressure", text: "π = iCRT." }] }
            ],
            formulas: [
                { name: "Raoult's Law", eq: "P = P⁰x" },
                { name: "Elev in BP", eq: "ΔTb = i Kb m" },
                { name: "Dep in FP", eq: "ΔTf = i Kf m" },
                { name: "Van't Hoff", eq: "i = 1 + (n-1)α" }
            ],
            ncertPoints: ["Ideal vs Non-ideal.", "Azeotropes."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Van't hoff factor.", "Molality vs Molarity."], questionTypes: ["Colligative properties.", "Raoult's law."] }
        },
        "Electrochemistry": {
            title: "Electrochemistry",
            subject: "Chemistry",
            sections: [
                { heading: "Cells", content: "Galvanic & Electrolytic.", subsections: [{ title: "Nernst Eq", text: "E = E⁰ - (RT/nF)lnQ." }] },
                { heading: "Conductance", content: "Ions in solution.", subsections: [{ title: "Kohlrausch Law", text: "Limiting molar conductivity." }] }
            ],
            formulas: [
                { name: "Nernst Eq", eq: "E = E⁰ - 0.059/n logQ" },
                { name: "Gibbs Energy", eq: "ΔG = -nFE" },
                { name: "Faraday Law", eq: "w = ZIt" },
                { name: "Conductivity", eq: "Λm = k × 1000 / M" }
            ],
            ncertPoints: ["Fuel cells.", "Batteries."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Sign of E_cell.", "Units of Lambda."], questionTypes: ["Nernst.", "Faraday laws.", "Conductance."] }
        },
        "Chemical Kinetics": {
            title: "Chemical Kinetics",
            subject: "Chemistry",
            sections: [
                { heading: "Rate", content: "Speed of reaction.", subsections: [{ title: "Order", text: "Sum of powers in rate law." }, { title: "Molecularity", text: "Colliding species." }] },
                { heading: "Arrhenius", content: "Temp dependence.", subsections: [{ title: "Equation", text: "k = A e^(-Ea/RT)." }] }
            ],
            formulas: [
                { name: "First Order", eq: "k = (2.303/t) log(a/a-x)" },
                { name: "Half Life (1st)", eq: "t½ = 0.693/k" },
                { name: "Arrhenius", eq: "log k = log A - Ea/2.303RT" }
            ],
            ncertPoints: ["Collision theory.", "Catalyst effect."],
            examInsights: { weightage: "Moderate (2 Qs)", commonMistakes: ["Order vs Molecularity.", "Units of k."], questionTypes: ["Integrated rate law.", "Activation energy.", "Graphs."] }
        },
        "Surface Chemistry": {
            title: "Surface Chemistry",
            subject: "Chemistry",
            sections: [
                { heading: "Adsorption", content: "Surface phenomenon.", subsections: [{ title: "Types", text: "Physisorption vs Chemisorption." }] },
                { heading: "Colloids", content: "Heterogeneous system.", subsections: [{ title: "Properties", text: "Tyndall effect, Brownian motion." }] }
            ],
            formulas: [
                { name: "Freundlich", eq: "x/m = k p^(1/n)" },
                { name: "Hardy Schulze", eq: "Coagulation power ∝ valency" }
            ],
            ncertPoints: ["Emulsions.", "Catalysis."],
            examInsights: { weightage: "Low (1 Q)", commonMistakes: ["Adsorption isotherm graph."], questionTypes: ["Colloid types.", "Adsorption characteristics."] }
        },
        "Periodic Table": {
            title: "Periodic Properties",
            subject: "Chemistry",
            sections: [
                { heading: "Trends", content: "Variation across period/group.", subsections: [{ title: "Radius", text: "Decreases L-R, Increases T-B." }, { title: "Ionization En", text: "Increases L-R, Decreases T-B." }] }
            ],
            formulas: [
                { name: "Z_eff", eq: "Z - σ (Slater)" },
                { name: "EN (Pauling)", eq: "XA - XB = 0.208√Δ" }
            ],
            ncertPoints: ["Exceptions in IE (N>O, Be>B).", "Electron Gain En."],
            examInsights: { weightage: "Moderate (1-2 Qs)", commonMistakes: ["Exceptions.", "Isoelectronic species."], questionTypes: ["Ordering properties.", "Nature of oxides."] }
        },
        "Metallurgy": {
            title: "Metallurgy",
            subject: "Chemistry",
            sections: [
                { heading: "Processes", content: "Extraction.", subsections: [{ title: "Concentration", text: "Froth floatation, Leaching." }, { title: "Reduction", text: "Smelting, Electrolysis." }] },
                { heading: "Refining", content: "Purification.", subsections: [{ title: "Zone Refining", text: "Semiconductors." }, { title: "Vapor Phase", text: "Mond's, Van Arkel." }] }
            ],
            formulas: [
                { name: "Ellingham", eq: "ΔG vs T plots" }
            ],
            ncertPoints: ["Ores formulas.", "Blast furnace."],
            examInsights: { weightage: "Low (1 Q)", commonMistakes: ["Ores composition."], questionTypes: ["Process identification.", "Ores matching."] }
        },
        "p-Block": {
            title: "p-Block Elements",
            subject: "Chemistry",
            sections: [
                { heading: "Group 13-18", content: "Trends and Compounds.", subsections: [{ title: "Boron Family", text: "Banana bond in B2H6." }, { title: "Noble Gases", text: "Xe compounds." }] }
            ],
            formulas: [
                { name: "Structure", eq: "Hybridization of XeF4, etc" }
            ],
            ncertPoints: ["Inert pair effect.", "Allotropy."],
            examInsights: { weightage: "High (3 Qs)", commonMistakes: ["Structures of oxyacids."], questionTypes: ["Reaction completion.", "Structure/Shape.", "Acidic strength."] }
        },
        "d-Block": {
            title: "d & f Block",
            subject: "Chemistry",
            sections: [
                { heading: "Transition Metals", content: "Variable valency, Colored ions.", subsections: [{ title: "KMnO4/K2Cr2O7", text: "Preparation and properties." }] },
                { heading: "Lanthanoids", content: "Contraction.", subsections: [{ title: "Consequences", text: "Similar radii of 4d/5d." }] }
            ],
            formulas: [
                { name: "Magnetic", eq: "μ = √n(n+2)" }
            ],
            ncertPoints: ["Catalytic properties.", "Alloy formation."],
            examInsights: { weightage: "Moderate (2 Qs)", commonMistakes: ["Electronic config exceptions."], questionTypes: ["KMnO4 reactions.", "Lanthanoid contraction."] }
        },
        "Coordination Compounds": {
            title: "Coordination Compounds",
            subject: "Chemistry",
            sections: [
                { heading: "Theories", content: "Werner, VBT, CFT.", subsections: [{ title: "IUPAC", text: "Naming rules." }, { title: "Isomerism", text: "Structural & Stereo." }] }
            ],
            formulas: [
                { name: "EAN", eq: "Z - OS + 2(CN)" },
                { name: "CFSE", eq: "(-0.4t2g + 0.6eg)Δo" }
            ],
            ncertPoints: ["Spectrochemical series.", "Synergic bonding."],
            examInsights: { weightage: "High (3 Qs)", commonMistakes: ["Hybridization.", "Unpaired electrons."], questionTypes: ["IUPAC.", "Isomers.", "Crystal Field."] }
        },
        "GOC": {
            title: "GOC",
            subject: "Chemistry",
            sections: [
                { heading: "Effects", content: "Inductive, Resonance, Hyperconj.", subsections: [{ title: "Stability", text: "Carbocation, Carbanion." }] },
                { heading: "Acidity/Basicity", content: "Order determination.", subsections: [{ title: "Aromaticity", text: "Huckel's Rule." }] }
            ],
            formulas: [],
            ncertPoints: ["Purification methods.", "Isomerism."],
            examInsights: { weightage: "High (3-4 Qs)", commonMistakes: ["Resonance priority.", "Aromaticity check."], questionTypes: ["Stability order.", "Acid/Base strength.", "IUPAC."] }
        },
        "Hydrocarbons": {
            title: "Hydrocarbons",
            subject: "Chemistry",
            sections: [
                { heading: "Alkanes", content: "Free radical sub.", subsections: [{ title: "Wurtz", text: "Dimerization." }] },
                { heading: "Alkenes/Alkynes", content: "Electrophilic addition.", subsections: [{ title: "Markovnikov", text: "Stable carbocation." }] },
                { heading: "Aromatic", content: "EAS.", subsections: [{ title: "Friedel Crafts", text: "Alkylation/Acylation." }] }
            ],
            formulas: [],
            ncertPoints: ["Ozonolysis.", "Acidic H in alkynes."],
            examInsights: { weightage: "High (2-3 Qs)", commonMistakes: ["Rearrangements.", "Directors (o/p/m)."], questionTypes: ["Reaction mechanism.", "Conversions."] }
        },
        "Haloalkanes": {
            title: "Haloalkanes & Haloarenes",
            subject: "Chemistry",
            sections: [
                { heading: "SN1/SN2", content: "Nucleophilic substitution.", subsections: [{ title: "SN1", text: "Carbocation, Racemization." }, { title: "SN2", text: "Inversion, Steric hindrance." }] },
                { heading: "Elimination", content: "E1/E2.", subsections: [{ title: "Saytzeff", text: "More substituted alkene." }] }
            ],
            formulas: [],
            ncertPoints: ["Grignard reagent.", "Polyhalogen compounds."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Solvent effect.", "Stereochemistry."], questionTypes: ["SN1 vs SN2 order.", "Name reactions."] }
        },
        "Alcohol Phenol Ether": {
            title: "Alcohols, Phenols & Ethers",
            subject: "Chemistry",
            sections: [
                { heading: "Alcohols", content: "Prep & Props.", subsections: [{ title: "Lucas Test", text: "Distinguish 1/2/3 alcohols." }] },
                { heading: "Phenols", content: "Acidity, Reimer-Tiemann.", subsections: [{ title: "Electrophilic Sub", text: "Nitration, Halogenation." }] },
                { heading: "Ethers", content: "Williamson Synthesis.", subsections: [{ title: "Cleavage", text: "HI reaction." }] }
            ],
            formulas: [],
            ncertPoints: ["Commercial alcohols.", "Acidic nature."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Reaction with HI.", "Acidity order."], questionTypes: ["Mechanism.", "Identification tests."] }
        },
        "Aldehydes Ketones": {
            title: "Aldehydes & Ketones",
            subject: "Chemistry",
            sections: [
                { heading: "Nucleophilic Addn", content: "HCN, Grignard.", subsections: [{ title: "Reactivity", text: "Aldehyde > Ketone." }] },
                { heading: "Name Reactions", content: "Aldol, Cannizzaro.", subsections: [{ title: "Aldol", text: "Alpha-H required." }, { title: "Cannizzaro", text: "No Alpha-H." }] }
            ],
            formulas: [],
            ncertPoints: ["Oxidation (Tollens/Fehling).", "Reduction (Clemmensen/Wolff)."],
            examInsights: { weightage: "High (2-3 Qs)", commonMistakes: ["Aldol product structure.", "Tests distinction."], questionTypes: ["Conversions.", "Distinction tests.", "Acidity of alpha-H."] }
        },
        "Amines": {
            title: "Amines",
            subject: "Chemistry",
            sections: [
                { heading: "Basicity", content: "Gas vs Aqueous.", subsections: [{ title: "Order", text: "Depends on solvation/steric." }] },
                { heading: "Reactions", content: "Diazotization.", subsections: [{ title: "Hoffmann Bromamide", text: "Step down." }, { title: "Carbylamine", text: "Test for 1-amine." }] }
            ],
            formulas: [],
            ncertPoints: ["Diazonium salts.", "Hinsberg test."],
            examInsights: { weightage: "Moderate (1-2 Qs)", commonMistakes: ["Basicity trends.", "Test identification."], questionTypes: ["Basicity.", "Name reactions.", "Coupling."] }
        }
    },
    Maths: {
        "Sets & Relations": {
            title: "Sets, Relations & Functions",
            subject: "Maths",
            sections: [
                { heading: "Sets", content: "Collection of objects.", subsections: [{ title: "Operations", text: "Union, Intersection, Diff." }] },
                { heading: "Relations", content: "Types.", subsections: [{ title: "Equivalence", text: "Reflexive, Symmetric, Transitive." }] },
                { heading: "Functions", content: "Mapping.", subsections: [{ title: "Domain/Range", text: "Valid inputs/outputs." }, { title: "Types", text: "One-one, Onto, Inverse." }] }
            ],
            formulas: [
                { name: "Union", eq: "n(AUB) = n(A)+n(B)-n(AnB)" },
                { name: "Power Set", eq: "2^n" }
            ],
            ncertPoints: ["Venn diagrams.", "Composition of functions."],
            examInsights: { weightage: "Moderate (2 Qs)", commonMistakes: ["Domain of composite func.", "Relation check."], questionTypes: ["Equivalence relation.", "Domain/Range.", "Inverse."] }
        },
        "Trigonometry": {
            title: "Trigonometry",
            subject: "Maths",
            sections: [
                { heading: "Identities", content: "Basic formulas.", subsections: [{ title: "Sum/Diff", text: "sin(A+B), etc." }] },
                { heading: "Equations", content: "General solutions.", subsections: [{ title: "sin x = sin y", text: "x = nπ + (-1)^n y." }] }
            ],
            formulas: [
                { name: "sin(A+B)", eq: "sAcB + cAsB" },
                { name: "cos(2A)", eq: "c² - s²" },
                { name: "Sine Rule", eq: "a/sinA = 2R" },
                { name: "Cosine Rule", eq: "a² = b²+c²-2bc cosA" }
            ],
            ncertPoints: ["Principal values.", "Heights and distances."],
            examInsights: { weightage: "Moderate (1-2 Qs)", commonMistakes: ["Quadrant signs.", "General solution range."], questionTypes: ["Identities simplification.", "Solutions of eq.", "Triangle properties."] }
        },
        "Quadratic Equations": {
            title: "Quadratic Equations",
            subject: "Maths",
            sections: [
                { heading: "Roots", content: "ax² + bx + c = 0.", subsections: [{ title: "Sum/Product", text: "S = -b/a, P = c/a." }, { title: "Nature", text: "D = b² - 4ac." }] },
                { heading: "Location", content: "Conditions for roots.", subsections: [{ title: "Both positive", text: "D≥0, S>0, P>0." }] }
            ],
            formulas: [
                { name: "Roots", eq: "(-b ± √D) / 2a" },
                { name: "Newton's Sum", eq: "aSn + bSn-1 + cSn-2 = 0" }
            ],
            ncertPoints: ["Common roots.", "Graph of parabola."],
            examInsights: { weightage: "Moderate (1-2 Qs)", commonMistakes: ["Sign of D.", "Condition inequalities."], questionTypes: ["Nature of roots.", "Common root.", "Location of roots."] }
        },
        "Complex Numbers": {
            title: "Complex Numbers",
            subject: "Maths",
            sections: [
                { heading: "Algebra", content: "z = x + iy.", subsections: [{ title: "Modulus", text: "|z| = √(x²+y²)." }, { title: "Conjugate", text: "z_bar = x - iy." }] },
                { heading: "Forms", content: "Polar & Euler.", subsections: [{ title: "Euler", text: "r e^(iθ)." }, { title: "Cube Roots", text: "1, ω, ω²." }] }
            ],
            formulas: [
                { name: "Euler", eq: "e^(iθ) = cosθ + i sinθ" },
                { name: "Triangle Ineq", eq: "|z1+z2| ≤ |z1|+|z2|" },
                { name: "Cube Roots", eq: "1+ω+ω²=0, ω³=1" },
                { name: "Rotation", eq: "z2 = z1 e^(iθ)" }
            ],
            ncertPoints: ["Argand plane.", "Square root of complex num."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Principal arg.", "Locus problems."], questionTypes: ["Geometry (Locus).", "Cube roots.", "Algebra."] }
        },
        "Permutations & Combinations": {
            title: "P & C",
            subject: "Maths",
            sections: [
                { heading: "Counting", content: "Fundamental Principle.", subsections: [{ title: "P vs C", text: "Order matters vs Selection." }] },
                { heading: "Theorems", content: "Arrangement.", subsections: [{ title: "Gap Method", text: "Objects not together." }, { title: "Beggar Method", text: "Distribution of identical items." }] }
            ],
            formulas: [
                { name: "nPr", eq: "n! / (n-r)!" },
                { name: "nCr", eq: "n! / (r!(n-r)!)" },
                { name: "Derangement", eq: "D_n = n! Σ (-1)^r/r!" },
                { name: "Distribution", eq: "n+r-1 C r-1" }
            ],
            ncertPoints: ["Circular permutation.", "Dictionary rank."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Overcounting.", "Identical vs Distinct."], questionTypes: ["Rank.", "Grouping.", "Selection."] }
        },
        "Binomial Theorem": {
            title: "Binomial Theorem",
            subject: "Maths",
            sections: [
                { heading: "Expansion", content: "(x+y)^n.", subsections: [{ title: "General Term", text: "Tr+1 = nCr x^(n-r) y^r." }] },
                { heading: "Coefficients", content: "Properties.", subsections: [{ title: "Sum", text: "2^n." }] }
            ],
            formulas: [
                { name: "General Term", eq: "nCr a^(n-r) b^r" },
                { name: "Middle Term", eq: "n/2 + 1 (even n)" },
                { name: "Sum Coeffs", eq: "2^n" }
            ],
            ncertPoints: ["Binomial coeff properties.", "Remainder problems."],
            examInsights: { weightage: "Moderate (1-2 Qs)", commonMistakes: ["General term index.", "Remainder calc."], questionTypes: ["Coefficient of x^k.", "Remainder.", "Sum of series."] }
        },
        "Sequence & Series": {
            title: "Sequence & Series",
            subject: "Maths",
            sections: [
                { heading: "Progressions", content: "AP, GP, HP.", subsections: [{ title: "AP", text: "Common diff d." }, { title: "GP", text: "Common ratio r." }] },
                { heading: "Means", content: "AM, GM, HM.", subsections: [{ title: "Inequality", text: "AM ≥ GM ≥ HM." }] }
            ],
            formulas: [
                { name: "Sum AP", eq: "n/2 (2a + (n-1)d)" },
                { name: "Sum GP", eq: "a(r^n - 1)/(r-1)" },
                { name: "Sum Infinite GP", eq: "a/(1-r)" },
                { name: "Sigma n", eq: "n(n+1)/2" }
            ],
            ncertPoints: ["Special series (telescoping).", "AGP."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Sum of infinite GP conditions.", "Telescoping signs."], questionTypes: ["AM-GM inequality.", "Sigma problems.", "Special series."] }
        },
        "Straight Lines": {
            title: "Straight Lines",
            subject: "Maths",
            sections: [
                { heading: "Equations", content: "Forms.", subsections: [{ title: "Slope-Point", text: "y-y1 = m(x-x1)." }, { title: "Normal", text: "x cosα + y sinα = p." }] },
                { heading: "Points", content: "Distance.", subsections: [{ title: "Perpendicular Dist", text: "|ax1+by1+c| / √(a²+b²)." }] }
            ],
            formulas: [
                { name: "Slope", eq: "m = tanθ" },
                { name: "Angle b/w Lines", eq: "tanθ = |(m1-m2)/(1+m1m2)|" },
                { name: "Dist Point-Line", eq: "|ax1+by1+c|/√(a²+b²)" },
                { name: "Dist Parallel", eq: "|c1-c2|/√(a²+b²)" }
            ],
            ncertPoints: ["Family of lines.", "Angle bisectors."],
            examInsights: { weightage: "Moderate (2 Qs)", commonMistakes: ["Sign in distance.", "Bisector identification."], questionTypes: ["Locus.", "Image/Foot of perp.", "Concurrent lines."] }
        },
        "Circles": {
            title: "Circles",
            subject: "Maths",
            sections: [
                { heading: "Equation", content: "Standard & General.", subsections: [{ title: "Standard", text: "(x-h)² + (y-k)² = r²." }, { title: "General", text: "x²+y²+2gx+2fy+c=0." }] },
                { heading: "Tangents", content: "Condition.", subsections: [{ title: "T=0", text: "Tangent at point." }] }
            ],
            formulas: [
                { name: "Center", eq: "(-g, -f)" },
                { name: "Radius", eq: "√(g²+f²-c)" },
                { name: "Tangent Cond", eq: "p = r" },
                { name: "Chord Length", eq: "2√(r²-p²)" }
            ],
            ncertPoints: ["Family of circles.", "Common tangents."],
            examInsights: { weightage: "High (2-3 Qs)", commonMistakes: ["Length of tangent.", "Radical axis."], questionTypes: ["Tangent/Normal.", "Family.", "Common tangents."] }
        },
        "Conic Sections": {
            title: "Conic Sections",
            subject: "Maths",
            sections: [
                { heading: "Parabola", content: "y²=4ax.", subsections: [{ title: "Tangent", text: "y=mx+a/m." }] },
                { heading: "Ellipse", content: "x²/a² + y²/b² = 1.", subsections: [{ title: "Eccentricity", text: "e < 1." }] },
                { heading: "Hyperbola", content: "x²/a² - y²/b² = 1.", subsections: [{ title: "Eccentricity", text: "e > 1." }] }
            ],
            formulas: [
                { name: "Tangent (Para)", eq: "y = mx + a/m" },
                { name: "Tangent (Ell)", eq: "c² = a²m² + b²" },
                { name: "Tangent (Hyp)", eq: "c² = a²m² - b²" },
                { name: "Normal (Para)", eq: "y = mx - 2am - am³" }
            ],
            ncertPoints: ["Standard forms.", "Latus Rectum."],
            examInsights: { weightage: "High (3 Qs)", commonMistakes: ["Parametric coords.", "Normal eq."], questionTypes: ["Tangents/Normals.", "Locus.", "Properties."] }
        },
        "Functions": {
            title: "Functions",
            subject: "Maths",
            sections: [
                { heading: "Basics", content: "Mapping.", subsections: [{ title: "Domain", text: "Set of inputs." }, { title: "Range", text: "Set of outputs." }] },
                { heading: "Types", content: "Classification.", subsections: [{ title: "One-One", text: "Injective." }, { title: "Onto", text: "Surjective." }, { title: "Periodic", text: "f(x+T)=f(x)." }] }
            ],
            formulas: [
                { name: "Even", eq: "f(-x) = f(x)" },
                { name: "Odd", eq: "f(-x) = -f(x)" },
                { name: "Inverse", eq: "f(g(x)) = x" }
            ],
            ncertPoints: ["Composition.", "Inverse trig functions."],
            examInsights: { weightage: "Moderate (2 Qs)", commonMistakes: ["Domain constraints.", "Range calculation."], questionTypes: ["Finding Domain/Range.", "Functional Eq.", "Inverse."] }
        },
        "Limits": {
            title: "Limits, Continuity & Differentiability",
            subject: "Maths",
            sections: [
                { heading: "Limits", content: "Value approaching.", subsections: [{ title: "L'Hopital", text: "0/0 or ∞/∞." }, { title: "Standard", text: "sin x / x -> 1." }] },
                { heading: "Continuity", content: "No break.", subsections: [{ title: "Condition", text: "LHL = RHL = f(a)." }] },
                { heading: "Differentiability", content: "Smoothness.", subsections: [{ title: "Cond", text: "LHD = RHD." }] }
            ],
            formulas: [
                { name: "Standard Lim", eq: "(x^n - a^n)/(x-a)" },
                { name: "e^x Lim", eq: "(e^x - 1)/x -> 1" },
                { name: "ln Lim", eq: "ln(1+x)/x -> 1" }
            ],
            ncertPoints: ["Algebra of limits.", "Intermediate Value Theorem."],
            examInsights: { weightage: "High (3 Qs)", commonMistakes: ["Checking differentiability at sharp points.", "0/0 form."], questionTypes: ["1^∞ form.", "Continuity check.", "Differentiability at mod."] }
        },
        "Continuity & Differentiability": {
            title: "Continuity & Differentiability",
            subject: "Maths",
            sections: [
                { heading: "Continuity", content: "A function is continuous if limits exist and equal the value.", subsections: [{ title: "Condition", text: "Lim x->a f(x) = f(a)." }] },
                { heading: "Differentiability", content: "Existence of derivative.", subsections: [{ title: "Relation", text: "Differentiability implies Continuity, not vice versa." }] }
            ],
            formulas: [
                { name: "LHD", eq: "lim(h->0) (f(a-h)-f(a))/-h" },
                { name: "RHD", eq: "lim(h->0) (f(a+h)-f(a))/h" }
            ],
            ncertPoints: ["Modulus functions corner points.", "Greatest Integer Function jumps."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Checking continuity but not differentiability.", "Composite functions."], questionTypes: ["Points of non-differentiability.", "Finding constants for continuity."] }
        },
        "Derivatives": {
            title: "Differentiation",
            subject: "Maths",
            sections: [
                { heading: "Methods", content: "Rules.", subsections: [{ title: "Chain Rule", text: "f(g(x))." }, { title: "Implicit", text: "f(x,y)=0." }, { title: "Parametric", text: "x(t), y(t)." }] },
                { heading: "AOD", content: "Applications.", subsections: [{ title: "Tangent/Normal", text: "Slope." }, { title: "Monotonicity", text: "Inc/Dec." }, { title: "Maxima/Minima", text: "First/Second Derivative test." }] }
            ],
            formulas: [
                { name: "Product Rule", eq: "uv' + vu'" },
                { name: "Quotient Rule", eq: "(vu' - uv')/v²" },
                { name: "Tangent", eq: "y-y1 = f'(x1)(x-x1)" },
                { name: "Rate Measure", eq: "dy/dt" }
            ],
            ncertPoints: ["Mean Value Theorems (Rolle, LMVT).", "Rate of change."],
            examInsights: { weightage: "High (2-3 Qs)", commonMistakes: ["Critical points.", "Local vs Global max."], questionTypes: ["Tangents.", "Max/Min word problems.", "Monotonicity intervals."] }
        },
        "Indefinite Integration": {
            title: "Indefinite Integration",
            subject: "Maths",
            sections: [
                { heading: "Methods", content: "Techniques.", subsections: [{ title: "Substitution", text: "Let u=f(x)." }, { title: "By Parts", text: "ILATE rule." }, { title: "Partial Fractions", text: "Rational functions." }] }
            ],
            formulas: [
                { name: "By Parts", eq: "∫uv = u∫v - ∫(u'∫v)" },
                { name: "Standard", eq: "∫dx/(x²+a²)" },
                { name: "Special", eq: "e^x(f + f')" }
            ],
            ncertPoints: ["Integration as inverse of diff.", "Standard forms."],
            examInsights: { weightage: "Moderate (1-2 Qs)", commonMistakes: ["Constant C.", "Choosing u in By Parts."], questionTypes: ["Substitution.", "Special forms.", "Trig integrals."] }
        },
        "Definite Integration": {
            title: "Definite Integration & Area",
            subject: "Maths",
            sections: [
                { heading: "Properties", content: "P0 to P7.", subsections: [{ title: "King's Prop", text: "∫a_b f(x) = ∫a_b f(a+b-x)." }, { title: "Leibniz", text: "Diff under integral." }] },
                { heading: "Area", content: "Under curve.", subsections: [{ title: "Formula", text: "∫y dx or ∫x dy." }] }
            ],
            formulas: [
                { name: "King's", eq: "∫f(x) = ∫f(a+b-x)" },
                { name: "Even/Odd", eq: "2∫ or 0" },
                { name: "Wallis", eq: "Reduction" },
                { name: "Area", eq: "∫(y2-y1)dx" }
            ],
            ncertPoints: ["Limit of sum.", "Area bounded by curves."],
            examInsights: { weightage: "Very High (3 Qs)", commonMistakes: ["Limits change in sub.", "Area sign."], questionTypes: ["Properties.", "Limit sum.", "Area calc."] }
        },
        "Differential Equations": {
            title: "Differential Equations",
            subject: "Maths",
            sections: [
                { heading: "Order/Degree", content: "Definitions.", subsections: [{ title: "Linear", text: "dy/dx + Py = Q." }] },
                { heading: "Solving", content: "Methods.", subsections: [{ title: "Variable Sep", text: "f(x)dx = g(y)dy." }, { title: "Homogeneous", text: "y=vx." }] }
            ],
            formulas: [
                { name: "IF (Linear)", eq: "e^∫Pdx" },
                { name: "Solution", eq: "y(IF) = ∫Q(IF)dx" },
                { name: "Homogeneous", eq: "y = vx" }
            ],
            ncertPoints: ["Formation of DE.", "General vs Particular sol."],
            examInsights: { weightage: "Moderate (2 Qs)", commonMistakes: ["IF calculation.", "C placement."], questionTypes: ["LDE.", "Homogeneous.", "Word problems."] }
        },
        "Vectors": {
            title: "Vector Algebra",
            subject: "Maths",
            sections: [
                { heading: "Basics", content: "Addition, Unit vector.", subsections: [{ title: "Dot Product", text: "a.b = |a||b|cosθ." }, { title: "Cross Product", text: "a×b = |a||b|sinθ n_cap." }] },
                { heading: "Triple Products", content: "STP & VTP.", subsections: [{ title: "STP", text: "[a b c] = a.(b×c)." }, { title: "VTP", text: "a×(b×c)." }] }
            ],
            formulas: [
                { name: "Dot Product", eq: "a.b = ab cosθ" },
                { name: "Cross Product", eq: "Determinant" },
                { name: "Projection", eq: "(a.b)/|b|" },
                { name: "VTP", eq: "(a.c)b - (a.b)c" }
            ],
            ncertPoints: ["Direction cosines.", "Area of triangle/parallelogram."],
            examInsights: { weightage: "High (2-3 Qs)", commonMistakes: ["VTP formula.", "Coplanarity condition."], questionTypes: ["Dot/Cross product.", "STP/VTP.", "Projection."] }
        },
        "3D Geometry": {
            title: "Three Dimensional Geometry",
            subject: "Maths",
            sections: [
                { heading: "Lines", content: "In space.", subsections: [{ title: "Eq", text: "(x-x1)/a = (y-y1)/b = (z-z1)/c." }, { title: "Skew Lines", text: "Shortest distance." }] },
                { heading: "Planes", content: "Ax+By+Cz+D=0.", subsections: [{ title: "Intersections", text: "Line & Plane, Two Planes." }] }
            ],
            formulas: [
                { name: "Shortest Dist", eq: "|(a2-a1).(b1×b2)|/|b1×b2|" },
                { name: "Plane Normal", eq: "r.n = d" },
                { name: "Dist Point-Plane", eq: "|Ax1+By1+Cz1+D|/√(A²+B²+C²)" },
                { name: "Angle", eq: "cosθ formula" }
            ],
            ncertPoints: ["Direction ratios vs cosines.", "Coplanarity of lines."],
            examInsights: { weightage: "High (2 Qs)", commonMistakes: ["Shortest distance formula.", "Plane equation forms."], questionTypes: ["Image of point.", "Intersection.", "Distance."] }
        },
        "Probability": {
            title: "Probability",
            subject: "Maths",
            sections: [
                { heading: "Basics", content: "Conditional.", subsections: [{ title: "P(A|B)", text: "P(AnB)/P(B)." }] },
                { heading: "Theorems", content: "Bayes & Total Prob.", subsections: [{ title: "Bayes", text: "Reverse probability." }, { title: "Bernoulli", text: "Binomial distribution." }] }
            ],
            formulas: [
                { name: "Conditional", eq: "P(A/B) = P(A∩B)/P(B)" },
                { name: "Bayes", eq: "P(Ei|A) formula" },
                { name: "Binomial", eq: "P(X=r) = nCr p^r q^(n-r)" },
                { name: "Mean/Var", eq: "np, npq" }
            ],
            ncertPoints: ["Independent events.", "Random variable."],
            examInsights: { weightage: "Moderate (1-2 Qs)", commonMistakes: ["Mutually exclusive vs Independent.", "Bayes logic."], questionTypes: ["Bayes theorem.", "Bernoulli trials.", "Conditional."] }
        },
        "Calculus": {
            title: "Calculus (Combined)",
            subject: "Maths",
            sections: [
                { heading: "Overview", content: "Study of change and motion.", subsections: [{ title: "Differential", text: "Rates of change, slopes." }, { title: "Integral", text: "Accumulation, area." }] }
            ],
            formulas: [
                { name: "Fundamental Thm", eq: "∫a_b f'(x)dx = f(b)-f(a)" }
            ],
            ncertPoints: ["Calculus is the backbone of Physics derivation."],
            examInsights: { weightage: "Very High (30-35%)", commonMistakes: ["Conceptual gaps in limits."], questionTypes: ["Mixed concepts."] }
        }
    }
};
