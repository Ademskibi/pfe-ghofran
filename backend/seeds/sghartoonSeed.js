/**
 * Seed file for Sghartoon test data
 * Initializes Test collection with dyslexia and dyscalculia questions
 * Based on Tunisian curriculum (MEN) and clinical standards (DSM-5, ODÉDYS 2)
 * 
 * Run: node backend/seeds/sghartoonSeed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Test = require('../models/Test');
const connectDB = require('../db');

// Question bank data
const DYSLEXIA_QUESTIONS = [
  // Complexity A (1st-2nd year)
  {
    id: "dy_A1", complexity: 1, questionType: "choice",
    instruction: "Laquelle de ces lettres est un « b » ?",
    stimulus: "b   d   p   q",
    choices: ["b", "d", "p", "q"],
    answer: "b",
    timeLimit: 15,
    domain_category: "Discrimination visuelle (b/d/p/q)",
    curriculum: "1ère-2ème"
  },
  {
    id: "dy_A2", complexity: 1, questionType: "choice",
    instruction: "Quel dessin correspond au mot « SOLEIL » ?",
    stimulus: "SOLEIL",
    choices: ["☀️", "🌙", "⭐", "🌈"],
    answer: "☀️",
    timeLimit: 20,
    domain_category: "Décodage lexical global",
    curriculum: "1ère-2ème"
  },
  {
    id: "dy_A3", complexity: 1, questionType: "choice",
    instruction: "Quel mot commence par le même son que 🐱 « CHAT » ?",
    choices: ["cheval", "bateau", "maison", "poule"],
    answer: "cheval",
    timeLimit: 18,
    domain_category: "Conscience phonémique — phonème initial",
    curriculum: "1ère-2ème"
  },
  {
    id: "dy_A4", complexity: 1, questionType: "choice",
    instruction: "Combien de sons entends-tu dans le mot « SOL » ?",
    stimulus: "SOL",
    choices: ["1", "2", "3", "4"],
    answer: "3",
    timeLimit: 18,
    domain_category: "Segmentation phonémique",
    curriculum: "1ère-2ème"
  },
  {
    id: "dy_A5", complexity: 1, questionType: "choice",
    instruction: "Quel mot est identique au modèle ?",
    stimulus: "PAPA",
    choices: ["PABA", "PAPA", "BAPA", "PADA"],
    answer: "PAPA",
    timeLimit: 15,
    domain_category: "Reconnaissance visuelle",
    curriculum: "1ère-2ème"
  },
  {
    id: "dy_A6", complexity: 1, questionType: "choice",
    instruction: "Quel mot rime avec « CHAT » ?",
    choices: ["chien", "rat", "cheval", "poule"],
    answer: "rat",
    timeLimit: 18,
    domain_category: "Conscience des rimes",
    curriculum: "1ère-2ème"
  },
  {
    id: "dy_A7", complexity: 1, questionType: "choice",
    instruction: "Quel mot a 2 syllabes ?",
    choices: ["soleil", "chat", "ballon", "eau"],
    answer: "ballon",
    timeLimit: 18,
    domain_category: "Segmentation syllabique",
    curriculum: "1ère-2ème"
  },
  {
    id: "dy_A8", complexity: 1, questionType: "choice",
    instruction: "Quel son entends-tu à la FIN du mot « CHEVAL » ?",
    stimulus: "🐴 CHEVAL",
    choices: ["[ch]", "[va]", "[al]", "[che]"],
    answer: "[al]",
    timeLimit: 20,
    domain_category: "Conscience phonémique — phonème final",
    curriculum: "1ère-2ème"
  },
  {
    id: "dy_A9", complexity: 1, questionType: "text",
    instruction: "Écoute et écris le mot que tu entends",
    stimulus: "🏠",
    answer: "maison",
    timeLimit: 35,
    domain_category: "Orthographe phonologique",
    curriculum: "1ère-2ème",
    dictation: "maison"
  },
  {
    id: "dy_A10", complexity: 1, questionType: "choice",
    instruction: "Quel mot est le même que le modèle ?",
    stimulus: "ILE",
    choices: ["ELI", "LIE", "ILE", "EIL"],
    answer: "ILE",
    timeLimit: 15,
    domain_category: "Discrimination visuelle — inversions",
    curriculum: "1ère-2ème"
  },
  // Complexity B (3rd-4th year)
  {
    id: "dy_B1", complexity: 2, questionType: "choice",
    instruction: "Quel mot est écrit correctement ?",
    choices: ["bateau", "bateou", "batau", "bato"],
    answer: "bateau",
    timeLimit: 18,
    domain_category: "Orthographe lexicale",
    curriculum: "3ème-4ème"
  },
  {
    id: "dy_B2", complexity: 2, questionType: "choice",
    instruction: "Si on enlève le son [p] dans « PAIN », que reste-t-il ?",
    stimulus: "PAIN → ? (enlève [p])",
    choices: ["[in]", "[an]", "[un]", "[ain]"],
    answer: "[ain]",
    timeLimit: 22,
    domain_category: "Suppression phonémique",
    curriculum: "3ème-4ème"
  },
  {
    id: "dy_B3", complexity: 2, questionType: "choice",
    instruction: "Combien de syllabes dans « PAPILLON » ?",
    stimulus: "🦋 PAPILLON",
    choices: ["2", "3", "4", "5"],
    answer: "3",
    timeLimit: 18,
    domain_category: "Segmentation syllabique — mots longs",
    curriculum: "3ème-4ème"
  },
  {
    id: "dy_B4", complexity: 2, questionType: "text",
    instruction: "Écoute et écris le mot dicté",
    stimulus: "🚂",
    answer: "locomotive",
    timeLimit: 40,
    domain_category: "Orthographe phonologique — mot long",
    curriculum: "3ème-4ème",
    dictation: "locomotive"
  },
  {
    id: "dy_B5", complexity: 2, questionType: "choice",
    instruction: "Quel mot commence par le son [f] ?",
    choices: ["vache", "phoques", "balle", "dent"],
    answer: "phoques",
    timeLimit: 18,
    domain_category: "Correspondance graphème-phonème",
    curriculum: "3ème-4ème"
  },
  // Complexity C (5th-6th year)
  {
    id: "dy_C1", complexity: 3, questionType: "choice",
    instruction: "Lequel est écrit correctement ?",
    choices: ["rhythme", "ritme", "rythme", "rhytme"],
    answer: "rythme",
    timeLimit: 22,
    domain_category: "Orthographe lexicale avancée",
    curriculum: "5ème-6ème"
  },
  {
    id: "dy_C2", complexity: 3, questionType: "choice",
    instruction: "Quel mot contient le son [ks] ?",
    choices: ["maison", "taxi", "ballon", "soleil"],
    answer: "taxi",
    timeLimit: 20,
    domain_category: "Graphème-phonème complexe",
    curriculum: "5ème-6ème"
  },
  {
    id: "dy_C3", complexity: 3, questionType: "text",
    instruction: "Écoute et écris le mot dicté",
    stimulus: "🔬",
    answer: "chrysanthème",
    timeLimit: 45,
    domain_category: "Orthographe complexe — mots savants",
    curriculum: "5ème-6ème",
    dictation: "chrysanthème"
  },
  {
    id: "dy_C4", complexity: 3, questionType: "choice",
    instruction: "Laquelle de ces paires est identique ?",
    choices: ["PAREIL / PAREIL", "JARDIN / JADRIN", "MIROIR / MIROIL", "CHEMIN / CHEMIN"],
    answer: "PAREIL / PAREIL",
    timeLimit: 22,
    domain_category: "Discrimination visuelle fine",
    curriculum: "5ème-6ème"
  },
  {
    id: "dy_C5", complexity: 3, questionType: "choice",
    instruction: "Quel mot est un homonyme de « VER » ?",
    choices: ["ver", "vers", "vert", "verre"],
    answer: "verre",
    timeLimit: 20,
    domain_category: "Homonymes et sens lexical",
    curriculum: "5ème-6ème"
  },
  {
    id: "dy_C6", complexity: 3, questionType: "text",
    instruction: "Écoute et écris la phrase dictée",
    stimulus: "✏️",
    answer: "les oiseaux chantent",
    timeLimit: 50,
    domain_category: "Orthographe en contexte",
    curriculum: "5ème-6ème",
    dictation: "les oiseaux chantent"
  },
  {
    id: "dy_C7", complexity: 3, questionType: "choice",
    instruction: "Quel préfixe donne le contraire de POSSIBLE ?",
    choices: ["im-", "in-", "dé-", "re-"],
    answer: "im-",
    timeLimit: 22,
    domain_category: "Morphologie dérivationnelle",
    curriculum: "5ème-6ème"
  }
];

const DYSCALCULIA_QUESTIONS = [
  // Complexity A (1st-2nd year)
  {
    id: "dc_A1", complexity: 1, questionType: "choice",
    instruction: "Quel groupe a le plus de points ?",
    stimulus: "A: ● ●   B: ● ● ● ●",
    choices: ["A (2)", "B (4)", "Pareil", "Je ne sais pas"],
    answer: "B (4)",
    timeLimit: 15,
    domain_category: "Sens du nombre — subitizing",
    curriculum: "1ère-2ème"
  },
  {
    id: "dc_A2", complexity: 1, questionType: "choice",
    instruction: "Combien de 🍎 y a-t-il ?",
    stimulus: "🍎 🍎 🍎",
    choices: ["2", "3", "4", "5"],
    answer: "3",
    timeLimit: 15,
    domain_category: "Cardinalité",
    curriculum: "1ère-2ème"
  },
  {
    id: "dc_A3", complexity: 1, questionType: "choice",
    instruction: "Quel chiffre est le plus grand ?",
    stimulus: "3   7   5   2",
    choices: ["3", "7", "5", "2"],
    answer: "7",
    timeLimit: 15,
    domain_category: "Comparaison de quantités",
    curriculum: "1ère-2ème"
  },
  {
    id: "dc_A4", complexity: 1, questionType: "choice",
    instruction: "Quelle suite est dans le bon ordre ?",
    choices: ["1,2,3,4", "2,1,4,3", "4,3,2,1", "1,3,2,4"],
    answer: "1,2,3,4",
    timeLimit: 18,
    domain_category: "Ordre numérique",
    curriculum: "1ère-2ème"
  },
  {
    id: "dc_A5", complexity: 1, questionType: "text",
    instruction: "Combien font 2 + 3 ?",
    stimulus: "2 + 3 = ?",
    answer: "5",
    timeLimit: 20,
    domain_category: "Addition simple — faits mémorisés",
    curriculum: "1ère-2ème"
  },
  {
    id: "dc_A6", complexity: 1, questionType: "choice",
    instruction: "Quel nombre vient juste après 6 ?",
    stimulus: "5 → 6 → ?",
    choices: ["5", "7", "8", "4"],
    answer: "7",
    timeLimit: 15,
    domain_category: "Succession numérique",
    curriculum: "1ère-2ème"
  },
  {
    id: "dc_A7", complexity: 1, questionType: "choice",
    instruction: "Tu as 4 🍬. Tu en manges 1. Combien reste-t-il ?",
    stimulus: "🍬🍬🍬🍬  →  mange 1",
    choices: ["2", "3", "4", "5"],
    answer: "3",
    timeLimit: 20,
    domain_category: "Soustraction concrète",
    curriculum: "1ère-2ème"
  },
  {
    id: "dc_A8", complexity: 1, questionType: "choice",
    instruction: "Quel nombre se trouve entre 3 et 7 ?",
    stimulus: "3  ?  7",
    choices: ["2", "5", "8", "10"],
    answer: "5",
    timeLimit: 18,
    domain_category: "Ligne numérique mentale",
    curriculum: "1ère-2ème"
  },
  {
    id: "dc_A9", complexity: 1, questionType: "choice",
    instruction: "Quel groupe a MOINS de formes ?",
    stimulus: "A: ▲▲▲▲▲   B: ■■■",
    choices: ["A", "B", "Pareil", "Je ne sais pas"],
    answer: "B",
    timeLimit: 15,
    domain_category: "Sens du nombre non symbolique (ANS)",
    curriculum: "1ère-2ème"
  },
  {
    id: "dc_A10", complexity: 1, questionType: "choice",
    instruction: "Quel chiffre manque ? 1, 2, ?, 4",
    stimulus: "1  2  ?  4",
    choices: ["0", "3", "5", "6"],
    answer: "3",
    timeLimit: 18,
    domain_category: "Suite numérique",
    curriculum: "1ère-2ème"
  },
  // Complexity B (3rd-4th year)
  {
    id: "dc_B1", complexity: 2, questionType: "choice",
    instruction: "Quel nombre est le plus grand ?",
    stimulus: "47   93   28   61",
    choices: ["47", "93", "28", "61"],
    answer: "93",
    timeLimit: 15,
    domain_category: "Comparaison — nombres à 2 chiffres",
    curriculum: "3ème-4ème"
  },
  {
    id: "dc_B2", complexity: 2, questionType: "text",
    instruction: "Calcule : 4 + 5 = ?",
    stimulus: "4 + 5 = ?",
    answer: "9",
    timeLimit: 22,
    domain_category: "Addition mémorisée",
    curriculum: "3ème-4ème"
  },
  {
    id: "dc_B3", complexity: 2, questionType: "text",
    instruction: "Calcule : 10 – 3 = ?",
    stimulus: "10 – 3 = ?",
    answer: "7",
    timeLimit: 22,
    domain_category: "Soustraction mémorisée",
    curriculum: "3ème-4ème"
  },
  {
    id: "dc_B4", complexity: 2, questionType: "choice",
    instruction: "Quel symbole convient ? 7 ? 12",
    stimulus: "7  ?  12",
    choices: ["<", ">", "=", "≠"],
    answer: "<",
    timeLimit: 15,
    domain_category: "Comparaison et symboles mathématiques",
    curriculum: "3ème-4ème"
  },
  {
    id: "dc_B5", complexity: 2, questionType: "choice",
    instruction: "Tu as 5 🍬 et tu en donnes 2. Combien reste-t-il ?",
    stimulus: "🍬🍬🍬🍬🍬",
    choices: ["2", "3", "4", "7"],
    answer: "3",
    timeLimit: 20,
    domain_category: "Problème arithmétique — énoncé",
    curriculum: "3ème-4ème"
  },
  // Complexity C (5th-6th year)
  {
    id: "dc_C1", complexity: 3, questionType: "text",
    instruction: "Calcule : 48 + 37 = ?",
    stimulus: "48 + 37 = ?",
    answer: "85",
    timeLimit: 30,
    domain_category: "Addition avec retenue",
    curriculum: "5ème-6ème"
  },
  {
    id: "dc_C2", complexity: 3, questionType: "text",
    instruction: "Calcule : 72 – 28 = ?",
    stimulus: "72 – 28 = ?",
    answer: "44",
    timeLimit: 30,
    domain_category: "Soustraction avec emprunt",
    curriculum: "5ème-6ème"
  },
  {
    id: "dc_C3", complexity: 3, questionType: "text",
    instruction: "Calcule : 7 × 8 = ?",
    stimulus: "7 × 8 = ?",
    answer: "56",
    timeLimit: 20,
    domain_category: "Tables de multiplication — mémorisation",
    curriculum: "5ème-6ème"
  },
  {
    id: "dc_C4", complexity: 3, questionType: "text",
    instruction: "Calcule : 15 × 4 = ?",
    stimulus: "15 × 4 = ?",
    answer: "60",
    timeLimit: 35,
    domain_category: "Multiplication multi-chiffres",
    curriculum: "5ème-6ème"
  },
  {
    id: "dc_C5", complexity: 3, questionType: "choice",
    instruction: "Un article coûte 8 DT. Tu paies avec 20 DT. Quelle monnaie reçois-tu ?",
    choices: ["10 DT", "12 DT", "8 DT", "14 DT"],
    answer: "12 DT",
    timeLimit: 28,
    domain_category: "Problème de vie quotidienne — monnaie tunisienne",
    curriculum: "5ème-6ème"
  },
  {
    id: "dc_C6", complexity: 3, questionType: "choice",
    instruction: "Quelle est la moitié de 124 ?",
    choices: ["60", "61", "62", "63"],
    answer: "62",
    timeLimit: 25,
    domain_category: "Valeur de la moitié",
    curriculum: "5ème-6ème"
  },
  {
    id: "dc_C7", complexity: 3, questionType: "text",
    instruction: "Calcule : 100 – 37 = ?",
    stimulus: "100 – 37 = ?",
    answer: "63",
    timeLimit: 30,
    domain_category: "Soustraction à deux chiffres",
    curriculum: "5ème-6ème"
  },
  {
    id: "dc_C8", complexity: 3, questionType: "choice",
    instruction: "Suite : 5, 10, 20, 40, … ?",
    choices: ["60", "70", "80", "90"],
    answer: "80",
    timeLimit: 25,
    domain_category: "Suite géométrique",
    curriculum: "5ème-6ème"
  }
];

async function seedTests() {
  try {
    await connectDB();

    // Clear existing tests
    await Test.deleteMany({});
    console.log('✓ Cleared existing tests');

    // Create dyslexia test
    const dyslexiaTest = new Test({
      domain: 'dyslexia',
      title: 'Dépistage de la Dyslexie — Sghartoon',
      description: 'Test adaptatif de dépistage de la dyslexie pour élèves de 1ère à 6ème année de base tunisienne',
      ageRange: '6-11',
      difficulty: 'A,B,C',
      duration: 20 * 60, // 20 minutes
      version: '1.0',
      questions: DYSLEXIA_QUESTIONS
    });

    await dyslexiaTest.save();
    console.log('✓ Created Dyslexia test with', DYSLEXIA_QUESTIONS.length, 'questions');

    // Create dyscalculia test
    const dyscalculiaTest = new Test({
      domain: 'dyscalculia',
      title: 'Dépistage de la Dyscalculie — Sghartoon',
      description: 'Test adaptatif de dépistage de la dyscalculie pour élèves de 1ère à 6ème année de base tunisienne',
      ageRange: '6-11',
      difficulty: 'A,B,C',
      duration: 20 * 60, // 20 minutes
      version: '1.0',
      questions: DYSCALCULIA_QUESTIONS
    });

    await dyscalculiaTest.save();
    console.log('✓ Created Dyscalculia test with', DYSCALCULIA_QUESTIONS.length, 'questions');

    console.log('\n✅ Sghartoon test data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding tests:', err);
    process.exit(1);
  }
}

seedTests();
