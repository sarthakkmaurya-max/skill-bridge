import { 
  AssessedSkillKey, 
  AssessmentQuestionItem, 
  SkillScoreItem, 
  RoleReadinessSummary, 
  RoleReadinessItem 
} from './types';

export const ASSESSMENT_QUESTIONS: AssessmentQuestionItem[] = [
  {
    id: 1,
    skillKey: 'html_css',
    skillName: 'HTML/CSS',
    category: 'technical',
    question: 'How confident are you with modern HTML5 semantics, responsive CSS layouts (Flexbox/Grid), and cross-browser styling?',
    description: 'Covers semantic document structure, mobile-first responsive design, modern CSS layout models, and UI performance.',
    levelDescriptors: {
      1: 'Novice: Basic tags knowledge, struggle with CSS layouts and centering.',
      2: 'Beginner: Can build simple responsive pages using templates or guidance.',
      3: 'Competent: Comfortable with Flexbox and CSS Grid, build clean mobile-first layouts.',
      4: 'Proficient: Strong mastery of CSS variables, animations, and accessible UI semantics.',
      5: 'Expert: Deep expertise in design systems, CSS architecture, and cross-browser rendering engines.'
    }
  },
  {
    id: 2,
    skillKey: 'javascript',
    skillName: 'JavaScript',
    category: 'technical',
    question: 'How confident are you in JavaScript ES6+, asynchronous programming (Promises, async/await), and DOM interactions?',
    description: 'Assesses closures, prototypes, event loop, asynchronous request handling, and data transformation.',
    levelDescriptors: {
      1: 'Novice: Understand variables, if/else, and basic loops.',
      2: 'Beginner: Can write functions, handle click events, and make basic fetch calls.',
      3: 'Competent: Solid grasp of ES6+ (destructuring, map/filter/reduce, async/await, modules).',
      4: 'Proficient: Master closures, event bubbling, error handling, and asynchronous workflows.',
      5: 'Expert: Advanced runtime knowledge, V8 optimization, memory management, and build toolchains.'
    }
  },
  {
    id: 3,
    skillKey: 'react',
    skillName: 'React',
    category: 'technical',
    question: 'How confident are you in developing reactive frontends with React, custom Hooks, state management, and component architecture?',
    description: 'Covers functional components, useState/useEffect/useContext, custom hooks, performance memoization, and component composition.',
    levelDescriptors: {
      1: 'Novice: Familiar with what React is, but have only written basic JSX.',
      2: 'Beginner: Can create simple components and pass basic props.',
      3: 'Competent: Build multi-page apps using hooks, Context API, and third-party UI libraries.',
      4: 'Proficient: Confident writing custom hooks, optimizing renders (useMemo/useCallback), and state patterns.',
      5: 'Expert: Architect scalable component libraries, microfrontends, SSR/Next.js, and complex state engines.'
    }
  },
  {
    id: 4,
    skillKey: 'git',
    skillName: 'Git',
    category: 'technical',
    question: 'How confident are you using Git for version control, branching strategies, and resolving merge conflicts?',
    description: 'Covers commits, branching, rebasing, merge conflict resolution, and collaborative GitHub/GitLab pull request workflows.',
    levelDescriptors: {
      1: 'Novice: Know git add, commit, and push, but get confused when branches diverge.',
      2: 'Beginner: Can create branches, pull changes, and open pull requests.',
      3: 'Competent: Confident with feature branching, resolving common merge conflicts, and PR reviews.',
      4: 'Proficient: Regularly use interactive rebase, cherry-pick, stash, and git hooks.',
      5: 'Expert: Git wizard: automate CI/CD release branching, manage submodules, and recover orphaned commits.'
    }
  },
  {
    id: 5,
    skillKey: 'sql',
    skillName: 'SQL',
    category: 'technical',
    question: 'How confident are you writing SQL queries, modeling relational schemas, and joining tables?',
    description: 'Assesses schema design, multi-table JOINs, GROUP BY aggregations, subqueries, and relational indexing.',
    levelDescriptors: {
      1: 'Novice: Can write basic SELECT, INSERT, and WHERE queries.',
      2: 'Beginner: Familiar with INNER/LEFT JOIN and basic aggregations (COUNT, SUM).',
      3: 'Competent: Write complex queries with multiple JOINs, GROUP BY, HAVING, and indexes.',
      4: 'Proficient: Confident with window functions, CTEs, transaction isolation, and query plans (EXPLAIN).',
      5: 'Expert: Database architect: optimize complex stored procedures, partitioning, sharding, and high-concurrency ACID transactions.'
    }
  },
  {
    id: 6,
    skillKey: 'python',
    skillName: 'Python',
    category: 'technical',
    question: 'How confident are you using Python for scripting, data manipulation, or backend APIs?',
    description: 'Assesses data structures (lists, dicts, sets), OOP, scripting, data libraries, and backend frameworks.',
    levelDescriptors: {
      1: 'Novice: Understand Python syntax, variables, and basic control statements.',
      2: 'Beginner: Can write scripts with functions, file I/O, and install pip packages.',
      3: 'Competent: Comfortable using Python for REST APIs (FastAPI/Flask) or data analysis (Pandas/NumPy).',
      4: 'Proficient: Idiomatic Pythonic code (generators, decorators, comprehensions) with automated unit testing.',
      5: 'Expert: Build high-throughput asynchronous services, distributed worker pipelines, or machine learning systems.'
    }
  },
  {
    id: 7,
    skillKey: 'communication',
    skillName: 'Communication',
    category: 'soft_skill',
    question: 'How effectively can you communicate technical concepts, write documentation, and present project progress?',
    description: 'Assesses clarity in technical writing, code review communication, client/stakeholder demos, and asynchronous updates.',
    levelDescriptors: {
      1: 'Novice: Prefer not speaking in tech discussions; struggle to write clear documentation.',
      2: 'Beginner: Can explain code when asked, but need help organizing technical presentations.',
      3: 'Competent: Clearly explain technical choices in meetings, write good pull request summaries and docs.',
      4: 'Proficient: Articulate architectural trade-offs to non-technical stakeholders with poise and clarity.',
      5: 'Expert: Executive-level communicator: inspire teams, lead technical RFC discussions, and author industry specs.'
    }
  },
  {
    id: 8,
    skillKey: 'teamwork',
    skillName: 'Teamwork',
    category: 'soft_skill',
    question: 'How effectively do you collaborate within agile engineering teams, conduct code reviews, and resolve disagreements?',
    description: 'Evaluates empathy in code reviews, agile ceremony participation (standups, retros), and collaborative problem solving.',
    levelDescriptors: {
      1: 'Novice: Prefer working entirely alone on isolated tasks without dependencies.',
      2: 'Beginner: Participate in team meetings and accept assigned tasks cheerfully.',
      3: 'Competent: Active team player: give constructive PR reviews, unblock peers, and follow team norms.',
      4: 'Proficient: Foster psychological safety, mentor junior peers, and resolve technical friction constructively.',
      5: 'Expert: Cultural catalyst: elevate team velocity, drive cross-functional alignment, and build collaborative team culture.'
    }
  },
  {
    id: 9,
    skillKey: 'problem_solving',
    skillName: 'Problem Solving',
    category: 'soft_skill',
    question: 'How effectively do you diagnose bugs, break down complex requirements, and devise algorithmic solutions?',
    description: 'Assesses root cause debugging, system-level decomposition, edge case handling, and analytical troubleshooting.',
    levelDescriptors: {
      1: 'Novice: Easily overwhelmed when code fails; rely heavily on trial-and-error changes.',
      2: 'Beginner: Can debug straightforward errors using console logs and Google/Stack Overflow.',
      3: 'Competent: Methodically reproduce bugs, isolate failure points, and decompose user stories into clean tasks.',
      4: 'Proficient: Anticipate subtle edge cases, optimize algorithmic complexity, and conduct deep root cause post-mortems.',
      5: 'Expert: World-class troubleshooter: diagnose esoteric distributed system race conditions and performance bottlenecks.'
    }
  },
  {
    id: 10,
    skillKey: 'adaptability',
    skillName: 'Adaptability',
    category: 'soft_skill',
    question: 'How quickly can you learn unfamiliar frameworks, respond to shifting project requirements, and embrace change?',
    description: 'Evaluates continuous learning velocity, resilience under changing priorities, and comfort with ambiguity.',
    levelDescriptors: {
      1: 'Novice: Anxious when requirements change; strongly resist moving away from familiar tools.',
      2: 'Beginner: Can pick up new syntax with time and structured tutorial support.',
      3: 'Competent: Read documentation, pick up unfamiliar libraries rapidly, and adapt to changing sprint priorities.',
      4: 'Proficient: Thrive in dynamic fast-paced environments; actively experiment with emerging engineering tools.',
      5: 'Expert: Master of continuous adaptation: rapidly transition between languages and tech stacks without productivity loss.'
    }
  }
];

// Weighted skill distribution for transparent rule-based scoring (sum = 100% per role)
interface SkillWeights {
  weights: Partial<Record<AssessedSkillKey, number>>;
  description: string;
}

export const ROLE_WEIGHTS: Record<'frontend' | 'data_analyst' | 'backend', SkillWeights> = {
  frontend: {
    description: 'Specializes in reactive user interfaces, client state architecture, and accessible web experiences.',
    // Target skills: HTML/CSS, JavaScript, React, Git, communication
    weights: {
      react: 0.30,
      javascript: 0.25,
      html_css: 0.20,
      git: 0.15,
      communication: 0.10,
    }
  },
  data_analyst: {
    description: 'Extracts actionable business intelligence, analyzes data pipelines, and creates insightful visual dashboards.',
    // Target skills: SQL, Python, problem solving, communication
    weights: {
      sql: 0.30,
      python: 0.30,
      problem_solving: 0.20,
      communication: 0.20,
    }
  },
  backend: {
    description: 'Designs reliable REST/gRPC APIs, microservice architectures, database queries, and secure system pipelines.',
    // Target skills: JavaScript, Python, SQL, Git, problem solving
    weights: {
      sql: 0.25,
      python: 0.25,
      javascript: 0.20,
      git: 0.15,
      problem_solving: 0.15,
    }
  }
};

export interface RoleReadinessCalculationResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  overallScore: number;
  skillScores: Record<AssessedSkillKey, SkillScoreItem>;
  roleReadiness: RoleReadinessSummary;
  recommendedRole: string;
  recommendationMessage: string;
}

// Preset benchmark answers for verifying distinct role results
export const FRONTEND_FOCUSED_ANSWERS: Record<number, number> = {
  1: 5, // HTML/CSS (5/5)
  2: 5, // JavaScript (5/5)
  3: 5, // React (5/5)
  4: 5, // Git (5/5)
  5: 1, // SQL (1/5)
  6: 1, // Python (1/5)
  7: 5, // Communication (5/5)
  8: 4, // Teamwork (4/5)
  9: 2, // Problem Solving (2/5)
  10: 3 // Adaptability (3/5)
};

export const DATA_FOCUSED_ANSWERS: Record<number, number> = {
  1: 1, // HTML/CSS (1/5)
  2: 1, // JavaScript (1/5)
  3: 1, // React (1/5)
  4: 2, // Git (2/5)
  5: 5, // SQL (5/5)
  6: 5, // Python (5/5)
  7: 5, // Communication (5/5)
  8: 4, // Teamwork (4/5)
  9: 5, // Problem Solving (5/5)
  10: 3 // Adaptability (3/5)
};

/**
 * Transparent, rule-based role readiness calculation engine
 * Computes deterministic weighted percentages from the 10 submitted answers
 */
export function calculateRoleReadiness(answers: Record<number, number> | Record<string, number>): RoleReadinessCalculationResult {
  let rawTotal = 0;
  const maxPossibleRaw = ASSESSMENT_QUESTIONS.length * 5; // 10 * 5 = 50

  const skillScores = {} as Record<AssessedSkillKey, SkillScoreItem>;
  const rawAnswers = (answers || {}) as Record<string | number, unknown>;

  // 1. Process individual skill scores from submitted answers
  for (const q of ASSESSMENT_QUESTIONS) {
    const rawValue =
      rawAnswers[q.id] ??
      rawAnswers[String(q.id)] ??
      rawAnswers[q.skillKey] ??
      1;

    const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue) || 1;
    // Clamp rating between 1 and 5
    const clampedRating = Math.max(1, Math.min(5, Math.round(numericValue)));
    rawTotal += clampedRating;

    const skillPercentage = Math.round((clampedRating / 5) * 100);
    const isStrength = clampedRating >= 4; // Rating 4 or 5 is a strength
    const isGap = clampedRating <= 3;      // Rating 1, 2, or 3 is a gap

    skillScores[q.skillKey] = {
      skillKey: q.skillKey,
      name: q.skillName,
      score: clampedRating,
      maxScore: 5,
      percentage: skillPercentage,
      isStrength,
      isGap,
    };
  }

  const overallPercentage = Math.round((rawTotal / maxPossibleRaw) * 100);

  // Helper to evaluate a specific career role
  const evaluateRole = (
    roleKey: 'frontend' | 'data_analyst' | 'backend',
    roleLabel: string
  ): RoleReadinessItem => {
    const { weights } = ROLE_WEIGHTS[roleKey];
    let weightedSum = 0;
    const strengths: string[] = [];
    const gaps: string[] = [];

    for (const [keyStr, weight] of Object.entries(weights)) {
      const skillKey = keyStr as AssessedSkillKey;
      const skillItem = skillScores[skillKey];
      if (skillItem && weight) {
        weightedSum += skillItem.percentage * weight;
        if (skillItem.isStrength) {
          strengths.push(skillItem.name);
        } else if (skillItem.isGap) {
          gaps.push(skillItem.name);
        }
      }
    }

    const percentage = Math.min(100, Math.max(0, Math.round(weightedSum)));

    let recommendation = '';
    if (gaps.length === 0) {
      recommendation = `Outstanding readiness for ${roleLabel}! You meet or exceed all industry benchmark competencies.`;
    } else if (gaps.length === 1) {
      recommendation = `You are ${percentage}% ready for ${roleLabel}. Improve ${gaps[0]} to reach peak industry readiness.`;
    } else {
      recommendation = `You are ${percentage}% ready for ${roleLabel}. Focus on improving ${gaps.slice(0, 2).join(' and ')} to unlock priority shortlists.`;
    }

    return {
      percentage,
      strengths,
      gaps,
      missingSkills: gaps,
      recommendation,
    };
  };

  const frontendItem = evaluateRole('frontend', 'Frontend Developer');
  const dataAnalystItem = evaluateRole('data_analyst', 'Data Analyst');
  const backendItem = evaluateRole('backend', 'Backend Developer');

  // Determine top recommended role based on calculated readiness scores
  const roleCandidates = [
    { key: 'frontend', title: 'Frontend Developer', score: frontendItem.percentage, item: frontendItem },
    { key: 'data_analyst', title: 'Data Analyst', score: dataAnalystItem.percentage, item: dataAnalystItem },
    { key: 'backend', title: 'Backend Developer', score: backendItem.percentage, item: backendItem },
  ];

  // Sort descending by calculated score
  roleCandidates.sort((a, b) => b.score - a.score);
  const bestFit = roleCandidates[0];

  const roleReadiness: RoleReadinessSummary = {
    frontend: frontendItem,
    backend: backendItem,
    dataAnalyst: dataAnalystItem,
    recommendedRole: bestFit.title,
    recommendationMessage: bestFit.item.recommendation,
  };

  return {
    totalScore: rawTotal,
    maxScore: maxPossibleRaw,
    percentage: bestFit.score, // Best-fit career track readiness percentage
    overallScore: overallPercentage,
    skillScores,
    roleReadiness,
    recommendedRole: bestFit.title,
    recommendationMessage: bestFit.item.recommendation,
  };
}