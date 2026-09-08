const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    category: 'Technical',
    competency: 'React & State Management',
    roleAffinity: ['frontend'],
    question: 'In React, which hook is primarily used to perform side effects like data fetching or subscriptions?',
    options: [
      'useState',
      'useEffect',
      'useMemo',
      'useReducer',
    ],
    correctAnswer: 'useEffect',
    explanation: 'useEffect is the standard Hook for executing side-effects in functional React components.',
  },
  {
    id: 2,
    category: 'Technical',
    competency: 'Modern JavaScript (ES6+)',
    roleAffinity: ['frontend', 'backend'],
    question: 'What is the primary difference between synchronous and asynchronous code execution in JavaScript?',
    options: [
      'Asynchronous code runs on a separate thread pool automatically managed by the browser hardware',
      'Asynchronous code does not block the main thread and relies on the Event Loop and Callback Queue',
      'Synchronous code can only execute inside async functions',
      'There is no difference; modern V8 engines execute everything concurrently',
    ],
    correctAnswer: 'Asynchronous code does not block the main thread and relies on the Event Loop and Callback Queue',
    explanation: 'JavaScript is single-threaded; asynchronous operations are scheduled via the Event Loop to keep the main thread responsive.',
  },
  {
    id: 3,
    category: 'Technical',
    competency: 'RESTful API Architecture',
    roleAffinity: ['backend'],
    question: 'Which HTTP method is considered idempotent and used in REST standards to replace an entire existing resource?',
    options: [
      'POST',
      'PATCH',
      'PUT',
      'CONNECT',
    ],
    correctAnswer: 'PUT',
    explanation: 'PUT is idempotent and replaces the target resource with the requested payload, whereas POST is typically non-idempotent.',
  },
  {
    id: 4,
    category: 'Technical',
    competency: 'Node.js & Express Middleware',
    roleAffinity: ['backend'],
    question: 'In an Express.js middleware function, what happens if neither res.send() nor next() is called?',
    options: [
      'The server immediately throws an UnhandledPromiseRejection error',
      'Express automatically returns HTTP 200 OK after 100 milliseconds',
      'The client request hangs indefinitely until a timeout occurs',
      'The request is restarted from the first middleware in the pipeline',
    ],
    correctAnswer: 'The client request hangs indefinitely until a timeout occurs',
    explanation: 'Without invoking next() to transfer control or sending a response with res, the HTTP connection remains open and hangs.',
  },
  {
    id: 5,
    category: 'Technical',
    competency: 'Database Design & Indexing',
    roleAffinity: ['backend', 'dataAnalyst'],
    question: 'Why are database indexes (e.g., B-Tree indexes) applied to frequently queried columns?',
    options: [
      'They reduce disk space usage by compressing table records',
      'They speed up read query retrieval times at the cost of slight overhead on write operations',
      'They automatically encrypt sensitive user information at rest',
      'They guarantee zero null values can be stored in the table',
    ],
    correctAnswer: 'They speed up read query retrieval times at the cost of slight overhead on write operations',
    explanation: 'Indexes create lookup data structures that dramatically accelerate search queries, with slight write overhead on inserts and updates.',
  },
  {
    id: 6,
    category: 'Technical',
    competency: 'SQL & Data Aggregation',
    roleAffinity: ['dataAnalyst'],
    question: 'Which SQL clause is used to filter the results of grouped records based on an aggregate condition?',
    options: [
      'WHERE',
      'HAVING',
      'ORDER BY',
      'PARTITION BY',
    ],
    correctAnswer: 'HAVING',
    explanation: 'HAVING filters aggregated groups resulting from a GROUP BY, while WHERE filters individual rows before aggregation.',
  },
  {
    id: 7,
    category: 'Technical',
    competency: 'Data Cleaning & Python/Pandas',
    roleAffinity: ['dataAnalyst'],
    question: 'When preparing a dataset for statistical modeling, how should skewed continuous distributions with extreme outliers typically be handled?',
    options: [
      'Ignore all missing rows and duplicate the outliers to balance variance',
      'Inspect with IQR or z-scores, consider log transformations, or use robust median/imputation strategies',
      'Always delete columns with standard deviation higher than 1.0',
      'Convert all numerical data directly into raw string categorical values',
    ],
    correctAnswer: 'Inspect with IQR or z-scores, consider log transformations, or use robust median/imputation strategies',
    explanation: 'Outlier detection via IQR or z-scores combined with normalization or robust imputation preserves analytical integrity.',
  },
  {
    id: 8,
    category: 'Technical',
    competency: 'Git & Version Control',
    roleAffinity: ['frontend', 'backend', 'dataAnalyst'],
    question: 'What is the main advantage of interactive Git rebasing (git rebase -i) before submitting a pull request?',
    options: [
      'It creates an immutable copy on the remote server that bypasses branch protections',
      'It allows cleaning up commit history by squashing typo fixes and rewording messages for a linear history',
      'It converts git commits into Docker containers for CI/CD pipelines',
      'It automatically merges pull requests without requiring peer review',
    ],
    correctAnswer: 'It allows cleaning up commit history by squashing typo fixes and rewording messages for a linear history',
    explanation: 'Interactive rebase allows developers to clean, squash, and reorder commits to present a tidy, readable commit history.',
  },
  {
    id: 9,
    category: 'Soft Skills',
    competency: 'Team Collaboration & Code Review',
    roleAffinity: ['frontend', 'backend', 'dataAnalyst'],
    question: 'During a peer code review, a senior engineer suggests a design pattern that you believe adds unnecessary complexity. What is the most constructive response?',
    options: [
      'Reject the pull request immediately and close the discussion',
      'Adopt the change silently without asking any questions to avoid conflict',
      'Ask clarifying questions about the trade-offs, share your concrete concerns with benchmarks or examples, and collaborate on the best trade-off',
      'Escalate the matter directly to the college dean or VP of Engineering without discussing it with the author',
    ],
    correctAnswer: 'Ask clarifying questions about the trade-offs, share your concrete concerns with benchmarks or examples, and collaborate on the best trade-off',
    explanation: 'Constructive engineering discourse focuses on objective trade-offs, questions, and evidence rather than personal preferences or conflict.',
  },
  {
    id: 10,
    category: 'Soft Skills',
    competency: 'Problem Solving & Production Incident Response',
    roleAffinity: ['frontend', 'backend', 'dataAnalyst'],
    question: 'A newly deployed feature triggers a critical error affecting 20% of active users. What is your first priority?',
    options: [
      'Identify which developer pushed the code to assign responsibility',
      'Mitigate user impact immediately by rolling back or triggering a feature flag, communicate status to stakeholders, and investigate root cause via post-mortem afterwards',
      'Spend 4 hours debugging the issue on the live production server while users encounter errors',
      'Shut down the entire company database until the root cause is discovered',
    ],
    correctAnswer: 'Mitigate user impact immediately by rolling back or triggering a feature flag, communicate status to stakeholders, and investigate root cause via post-mortem afterwards',
    explanation: 'In production operations, immediate incident mitigation (rollback/flag) takes precedence, followed by blameless root-cause post-mortem.',
  },
];

/**
 * Evaluates the 10-question assessment and computes role readiness.
 * @param {Array<{ questionId: number, selectedOption: string }>} submittedAnswers
 */
function evaluateAssessment(submittedAnswers = []) {
  const answerMap = new Map();
  for (const ans of submittedAnswers) {
    answerMap.set(Number(ans.questionId), String(ans.selectedOption || '').trim());
  }

  let totalCorrect = 0;
  const gradedAnswers = [];

  // Group performance by competency and role affinity
  const roleWeights = {
    frontend: { total: 0, correct: 0, strengths: [], gaps: [] },
    dataAnalyst: { total: 0, correct: 0, strengths: [], gaps: [] },
    backend: { total: 0, correct: 0, strengths: [], gaps: [] },
  };

  for (const q of ASSESSMENT_QUESTIONS) {
    const selected = answerMap.get(q.id) || '';
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) totalCorrect++;

    gradedAnswers.push({
      questionId: q.id,
      questionText: q.question,
      selectedOption: selected,
      isCorrect,
      category: q.category,
      competency: q.competency,
    });

    for (const role of q.roleAffinity) {
      if (roleWeights[role]) {
        roleWeights[role].total += 1;
        if (isCorrect) {
          roleWeights[role].correct += 1;
          if (!roleWeights[role].strengths.includes(q.competency)) {
            roleWeights[role].strengths.push(q.competency);
          }
        } else {
          if (!roleWeights[role].gaps.includes(q.competency)) {
            roleWeights[role].gaps.push(q.competency);
          }
        }
      }
    }
  }

  // Calculate percentages and generate role recommendations
  const roleReadiness = {};
  const roles = [
    { key: 'frontend', name: 'Frontend Developer', coreSkills: ['React', 'JavaScript', 'CSS'] },
    { key: 'dataAnalyst', name: 'Data Analyst', coreSkills: ['SQL', 'Python', 'Statistics'] },
    { key: 'backend', name: 'Backend Developer', coreSkills: ['Node.js', 'REST APIs', 'Databases'] },
  ];

  for (const role of roles) {
    const data = roleWeights[role.key];
    const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    
    // Concrete recommendation string as specified in prompt
    let recommendation = '';
    if (data.gaps.length > 0) {
      const topGaps = data.gaps.slice(0, 2).join(' and ');
      recommendation = `You are ${percentage}% ready for ${role.name}. Improve ${topGaps}.`;
    } else {
      recommendation = `You are ${percentage}% ready for ${role.name}. Excellent mastery across evaluated skills!`;
    }

    roleReadiness[role.key] = {
      percentage,
      strengths: data.strengths,
      gaps: data.gaps,
      recommendation,
    };
  }

  return {
    totalQuestions: ASSESSMENT_QUESTIONS.length,
    totalCorrect,
    overallScorePercentage: Math.round((totalCorrect / ASSESSMENT_QUESTIONS.length) * 100),
    roleReadiness,
    gradedAnswers,
  };
}

module.exports = {
  ASSESSMENT_QUESTIONS,
  evaluateAssessment,
};