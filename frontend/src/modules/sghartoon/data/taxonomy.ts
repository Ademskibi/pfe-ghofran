export interface GravityLevel {
  code: 'G0' | 'G1' | 'G2' | 'G3';
  label: string;
  color: string;
  bg: string;
  ic: string;
  desc: string;
}

export const GRAVITY_LEVELS: Record<'G0' | 'G1' | 'G2' | 'G3', GravityLevel> = {
  G0: {
    code: 'G0',
    label: 'Dans la norme',
    color: '#94a3b8',
    bg: '#f1f5f9',
    ic: '✅',
    desc: 'Performances dans la norme curriculaire tunisienne. Aucune action spécifique requise.',
  },
  G1: {
    code: 'G1',
    label: 'Léger',
    color: '#16a34a',
    bg: '#dcfce7',
    ic: '🟡',
    desc: 'Difficultés légères détectées. L\'élève peut compenser avec un soutien pédagogique adapté.',
  },
  G2: {
    code: 'G2',
    label: 'Modéré',
    color: '#d97706',
    bg: '#fef3c7',
    ic: '🟠',
    desc: 'Difficultés significatives affectant les apprentissages. Différenciation pédagogique urgente et orientation recommandée.',
  },
  G3: {
    code: 'G3',
    label: 'Sévère',
    color: '#dc2626',
    bg: '#fee2e2',
    ic: '🔴',
    desc: 'Difficultés majeures. Orientation vers orthophoniste ou neuropsychologue indispensable. Aménagements scolaires immédiats.',
  },
};

export const scoreToGravity = (score: number): GravityLevel => {
  if (score < 0.2) return GRAVITY_LEVELS.G0;
  if (score < 0.4) return GRAVITY_LEVELS.G1;
  if (score < 0.65) return GRAVITY_LEVELS.G2;
  return GRAVITY_LEVELS.G3;
};

export const ageToComplexityPool = (age: number): 1 | 2 | 3 => {
  if (age <= 7) return 1;
  if (age <= 9) return 2;
  return 3;
};

export const CURRICULUM: Record<
  'dyslexia' | 'dyscalculia',
  Record<string, { label: string; competences: string[] }>
> = {
  dyslexia: {
    '1ère-2ème': {
      label: '1ère–2ème année (6–7 ans)',
      competences: [
        'Identifier les lettres de l\'alphabet (arabe et latin)',
        'Distinguer les sons de la langue (phonèmes initiaux, finaux)',
        'Segmenter les mots en syllabes',
        'Associer un mot simple à son image',
        'Reconnaître des mots courants du vocabulaire de base',
      ],
    },
    '3ème-4ème': {
      label: '3ème–4ème année (8–9 ans)',
      competences: [
        'Lire couramment des textes courts',
        'Écrire sous dictée des mots et phrases simples',
        'Appliquer les règles de correspondance graphème-phonème',
        'Identifier les syllabes dans des mots plurisyllabiques',
        'Utiliser le vocabulaire du domaine étudié',
      ],
    },
    '5ème-6ème': {
      label: '5ème–6ème année (10–11 ans)',
      competences: [
        'Lire et comprendre des textes complexes',
        'Écrire des textes cohérents avec orthographe maîtrisée',
        'Identifier les familles de mots et les préfixes/suffixes',
        'Utiliser le dictionnaire et les outils de référence',
        'Maîtriser les homophones grammaticaux courants',
      ],
    },
  },
  dyscalculia: {
    '1ère-2ème': {
      label: '1ère–2ème année (6–7 ans)',
      competences: [
        'Dénombrer et comparer des collections (jusqu\'à 20)',
        'Connaître la suite numérique jusqu\'à 100',
        'Effectuer des additions et soustractions simples (≤ 10)',
        'Reconnaître les chiffres arabes et leurs valeurs',
        'Résoudre des problèmes concrets avec objets',
      ],
    },
    '3ème-4ème': {
      label: '3ème–4ème année (8–9 ans)',
      competences: [
        'Maîtriser les tables d\'addition et soustraction (≤ 20)',
        'Débuter les tables de multiplication (×2, ×5, ×10)',
        'Comprendre la valeur positionnelle (unités, dizaines, centaines)',
        'Lire et écrire les nombres jusqu\'à 1000',
        'Résoudre des problèmes à une ou deux opérations',
      ],
    },
    '5ème-6ème': {
      label: '5ème–6ème année (10–11 ans)',
      competences: [
        'Maîtriser toutes les tables de multiplication (jusqu\'à ×9)',
        'Effectuer des opérations sur les fractions simples',
        'Résoudre des problèmes à plusieurs étapes',
        'Calculer des périmètres et surfaces simples',
        'Lire l\'heure et effectuer des conversions de mesures',
      ],
    },
  },
};
