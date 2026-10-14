
import { SyllabusSubject } from "../types";

export const JEE_SYLLABUS_DATA: SyllabusSubject[] = [
    {
        id: 'Physics',
        chapters: [
            {
                id: 'phy-01',
                name: 'Units & Dimensions',
                weightage: 'Low',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Dimensional Analysis',
                        concept: 'Checking homogeneity of physical equations and deriving relations between physical quantities.',
                        examPatterns: ['Direct dimensional formula questions', 'Matching units to quantities', 'Error analysis in experiments'],
                        tags: ['JEE Main', 'Repeated Topic']
                    },
                    {
                        name: 'Errors & Instruments',
                        concept: 'Absolute, relative, and percentage errors. Vernier Callipers and Screw Gauge mechanics.',
                        examPatterns: ['Least count calculation', 'Reading Vernier/Screw Gauge', 'Propagation of errors'],
                        tags: ['JEE Advanced', 'Practical Physics']
                    }
                ]
            },
            {
                id: 'phy-02',
                name: 'Kinematics',
                weightage: 'Medium',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Motion in 1D',
                        concept: 'Rectilinear motion with constant or variable acceleration. Graphical analysis of v-t, x-t curves.',
                        examPatterns: ['Graph interpretation', 'Calculus based problems', 'Relative motion in 1D'],
                        tags: ['JEE Main', 'NCERT Direct']
                    },
                    {
                        name: 'Projectile Motion',
                        concept: '2D motion under gravity. Equation of trajectory, maximum height, range, and time of flight.',
                        examPatterns: ['Trajectory equation problems', 'Projectile on inclined plane', 'Relative projectile motion'],
                        tags: ['JEE Main', 'JEE Advanced']
                    }
                ]
            },
            {
                id: 'phy-03',
                name: 'Laws of Motion',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Newton’s Laws',
                        concept: 'Inertia, F=ma, Action-Reaction. Free Body Diagrams (FBD) are crucial for solving.',
                        examPatterns: ['Block on block problems', 'Pulley systems', 'Constraint motion'],
                        tags: ['JEE Main', 'Fundamental']
                    },
                    {
                        name: 'Friction',
                        concept: 'Static vs Kinetic friction. Friction acts tangentially to oppose relative motion.',
                        examPatterns: ['Angle of repose', 'Toppling vs Sliding', 'Circular motion with friction'],
                        tags: ['JEE Advanced', 'Conceptual']
                    }
                ]
            },
            {
                id: 'phy-04',
                name: 'Work, Energy & Power',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Work-Energy Theorem',
                        concept: 'Net work done by all forces equals change in Kinetic Energy. Applies to both constant and variable forces.',
                        examPatterns: ['Variable force work calculation', 'Spring-block systems', 'Vertical circular motion'],
                        tags: ['JEE Main', 'Repeated Topic']
                    },
                    {
                        name: 'Collisions',
                        concept: 'Conservation of Linear Momentum. Elastic, Inelastic, and Perfectly Inelastic collisions.',
                        examPatterns: ['Coefficient of restitution', 'Oblique collisions', 'Center of mass frame'],
                        tags: ['JEE Advanced', 'Numerical']
                    }
                ]
            },
            {
                id: 'phy-05',
                name: 'Rotational Motion',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Moment of Inertia',
                        concept: 'Resistance to rotational motion. Depends on mass distribution and axis of rotation.',
                        examPatterns: ['Parallel/Perpendicular axis theorem', 'MOI of cavities', 'Radius of gyration'],
                        tags: ['JEE Main', 'Formula Heavy']
                    },
                    {
                        name: 'Rolling Motion',
                        concept: 'Combination of translation and rotation. Pure rolling condition v = Rω.',
                        examPatterns: ['Rolling on incline', 'Angular momentum conservation', 'Toppling'],
                        tags: ['JEE Advanced', 'Critical']
                    }
                ]
            },
            {
                id: 'phy-06',
                name: 'Gravitation',
                weightage: 'Medium',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Gravitational Potential & Field',
                        concept: 'Conservative field. Work done is path independent. Potential is work per unit mass.',
                        examPatterns: ['Variation of g', 'Escape velocity', 'Satellite motion'],
                        tags: ['JEE Main', 'NCERT Direct']
                    },
                    {
                        name: 'Kepler’s Laws',
                        concept: 'Laws of planetary motion: Orbits, Areas, and Periods (T² ∝ R³).',
                        examPatterns: ['Orbital velocity', 'Energy of satellites', 'Geostationary satellites'],
                        tags: ['JEE Main', 'Formula Based']
                    }
                ]
            },
            {
                id: 'phy-07',
                name: 'Electrostatics',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Electric Field & Flux',
                        concept: 'Coulomb’s Law, Field due to distributions. Gauss Law relates flux to enclosed charge.',
                        examPatterns: ['Field due to ring/disc', 'Flux through cube/sphere', 'Conductor properties'],
                        tags: ['JEE Main', 'JEE Advanced']
                    },
                    {
                        name: 'Capacitance',
                        concept: 'Energy storage in fields. Parallel plate capacitors, dielectrics, and combinations.',
                        examPatterns: ['Circuit analysis', 'Dielectric insertion', 'Energy redistribution'],
                        tags: ['JEE Advanced', 'Numerical']
                    }
                ]
            },
            {
                id: 'phy-08',
                name: 'Current Electricity',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Circuit Analysis',
                        concept: 'Ohm’s Law, KVL, KCL. Equivalent resistance and nodal analysis.',
                        examPatterns: ['Power consumption', 'Symmetry circuits', 'Wheatstone bridge'],
                        tags: ['JEE Main', 'Logic Heavy']
                    },
                    {
                        name: 'Instruments',
                        concept: 'Potentiometer, Meter Bridge, Galvanometer conversion to Ammeter/Voltmeter.',
                        examPatterns: ['Error in measurement', 'Balancing length', 'Shunt resistance calc'],
                        tags: ['JEE Main', 'Practical Physics']
                    }
                ]
            },
            {
                id: 'phy-09',
                name: 'Magnetism',
                weightage: 'Medium',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Moving Charges',
                        concept: 'Biot-Savart Law and Ampere’s Law. Lorentz force on moving charge.',
                        examPatterns: ['Helical path', 'Force between wires', 'Magnetic moment'],
                        tags: ['JEE Main', 'Formula Based']
                    },
                    {
                        name: 'Earth’s Magnetism',
                        concept: 'Dip angle, declination, and magnetic elements of Earth.',
                        examPatterns: ['Tangent galvanometer', 'Magnetic materials (Para/Dia/Ferro)'],
                        tags: ['NCERT Direct', 'Memory Based']
                    }
                ]
            },
            {
                id: 'phy-10',
                name: 'Optics',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Ray Optics',
                        concept: 'Reflection, Refraction, Lenses, Prisms. Total Internal Reflection.',
                        examPatterns: ['Lens maker formula', 'Prism deviation', 'Optical instruments'],
                        tags: ['JEE Main', 'JEE Advanced']
                    },
                    {
                        name: 'Wave Optics',
                        concept: 'Interference (YDSE), Diffraction, Polarization. Wave nature of light.',
                        examPatterns: ['Fringe width calculation', 'Path difference', 'Brewster’s Law'],
                        tags: ['JEE Advanced', 'Conceptual']
                    }
                ]
            },
            {
                id: 'phy-11',
                name: 'Modern Physics',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Dual Nature',
                        concept: 'Photoelectric effect and De-Broglie wavelength. Particle-wave duality.',
                        examPatterns: ['Einstein’s equation', 'Stopping potential graphs', 'Matter waves'],
                        tags: ['JEE Main', 'Scoring']
                    },
                    {
                        name: 'Atoms & Nuclei',
                        concept: 'Bohr model, hydrogen spectrum. Radioactivity and nuclear binding energy.',
                        examPatterns: ['Transition energy', 'Half-life problems', 'Mass defect'],
                        tags: ['JEE Main', 'Formula Heavy']
                    }
                ]
            }
        ]
    },
    {
        id: 'Chemistry',
        chapters: [
            {
                id: 'chem-01',
                name: 'Mole Concept',
                weightage: 'Medium',
                status: 'AVAILABLE',
                category: 'Physical',
                topics: [
                    {
                        name: 'Stoichiometry',
                        concept: 'Calculations based on balanced chemical equations. Limiting reagent concept.',
                        examPatterns: ['Mole-mole analysis', 'Concentration terms (Molarity, Molality)', 'Combustion analysis'],
                        tags: ['JEE Main', 'Fundamental']
                    },
                    {
                        name: 'Redox Reactions',
                        concept: 'Oxidation states, balancing redox reactions, and equivalent weight.',
                        examPatterns: ['n-factor calculation', 'Titration problems', 'Disproportionation'],
                        tags: ['JEE Advanced', 'Numerical']
                    }
                ]
            },
            {
                id: 'chem-02',
                name: 'Atomic Structure',
                weightage: 'Medium',
                status: 'AVAILABLE',
                category: 'Physical',
                topics: [
                    {
                        name: 'Quantum Model',
                        concept: 'Schrodinger equation basics, Quantum numbers (n, l, m, s), and orbital shapes.',
                        examPatterns: ['Electronic configuration', 'Nodes calculation', 'Heisenberg uncertainty'],
                        tags: ['JEE Main', 'Conceptual']
                    },
                    {
                        name: 'Bohr Model',
                        concept: 'Hydrogen spectrum, energy levels, and radii of orbits.',
                        examPatterns: ['Spectral series (Lyman, Balmer)', 'Ionization energy', 'Radius ratio'],
                        tags: ['JEE Main', 'Formula Based']
                    }
                ]
            },
            {
                id: 'chem-03',
                name: 'Chemical Bonding',
                weightage: 'High',
                status: 'AVAILABLE',
                category: 'Inorganic',
                topics: [
                    {
                        name: 'VSEPR Theory',
                        concept: 'Predicting shapes and geometries of molecules based on electron repulsions.',
                        examPatterns: ['Shape vs Geometry', 'Bond angle comparison', 'Hybridization'],
                        tags: ['JEE Main', 'Critical']
                    },
                    {
                        name: 'MOT',
                        concept: 'Molecular Orbital Theory. Bond order, stability, and magnetic nature.',
                        examPatterns: ['Paramagnetic/Diamagnetic check', 'Bond order calculation', 'Existence of molecule'],
                        tags: ['JEE Advanced', 'Repeated Topic']
                    }
                ]
            },
            {
                id: 'chem-04',
                name: 'Thermodynamics',
                weightage: 'High',
                status: 'AVAILABLE',
                category: 'Physical',
                topics: [
                    {
                        name: 'First Law',
                        concept: 'Internal energy, Enthalpy, Heat capacities. Hess’s Law.',
                        examPatterns: ['Work done in processes', 'Enthalpy of formation', 'Bomb calorimeter'],
                        tags: ['JEE Main', 'Numerical']
                    },
                    {
                        name: 'Second Law & Entropy',
                        concept: 'Spontaneity criteria. Gibbs Free Energy (ΔG = ΔH - TΔS).',
                        examPatterns: ['Predicting spontaneity', 'Entropy change calculation', 'Coupled reactions'],
                        tags: ['JEE Advanced', 'Conceptual']
                    }
                ]
            },
            {
                id: 'chem-05',
                name: 'Equilibrium',
                weightage: 'High',
                status: 'AVAILABLE',
                category: 'Physical',
                topics: [
                    {
                        name: 'Chemical Equilibrium',
                        concept: 'Law of mass action, Kp vs Kc, Le Chatelier’s principle.',
                        examPatterns: ['Effect of P, T, C', 'Degree of dissociation', 'Reaction quotient'],
                        tags: ['JEE Main', 'Logic Heavy']
                    },
                    {
                        name: 'Ionic Equilibrium',
                        concept: 'pH calculation, Buffer solutions, Salt hydrolysis, Solubility product (Ksp).',
                        examPatterns: ['pH of mixtures', 'Buffer capacity', 'Precipitation condition'],
                        tags: ['JEE Advanced', 'Hard']
                    }
                ]
            },
            {
                id: 'chem-06',
                name: 'GOC (Organic Basics)',
                weightage: 'High',
                status: 'AVAILABLE',
                category: 'Organic',
                topics: [
                    {
                        name: 'Electronic Effects',
                        concept: 'Inductive, Mesomeric (Resonance), Hyperconjugation, and Electromeric effects.',
                        examPatterns: ['Stability of intermediates', 'Acidity/Basicity order', 'Dipole moment'],
                        tags: ['JEE Main', 'Fundamental']
                    },
                    {
                        name: 'Isomerism',
                        concept: 'Structural and Stereoisomerism (Geometrical & Optical).',
                        examPatterns: ['Counting isomers', 'Chirality check', 'Enantiomers vs Diastereomers'],
                        tags: ['JEE Advanced', 'Visual']
                    }
                ]
            },
            {
                id: 'chem-07',
                name: 'Hydrocarbons',
                weightage: 'Medium',
                status: 'AVAILABLE',
                category: 'Organic',
                topics: [
                    {
                        name: 'Alkanes, Alkenes, Alkynes',
                        concept: 'Preparation and properties. Free radical halogenation, Electrophilic addition.',
                        examPatterns: ['Markovnikov rule', 'Ozonolysis', 'Acidity of alkynes'],
                        tags: ['JEE Main', 'Reaction Based']
                    },
                    {
                        name: 'Aromatic Compounds',
                        concept: 'Benzene and derivatives. Electrophilic Aromatic Substitution (EAS).',
                        examPatterns: ['Friedel-Crafts reaction', 'Directing groups (o, p, m)', 'Huckel Rule'],
                        tags: ['JEE Advanced', 'Mechanism']
                    }
                ]
            },
            {
                id: 'chem-08',
                name: 'Coordination Compounds',
                weightage: 'High',
                status: 'AVAILABLE',
                category: 'Inorganic',
                topics: [
                    {
                        name: 'Werner & VBT',
                        concept: 'Primary/Secondary valency. Hybridization and geometry of complexes.',
                        examPatterns: ['IUPAC Naming', 'Magnetic moment', 'Isomerism in complexes'],
                        tags: ['JEE Main', 'Scoring']
                    },
                    {
                        name: 'Crystal Field Theory',
                        concept: 'Splitting of d-orbitals. Spectrochemical series and color of complexes.',
                        examPatterns: ['CFSE calculation', 'High spin vs Low spin', 'Color absorption'],
                        tags: ['JEE Advanced', 'Conceptual']
                    }
                ]
            },
            {
                id: 'chem-09',
                name: 'Aldehydes & Ketones',
                weightage: 'High',
                status: 'AVAILABLE',
                category: 'Organic',
                topics: [
                    {
                        name: 'Nucleophilic Addition',
                        concept: 'Reactivity towards nucleophiles. Grignard reagent reactions.',
                        examPatterns: ['HCN addition', 'Acetal formation', 'Reaction with ammonia derivatives'],
                        tags: ['JEE Main', 'Mechanism']
                    },
                    {
                        name: 'Name Reactions',
                        concept: 'Aldol Condensation, Cannizzaro, Wolff-Kishner, Clemmensen reduction.',
                        examPatterns: ['Cross-Aldol products', 'Distinguishing tests (Tollens/Fehling)', 'Oxidation'],
                        tags: ['JEE Advanced', 'Memory + Logic']
                    }
                ]
            }
        ]
    },
    {
        id: 'Maths',
        chapters: [
            {
                id: 'math-01',
                name: 'Sets, Relations & Functions',
                weightage: 'Medium',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Functions',
                        concept: 'Domain, Range, One-one/Onto, Inverse functions, Composition.',
                        examPatterns: ['Finding domain/range', 'Checking injectivity/surjectivity', 'Functional equations'],
                        tags: ['JEE Main', 'Fundamental']
                    },
                    {
                        name: 'Relations',
                        concept: 'Reflexive, Symmetric, Transitive. Equivalence relations.',
                        examPatterns: ['Types of relations', 'Equivalence classes', 'Binary operations'],
                        tags: ['JEE Main', 'Easy Kill']
                    }
                ]
            },
            {
                id: 'math-02',
                name: 'Complex Numbers',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Algebra of Complex Numbers',
                        concept: 'Modulus, Argument, Conjugate. Polar and Euler forms.',
                        examPatterns: ['Simplification', 'Square root', 'Properties of modulus'],
                        tags: ['JEE Main', 'Formula Based']
                    },
                    {
                        name: 'Geometry of Complex Numbers',
                        concept: 'Rotation theorem, Locus problems, Cube roots of unity.',
                        examPatterns: ['Circle/Line equation in complex plane', 'Triangle inequalities', 'Roots of unity'],
                        tags: ['JEE Advanced', 'Hard']
                    }
                ]
            },
            {
                id: 'math-03',
                name: 'Quadratic Equations',
                weightage: 'Medium',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Roots & Coefficients',
                        concept: 'Sum and product of roots. Nature of roots (Discriminant).',
                        examPatterns: ['Formation of equations', 'Common roots', 'Newton’s sums'],
                        tags: ['JEE Main', 'Repeated Topic']
                    },
                    {
                        name: 'Location of Roots',
                        concept: 'Conditions for roots relative to a number k. Graph analysis.',
                        examPatterns: ['Range of parameters', 'Graph based inequalities', 'Sign of expression'],
                        tags: ['JEE Advanced', 'Logic Heavy']
                    }
                ]
            },
            {
                id: 'math-04',
                name: 'Calculus (Diff & Int)',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Limits, Continuity, Differentiability',
                        concept: 'Standard limits, L-Hospital rule. Continuity and Differentiability at a point.',
                        examPatterns: ['0/0 form', 'Points of non-differentiability', 'Modulus functions'],
                        tags: ['JEE Main', 'Critical']
                    },
                    {
                        name: 'Definite Integration',
                        concept: 'Properties of definite integrals. Area under curves.',
                        examPatterns: ['King’s property', 'Leibniz rule', 'Estimation of integrals'],
                        tags: ['JEE Advanced', 'Scoring']
                    }
                ]
            },
            {
                id: 'math-05',
                name: 'Coordinate Geometry',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Straight Lines & Circles',
                        concept: 'Slope, Intercepts, Family of lines. Tangents and Normals to circles.',
                        examPatterns: ['Locus problems', 'Orthocenter/Centroid', 'Common tangents'],
                        tags: ['JEE Main', 'Formula Heavy']
                    },
                    {
                        name: 'Conic Sections',
                        concept: 'Parabola, Ellipse, Hyperbola. Standard equations and properties.',
                        examPatterns: ['Tangent conditions', 'Focal properties', 'Director circle'],
                        tags: ['JEE Advanced', 'Geometric']
                    }
                ]
            },
            {
                id: 'math-06',
                name: 'Vector & 3D',
                weightage: 'High',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Vector Algebra',
                        concept: 'Dot and Cross products. Scalar and Vector Triple products.',
                        examPatterns: ['Projection', 'Coplanarity', 'Work done/Torque'],
                        tags: ['JEE Main', 'Scoring']
                    },
                    {
                        name: '3D Geometry',
                        concept: 'Direction cosines, Lines and Planes in space. Shortest distance.',
                        examPatterns: ['Intersection of planes', 'Image of point', 'Skew lines'],
                        tags: ['JEE Main', 'Formula Heavy']
                    }
                ]
            },
            {
                id: 'math-07',
                name: 'Probability & PnC',
                weightage: 'Medium',
                status: 'AVAILABLE',
                topics: [
                    {
                        name: 'Permutations & Combinations',
                        concept: 'Arrangement vs Selection. Gap method, Rank of word.',
                        examPatterns: ['Distribution of objects', 'Grid problems', 'Circular permutation'],
                        tags: ['JEE Main', 'Logic Heavy']
                    },
                    {
                        name: 'Probability',
                        concept: 'Conditional probability, Bayes theorem, Binomial distribution.',
                        examPatterns: ['Total probability', 'Independent events', 'Bernoulli trials'],
                        tags: ['JEE Advanced', 'Conceptual']
                    }
                ]
            }
        ]
    }
];
