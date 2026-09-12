import { 
  calculateRoleReadiness, 
  FRONTEND_FOCUSED_ANSWERS, 
  DATA_FOCUSED_ANSWERS 
} from './roleReadiness';

function runTests() {
  console.log('====================================================');
  console.log('SkillBridge Assessment Logic Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // Test Scenario 1: Frontend-Focused Answers
  // ----------------------------------------------------
  console.log('[Scenario 1] Evaluating Frontend-Focused Answers...');
  const frontendResult = calculateRoleReadiness(FRONTEND_FOCUSED_ANSWERS);

  assert(
    frontendResult.recommendedRole === 'Frontend Developer',
    'Scenario 1 Recommended Role is Frontend Developer',
    `Got: ${frontendResult.recommendedRole}`
  );

  assert(
    frontendResult.roleReadiness.frontend.percentage === 100,
    'Scenario 1 Frontend Readiness is 100%',
    `Got: ${frontendResult.roleReadiness.frontend.percentage}%`
  );

  assert(
    frontendResult.roleReadiness.dataAnalyst.percentage === 40,
    'Scenario 1 Data Analyst Readiness is low (40%)',
    `Got: ${frontendResult.roleReadiness.dataAnalyst.percentage}%`
  );

  assert(
    frontendResult.roleReadiness.backend.percentage === 51,
    'Scenario 1 Backend Readiness is intermediate (51%)',
    `Got: ${frontendResult.roleReadiness.backend.percentage}%`
  );

  assert(
    frontendResult.percentage === 100,
    'Scenario 1 Primary Percentage reflects best-fit role score (100%)',
    `Got: ${frontendResult.percentage}%`
  );

  assert(
    frontendResult.skillScores.react.isStrength === true &&
    frontendResult.skillScores.javascript.isStrength === true &&
    frontendResult.skillScores.html_css.isStrength === true &&
    frontendResult.skillScores.git.isStrength === true &&
    frontendResult.skillScores.sql.isGap === true &&
    frontendResult.skillScores.python.isGap === true,
    'Scenario 1 Individual Strengths & Gaps mapped dynamically',
    `React Strength: ${frontendResult.skillScores.react.isStrength}, SQL Gap: ${frontendResult.skillScores.sql.isGap}`
  );

  // ----------------------------------------------------
  // Test Scenario 2: Data Analyst-Focused Answers
  // ----------------------------------------------------
  console.log('\n[Scenario 2] Evaluating Data Analyst-Focused Answers...');
  const dataResult = calculateRoleReadiness(DATA_FOCUSED_ANSWERS);

  assert(
    dataResult.recommendedRole === 'Data Analyst',
    'Scenario 2 Recommended Role is Data Analyst',
    `Got: ${dataResult.recommendedRole}`
  );

  assert(
    dataResult.roleReadiness.dataAnalyst.percentage === 100,
    'Scenario 2 Data Analyst Readiness is 100%',
    `Got: ${dataResult.roleReadiness.dataAnalyst.percentage}%`
  );

  assert(
    dataResult.roleReadiness.frontend.percentage === 31,
    'Scenario 2 Frontend Readiness is low (31%)',
    `Got: ${dataResult.roleReadiness.frontend.percentage}%`
  );

  assert(
    dataResult.roleReadiness.backend.percentage === 75,
    'Scenario 2 Backend Readiness reflects SQL+Python overlap (75%)',
    `Got: ${dataResult.roleReadiness.backend.percentage}%`
  );

  assert(
    dataResult.percentage === 100,
    'Scenario 2 Primary Percentage reflects best-fit role score (100%)',
    `Got: ${dataResult.percentage}%`
  );

  assert(
    dataResult.skillScores.sql.isStrength === true &&
    dataResult.skillScores.python.isStrength === true &&
    dataResult.skillScores.problem_solving.isStrength === true &&
    dataResult.skillScores.react.isGap === true &&
    dataResult.skillScores.html_css.isGap === true,
    'Scenario 2 Individual Strengths & Gaps mapped dynamically',
    `SQL Strength: ${dataResult.skillScores.sql.isStrength}, React Gap: ${dataResult.skillScores.react.isGap}`
  );

  // ----------------------------------------------------
  // Test Scenario 3: Verification of Divergence
  // ----------------------------------------------------
  console.log('\n[Scenario 3] Verifying Divergence Between Scenarios...');
  assert(
    frontendResult.recommendedRole !== dataResult.recommendedRole,
    'Different answers produce completely different recommended roles',
    `Frontend: ${frontendResult.recommendedRole} vs Data: ${dataResult.recommendedRole}`
  );

  assert(
    frontendResult.roleReadiness.frontend.percentage !== dataResult.roleReadiness.frontend.percentage,
    'Frontend readiness score varies widely based on answers (100% vs 31%)',
    `Frontend: ${frontendResult.roleReadiness.frontend.percentage}% vs ${dataResult.roleReadiness.frontend.percentage}%`
  );

  assert(
    frontendResult.roleReadiness.dataAnalyst.percentage !== dataResult.roleReadiness.dataAnalyst.percentage,
    'Data Analyst readiness score varies widely based on answers (40% vs 100%)',
    `Data: ${frontendResult.roleReadiness.dataAnalyst.percentage}% vs ${dataResult.roleReadiness.dataAnalyst.percentage}%`
  );

  console.log('\n====================================================');
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
