const assert = require('assert');

const tests = [];
let currentSuite = null;
let failureIndex = 1;
const failures = [];

// Define global functions for test registration
global.describe = (name, fn) => {
  const parentSuite = currentSuite;
  currentSuite = { name, tests: [], beforeEachHooks: [], parent: parentSuite };
  if (parentSuite) parentSuite.tests.push(currentSuite);
  else tests.push(currentSuite);

  fn();
  currentSuite = parentSuite;
};

global.it = (name, fn) => {
  const test = { name, fn };
  if (currentSuite) currentSuite.tests.push(test);
  else tests.push(test);
};

global.beforeEach = (fn) => {
  if (currentSuite) currentSuite.beforeEachHooks.push(fn);
};

global.it.only = (name, fn) => {
  const test = { name, fn, only: true };
  if (currentSuite) currentSuite.tests.push(test);
  else tests.push(test);
};

global.describe.only = (name, fn) => {
  const parentSuite = currentSuite;
  currentSuite = { name, tests: [], beforeEachHooks: [], parent: parentSuite, only: true };
  if (parentSuite) parentSuite.tests.push(currentSuite);
  else tests.push(currentSuite);

  fn();
  currentSuite = parentSuite;
};

async function runSuite(suite, indent = 1, only = false) {
  const hasOnly = suite.tests.some((t) => t.only || (t.tests && t.tests.some((nested) => nested.only)));
  const isOnly = hasOnly || only;

  // Filter runnable test cases and sub-suites
  const testCases = suite.tests.filter((t) => t.fn && (!isOnly || t.only));
  const subSuites = suite.tests.filter((t) => !t.fn);

  // Determine if this suite or any nested suite has runnable content
  const hasRunnableTests = testCases.length > 0 || subSuites.some((subSuite) => {
    const subSuiteResult = subSuite.tests && subSuite.tests.some((nested) => nested.fn || nested.tests);
    return subSuiteResult && (!only || subSuite.tests.some((nested) => nested.only));
  });

  if (!hasRunnableTests) return { passed: 0, failed: 0 }; // Skip printing this suite entirely

  // Print suite name if it has runnable content
  console.log(`${'  '.repeat(indent)}${suite.name}`);
  let passed = 0, failed = 0;

  // Run test cases in this suite
  for (const test of testCases) {
    try {
      for (const hook of suite.beforeEachHooks) {
        await hook();
      }
      await test.fn();
      console.log(`${'  '.repeat(indent + 1)}✓ ${test.name}`);
      passed++;
    } catch (err) {
      console.log(`${'  '.repeat(indent + 1)}${failureIndex}) ${test.name}`);
      failures.push({
        index: failureIndex,
        name: test.name,
        message: err.message || 'undefined',
        indent: indent + 1,
        details: `AssertionError [ERR_ASSERTION]: ${err.message || 'No message'}`
      });
      failed++;
      failureIndex++;
    }
  }

  // Run nested suites after test cases
  for (const subSuite of subSuites) {
    const subResult = await runSuite(subSuite, indent + 1, isOnly);
    passed += subResult.passed;
    failed += subResult.failed;
  }

  return { passed, failed };
}



async function runTests() {
  const hasOnly = tests.some((t) => t.only || (t.tests && t.tests.some((nested) => nested.only)));
  const isOnly = hasOnly;

  let totalPassed = 0, totalFailed = 0;

  const topLevelTests = tests.filter((t) => t.fn);
  const topLevelSuites = tests.filter((t) => !t.fn);

  // Run top-level test cases first
  for (const test of topLevelTests) {
    if (isOnly && !test.only) continue; // Skip non-.only tests if .only is present
    try {
      await test.fn();
      console.log(`✓ ${test.name}`);
      totalPassed++;
    } catch (err) {
      console.log(`  ${failureIndex}) ${test.name}`);
      failures.push({
        index: failureIndex,
        name: test.name,
        message: err.message || 'undefined',
        indent: 0,
        details: `AssertionError [ERR_ASSERTION]: ${err.message || 'No message'}`
      });
      totalFailed++;
      failureIndex++;
    }
  }

  // Run top-level suites after test cases
  for (const suite of topLevelSuites) {
    const suiteResult = await runSuite(suite, 1, isOnly);
    totalPassed += suiteResult.passed;
    totalFailed += suiteResult.failed;
  }

  // Final output formatting
  console.log(`\n  ${totalPassed} passing`);
  if (totalFailed > 0) {
    console.log(`  ${totalFailed} failing`);
    for (const failure of failures) {
      console.log(`\n  ${failure.index}) ${failure.name}:\n`);
      console.log(`      ${failure.details}`);
    }
  }
}

(async () => {
  const testFiles = process.argv.slice(2);
  for (const file of testFiles) {
    require(file);
  }
  await runTests();
})();
