import { EbookData } from '../types';

export const SAMPLE_EBOOKS: EbookData[] = [
  {
    id: 'sample-quantum-computing',
    topic: 'Quantum Computing for Beginners',
    subtitle: 'From Qubits and Superposition to Quantum Advantage',
    description: 'An interactive, visual guide to quantum physics fundamentals and how quantum computers manipulate information at atomic scales.',
    mode: 'auto',
    targetAudience: 'Beginners & Enthusiasts',
    theme: 'cyberpunk',
    author: 'StudyForge Multi-Agent AI',
    createdAt: new Date().toISOString(),
    metadata: {
      totalReadTime: 12,
      animationLevel: 'rich',
      depth: 'Introductory to Intermediate',
      teachingStyle: 'Visual & Intuitive Analogies',
      language: 'English'
    },
    chapters: [
      {
        id: 'ch-1',
        number: 1,
        title: 'The Quantum Leap: Classical vs Quantum Bits',
        subtitle: 'Understanding the state space of subatomic systems',
        summary: 'Explore why classical 0/1 bits differ fundamentally from quantum bits that inhabit a continuous spherical state space (Bloch Sphere).',
        estimatedReadTimeMinutes: 4,
        sections: [
          {
            id: 'sec-1-1',
            title: 'Bits vs. Qubits: Beyond Binary',
            content: `In standard digital computing, information is stored in **bits**, which act like binary light switches: they are either strictly **0 (Off)** or **1 (On)**. Every video, application, and web page you use is built from billions of these light switches.

Quantum computing breaks this fundamental restriction. A **Qubit (Quantum Bit)** utilizes subatomic phenomena—such as electron spin or photon polarization—to exist in states that are combinations of both 0 and 1 simultaneously.

### Key Distinction:
- **Classical Bit:** Holds 1 value at a time ($0$ OR $1$).
- **Qubit:** Holds a *superposition* of states ($\alpha|0\rangle + \beta|1\rangle$).
- **Exponential Power:** 30 classical bits store 1 number from $0$ to $2^{30}-1$. 30 qubits in superposition hold **all $2^{30}$ values (over 1 billion) simultaneously**!`,
            keyTakeaways: [
              'Classical bits are strictly 0 or 1; Qubits can exist in superposition of both.',
              'Superposition enables parallel processing across $2^N$ simultaneous states for $N$ qubits.',
              'Measurement collapses a qubit back into a definite 0 or 1 with probabilistic outcomes.'
            ],
            diagrams: [
              {
                id: 'diag-bloch-sphere',
                title: 'The Bloch Sphere Visualization',
                type: 'infographic',
                caption: 'The Bloch Sphere illustrates a single qubit state. The North Pole is |0⟩, South Pole is |1⟩, and the surface vector represents any superposition state.',
                svgContent: `<svg viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto text-indigo-400">
  <defs>
    <radialGradient id="sphereGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25" />
      <stop offset="80%" stop-color="#1e1b4b" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95" />
    </radialGradient>
    <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <!-- Background Sphere -->
  <circle cx="250" cy="160" r="110" fill="url(#sphereGrad)" stroke="#6366f1" stroke-width="2" stroke-dasharray="4 2" />
  <!-- Equator Ellipse -->
  <ellipse cx="250" cy="160" rx="110" ry="35" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3" />
  <!-- Vertical Axis -->
  <line x1="250" y1="35" x2="250" y2="285" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 3" />
  <!-- Horizontal Axis -->
  <line x1="120" y1="160" x2="380" y2="160" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 3" />
  
  <!-- Pole Labels -->
  <circle cx="250" cy="50" r="6" fill="#38bdf8" />
  <text x="265" y="55" fill="#38bdf8" font-size="14" font-weight="bold">|0⟩ (North Pole)</text>

  <circle cx="250" cy="270" r="6" fill="#ec4899" />
  <text x="265" y="275" fill="#ec4899" font-size="14" font-weight="bold">|1⟩ (South Pole)</text>

  <!-- Vector Arrow (Superposition State) -->
  <line x1="250" y1="160" x2="320" y2="85" stroke="url(#vectorGrad)" stroke-width="4" marker-end="url(#arrow)" />
  <circle cx="320" cy="85" r="8" fill="#a855f7" />
  
  <!-- Vector Label -->
  <rect x="330" y="70" width="140" height="32" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1" />
  <text x="340" y="91" fill="#e2e8f0" font-size="12" font-family="monospace">|Ψ⟩ = α|0⟩ + β|1⟩</text>
  
  <!-- Theta Angle -->
  <path d="M 250 120 A 40 40 0 0 1 278 128" fill="none" stroke="#f59e0b" stroke-width="2" />
  <text x="260" y="112" fill="#f59e0b" font-size="12">θ (Theta)</text>
</svg>`
              }
            ],
            quizzes: [
              {
                id: 'q1',
                question: 'What is the fundamental difference between a classical bit and a quantum qubit?',
                options: [
                  'Qubits are physically larger than classical transistors.',
                  'Qubits can exist in a superposition of both 0 and 1 state simultaneously.',
                  'Classical bits run faster than quantum processors for basic addition.',
                  'Qubits never produce mistakes under heat.'
                ],
                correctAnswerIndex: 1,
                explanation: 'Qubits exploit quantum superposition to represent combinations of states simultaneously, allowing massive computational parallelism.',
                hint: 'Think about what allows a qubit to be both 0 and 1 at the same time.'
              }
            ]
          }
        ]
      },
      {
        id: 'ch-2',
        number: 2,
        title: 'Quantum Entanglement & Gates',
        subtitle: 'Spooky action at a distance and reversible logic circuits',
        summary: 'Learn how entangled qubits correlate instantaneously across distances and how quantum logic gates manipulate probability waves.',
        estimatedReadTimeMinutes: 5,
        sections: [
          {
            id: 'sec-2-1',
            title: 'Entanglement: Interconnected Systems',
            content: `When two qubits become **entanglement-coupled**, their individual quantum states merge into a unified joint state. Measuring the state of Qubit A instantly determines the state of Qubit B, regardless of whether they are centimeters or light-years apart!

Einstein famously referred to this as *"spooky action at a distance"*, but in quantum computing, it is the primary engine behind **quantum teleportation, Grover's search algorithm, and Shor's factoring algorithm**.

### Quantum Gates vs Classical Logic
Classical gates (AND, OR, NOT) are often **irreversible** (information is discarded). Quantum gates (Hadamard, CNOT, Pauli-X) are unitary matrices—meaning they are completely **reversible** and preserve total probability (sum of squared amplitudes = 1).`,
            keyTakeaways: [
              'Entanglement binds qubit states together, causing instant correlation.',
              'The Hadamard Gate (H) transforms a definite |0⟩ or |1⟩ into an equal 50/50 superposition state.',
              'The CNOT Gate acts as a quantum conditional switcher, entangling two qubits.'
            ],
            interactiveWidget: {
              type: 'interactive_demo',
              title: 'Hadamard & Superposition Coin Flipper',
              description: 'Simulate passing a qubit through a Hadamard Gate (H) to enter 50% superposition, then measure it to observe state collapse.',
              data: {
                initialState: '|0⟩',
                gateApplied: 'Hadamard (H)',
                superpositionProb: '50% |0⟩ + 50% |1⟩'
              }
            }
          }
        ]
      }
    ],
    flashcards: [
      {
        id: 'fc-1',
        term: 'Superposition',
        definition: 'The ability of a quantum system to exist in a linear combination of multiple physical states at once until measured.',
        example: 'Schrödinger’s Cat paradox or a qubit representing |0⟩ and |1⟩ concurrently.'
      },
      {
        id: 'fc-2',
        term: 'Entanglement',
        definition: 'A quantum phenomenon where two or more particles become interconnected such that measuring one immediately dictates the state of the other.',
        example: 'Creating a Bell pair where measuring Qubit A as |1⟩ guarantees Qubit B is also |1⟩.'
      },
      {
        id: 'fc-3',
        term: 'Bloch Sphere',
        definition: 'A geometrical representation of the pure state space of a two-level quantum mechanical system (qubit).',
        example: 'Mapping a spin-1/2 particle on a 3D unit sphere.'
      }
    ],
    glossary: [
      {
        term: 'Qubit',
        definition: 'Quantum Bit, the standard unit of quantum information.',
        category: 'Hardware'
      },
      {
        term: 'Hadamard Gate',
        definition: 'A single-qubit gate that maps basis states |0⟩ and |1⟩ into equal superposition states.',
        category: 'Algorithms'
      },
      {
        term: 'Quantum Decoherence',
        definition: 'The loss of quantum coherence caused by interaction with environmental thermal noise.',
        category: 'Physics'
      }
    ],
    overallQuiz: [
      {
        id: 'oq-1',
        question: 'Which quantum gate is responsible for creating an equal superposition state from a pure state?',
        options: ['Pauli-Z Gate', 'Hadamard Gate (H)', 'Toffoli Gate', 'Phase Shift Gate'],
        correctAnswerIndex: 1,
        explanation: 'The Hadamard (H) gate places a qubit into an equal superposition state: (|0⟩ + |1⟩) / √2.',
        hint: 'It starts with the letter H.'
      }
    ],
    references: [
      {
        title: 'IBM Quantum Learning Pathway',
        url: 'https://learning.quantum.ibm.com/',
        description: 'Comprehensive tutorials on qiskit and quantum circuits.'
      },
      {
        title: 'Nielsen & Chuang - Quantum Computation and Quantum Information',
        description: 'The standard academic textbook reference for quantum computing.'
      }
    ]
  },
  {
    id: 'sample-neural-networks',
    topic: 'Neural Networks & Deep Learning',
    subtitle: 'From Artificial Neurons to Modern Transformers & LLMs',
    description: 'A deep visual exploration of perceptrons, backpropagation, activation functions, loss functions, and transformer attention mechanisms.',
    mode: 'prompting',
    targetAudience: 'Students, Developers & Data Scientists',
    theme: 'nordic',
    author: 'StudyForge Multi-Agent AI',
    createdAt: new Date().toISOString(),
    metadata: {
      totalReadTime: 15,
      animationLevel: 'rich',
      depth: 'Comprehensive & Mathematical',
      teachingStyle: 'Visual & Interactive',
      language: 'English'
    },
    chapters: [
      {
        id: 'ch-nn-1',
        number: 1,
        title: 'The Anatomy of an Artificial Neuron',
        subtitle: 'Weights, Biases, and Non-Linear Activations',
        summary: 'Understand how inputs are weighted, summed with bias, and transformed by non-linear activation functions like ReLU and Sigmoid.',
        estimatedReadTimeMinutes: 5,
        sections: [
          {
            id: 'sec-nn-1-1',
            title: 'Mathematical Model of a Perceptron',
            content: `At the core of modern deep learning is the **Artificial Neuron (Perceptron)**. Inspired by biological neurons, it receives vector inputs $\\mathbf{x} = [x_1, x_2, ... x_n]$, scales them by learned parameters called **weights** $\\mathbf{w}$, adds a **bias** term $b$, and evaluates an activation function $\\sigma(z)$.

$$z = \\sum_{i=1}^n w_i x_i + b = \\mathbf{w}^T \\mathbf{x} + b$$

$$a = \\sigma(z)$$

### Common Activation Functions:
1. **ReLU (Rectified Linear Unit):** $f(z) = \\max(0, z)$ — Fast, prevents gradient vanishing in deep networks.
2. **Sigmoid:** $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ — Squeezes real values into probabilities between 0 and 1.
3. **GELU / Swish:** Modern smooth non-linearities used in Transformer models like Gemini and GPT.`,
            keyTakeaways: [
              'Weights determine input importance; Biases shift the activation threshold.',
              'Non-linear activation functions enable networks to approximate any continuous function (Universal Approximation Theorem).',
              'ReLU is the workhorse of deep networks due to constant gradient for positive inputs.'
            ],
            diagrams: [
              {
                id: 'diag-neuron-architecture',
                title: 'Single Perceptron Architecture',
                type: 'flowchart',
                caption: 'Vector inputs x1, x2, x3 are multiplied by weights w1, w2, w3, summed with bias b, and passed through activation function sigma.',
                svgContent: `<svg viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
  <rect x="10" y="10" width="500" height="260" rx="12" fill="#0f172a" stroke="#334155" />
  
  <!-- Inputs -->
  <circle cx="60" cy="60" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="60" y="65" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">X₁</text>

  <circle cx="60" cy="140" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="60" y="145" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">X₂</text>

  <circle cx="60" cy="220" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="60" y="225" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">X₃</text>

  <!-- Weight Connections -->
  <line x1="82" y1="60" x2="220" y2="140" stroke="#f43f5e" stroke-width="2.5"/>
  <text x="135" y="85" fill="#f43f5e" font-size="12" font-weight="bold">w₁ = 0.85</text>

  <line x1="82" y1="140" x2="220" y2="140" stroke="#10b981" stroke-width="2.5"/>
  <text x="135" y="132" fill="#10b981" font-size="12" font-weight="bold">w₂ = -0.4</text>

  <line x1="82" y1="220" x2="220" y2="140" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="135" y="195" fill="#f59e0b" font-size="12" font-weight="bold">w₃ = 1.2</text>

  <!-- Summation Node -->
  <circle cx="240" cy="140" r="32" fill="#1e1b4b" stroke="#818cf8" stroke-width="3"/>
  <text x="240" y="145" fill="#a5b4fc" font-size="18" font-weight="bold" text-anchor="middle">Σ + b</text>

  <!-- Arrow to Activation -->
  <line x1="272" y1="140" x2="350" y2="140" stroke="#cbd5e1" stroke-width="3" marker-end="url(#arrow)"/>

  <!-- Activation Function Node -->
  <rect x="350" y="105" width="80" height="70" rx="8" fill="#312e81" stroke="#c084fc" stroke-width="2"/>
  <text x="390" y="135" fill="#e9d5ff" font-size="16" font-weight="bold" text-anchor="middle">σ(z)</text>
  <text x="390" y="155" fill="#a855f7" font-size="11" text-anchor="middle">ReLU</text>

  <!-- Output Arrow -->
  <line x1="430" y1="140" x2="485" y2="140" stroke="#22c55e" stroke-width="3"/>
  <text x="495" y="145" fill="#22c55e" font-size="16" font-weight="bold">Output y</text>
</svg>`
              }
            ]
          }
        ]
      }
    ],
    flashcards: [
      {
        id: 'fc-nn-1',
        term: 'Backpropagation',
        definition: 'An algorithm for supervised learning of artificial neural networks using gradient descent with the chain rule of calculus.',
        example: 'Computing partial derivatives ∂Loss/∂w backward from output layer to input layer.'
      },
      {
        id: 'fc-nn-2',
        term: 'Overfitting',
        definition: 'A modeling error where a network learns the training noise instead of the true underlying data distribution.',
        example: 'High accuracy on training set but poor accuracy on unseen validation data.'
      }
    ],
    glossary: [
      {
        term: 'Gradient Descent',
        definition: 'An optimization algorithm used to minimize a loss function by iteratively moving in the direction of steepest descent.',
        category: 'Optimization'
      },
      {
        term: 'Self-Attention',
        definition: 'A mechanism in Transformers that relates different positions of a sequence in order to compute a representation of the sequence.',
        category: 'Architecture'
      }
    ],
    overallQuiz: [
      {
        id: 'oq-nn-1',
        question: 'Why are non-linear activation functions crucial in neural networks?',
        options: [
          'They prevent GPU hardware overheating.',
          'Without non-linearity, multiple stacked layers collapse into a single linear transformation.',
          'They force all output numbers to be integers.',
          'They reduce the total dataset size required.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Linear combinations of linear functions are always linear. Non-linearities allow neural networks to model complex non-linear decision boundaries.',
        hint: 'Think about what happens when you multiply linear matrices together.'
      }
    ],
    references: [
      {
        title: 'Deep Learning Book by Goodfellow, Bengio, and Courville',
        url: 'https://www.deeplearningbook.org/',
        description: 'The definitive textbook on deep learning principles.'
      }
    ]
  }
];
