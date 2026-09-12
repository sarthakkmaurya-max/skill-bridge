import { OpportunityMatchResult, OpportunityType } from './types';

// Synonym and competency aliases mapping
const SKILL_ALIASES: Record<string, string[]> = {
  html_css: ['html', 'css', 'html/css', 'html5', 'css3', 'tailwind', 'tailwind css', 'responsive design'],
  javascript: ['javascript', 'js', 'es6', 'typescript', 'ts'],
  react: ['react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'redux', 'frontend'],
  git: ['git', 'github', 'gitlab', 'version control', 'ci/cd'],
  sql: ['sql', 'postgresql', 'postgres', 'mysql', 'database', 'rdbms', 'data modeling'],
  python: ['python', 'pandas', 'numpy', 'data analysis', 'django', 'fastapi'],
  communication: ['communication', 'technical writing', 'documentation', 'presentation', 'verbal skills'],
  teamwork: ['teamwork', 'collaboration', 'agile', 'scrum', 'pair programming'],
  problem_solving: ['problem solving', 'algorithms', 'data structures', 'dsa', 'debugging', 'analytical'],
  adaptability: ['adaptability', 'fast learner', 'growth mindset', 'resilience'],
};

function normalizeSkill(s: string): string {
  return s.toLowerCase().trim().replace(/[\s\-_.]/g, '');
}

export function formatOpportunityType(type?: OpportunityType | string): string {
  switch (type) {
    case 'internship':
      return 'Internship';
    case 'job':
      return 'Full-Time Job';
    case 'apprenticeship':
      return 'Apprenticeship';
    case 'workshop':
      return 'Hands-on Workshop';
    case 'fdp':
      return 'Faculty Development Program';
    default:
      return 'Opportunity';
  }
}

/**
 * Transparent, rule-based matching engine comparing student competencies against an opportunity
 */
export function calculateOpportunityMatch(
  studentSkillRatings: Record<string, number> | string[] = {},
  opportunity: { title?: string; type?: OpportunityType | string; requiredSkills?: string[] }
): OpportunityMatchResult {
  const reqSkills = opportunity.requiredSkills && opportunity.requiredSkills.length > 0 
    ? opportunity.requiredSkills 
    : ['General Problem Solving', 'Communication'];

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  let totalScoreSum = 0;

  // Normalize student skill inputs into a lookup map (0 to 100%)
  const studentMap: Record<string, number> = {};

  if (Array.isArray(studentSkillRatings)) {
    // Array of skill names, treat each as 85% competent
    for (const name of studentSkillRatings) {
      studentMap[normalizeSkill(name)] = 85;
    }
  } else {
    for (const [key, val] of Object.entries(studentSkillRatings)) {
      const norm = normalizeSkill(key);
      // If rating is 1..5, scale to 20..100
      const pct = val <= 5 ? val * 20 : Math.min(100, Math.max(0, val));
      studentMap[norm] = pct;

      // Also map via alias table
      for (const [aliasKey, aliasList] of Object.entries(SKILL_ALIASES)) {
        if (norm === normalizeSkill(aliasKey) || aliasList.some(a => normalizeSkill(a) === norm)) {
          studentMap[normalizeSkill(aliasKey)] = pct;
          for (const a of aliasList) {
            studentMap[normalizeSkill(a)] = pct;
          }
        }
      }
    }
  }

  for (const skill of reqSkills) {
    const norm = normalizeSkill(skill);
    let skillScore = studentMap[norm] || 0;

    // Check alias list if direct match wasn't found
    if (!skillScore) {
      for (const [aliasKey, aliasList] of Object.entries(SKILL_ALIASES)) {
        if (aliasList.some(a => normalizeSkill(a) === norm) || normalizeSkill(aliasKey) === norm) {
          skillScore = studentMap[normalizeSkill(aliasKey)] || 0;
          if (!skillScore) {
            for (const a of aliasList) {
              if (studentMap[normalizeSkill(a)]) {
                skillScore = studentMap[normalizeSkill(a)];
                break;
              }
            }
          }
          if (skillScore) break;
        }
      }
    }

    // Default baseline for completely unrecorded skills
    if (!skillScore) {
      skillScore = 30; // Unverified / foundation baseline
    }

    totalScoreSum += skillScore;

    if (skillScore >= 60) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const rawPercent = Math.round(totalScoreSum / reqSkills.length);
  const matchPercentage = Math.min(100, Math.max(25, rawPercent));

  const typeLabel = formatOpportunityType(opportunity.type);
  const title = opportunity.title || typeLabel;

  let recommendation = '';
  if (missingSkills.length === 0) {
    recommendation = `You are a ${matchPercentage}% match! You meet or exceed all industry requirements for this ${title}.`;
  } else if (missingSkills.length === 1) {
    recommendation = `You are a ${matchPercentage}% match for this ${title}. Improve ${missingSkills[0]} to increase your interview eligibility.`;
  } else {
    recommendation = `You are a ${matchPercentage}% match for this ${title}. Improve ${missingSkills[0]} and ${missingSkills[1]} to increase your eligibility.`;
  }

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    recommendation,
  };
}