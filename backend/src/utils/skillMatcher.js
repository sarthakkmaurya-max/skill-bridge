/**
 * Normalizes skill string for accurate cross-matching.
 */
function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  let clean = skill.trim().toLowerCase();
  
  // Standardize common aliases
  const aliasMap = {
    'react.js': 'react',
    'reactjs': 'react',
    'node': 'node.js',
    'nodejs': 'node.js',
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'mongo': 'mongodb',
    'postgres': 'postgresql',
    'express.js': 'express',
    'expressjs': 'express',
    'vue.js': 'vue',
    'vuejs': 'vue',
    'angular.js': 'angular',
    'angularjs': 'angular',
    'next.js': 'nextjs',
    'tailwind': 'tailwind css',
    'tailwindcss': 'tailwind css',
    'c++': 'cpp',
    'c#': 'csharp',
  };

  return aliasMap[clean] || clean;
}

/**
 * Calculates match score, matched skills, missing skills, and dynamic recommendation.
 * @param {string[]} requiredSkills
 * @param {string[]} studentSkills
 */
function calculateSkillMatch(requiredSkills = [], studentSkills = []) {
  if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      recommendationMessage: 'No specific prerequisite skills listed. You are fully eligible to apply!',
    };
  }

  const normalizedStudentSkills = new Set(
    (studentSkills || []).map(normalizeSkill).filter(Boolean)
  );

  const matchedSkills = [];
  const missingSkills = [];

  for (const reqSkill of requiredSkills) {
    const normReq = normalizeSkill(reqSkill);
    if (normalizedStudentSkills.has(normReq)) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  let recommendationMessage = '';
  if (matchPercentage === 100) {
    recommendationMessage = 'Outstanding match! You possess 100% of the required skills. We strongly recommend applying.';
  } else if (matchPercentage >= 70) {
    const missingStr = missingSkills.slice(0, 2).join(' and ');
    recommendationMessage = `Your match score is ${matchPercentage}%. Learn ${missingStr} to improve your eligibility.`;
  } else if (matchPercentage >= 40) {
    const missingStr = missingSkills.slice(0, 3).join(', ');
    recommendationMessage = `Your match score is ${matchPercentage}%. Improving ${missingStr} will significantly increase your hiring chances.`;
  } else {
    const missingStr = missingSkills.slice(0, 3).join(', ');
    recommendationMessage = `Your match score is ${matchPercentage}%. Consider building foundational skills in ${missingStr} before applying.`;
  }

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    recommendationMessage,
  };
}

module.exports = {
  normalizeSkill,
  calculateSkillMatch,
};