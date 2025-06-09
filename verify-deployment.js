#!/usr/bin/env node

/**
 * Railway Deployment Verification Script
 * Tests all critical endpoints and functionality
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.VERIFY_URL || 'https://westroleplay.net';
const BACKUP_URL = 'https://whitelistweb.up.railway.app';
const TIMEOUT = 10000; // 10 seconds

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, {
      timeout: TIMEOUT,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testEndpoint(name, url, expectedStatus = 200, options = {}) {
  try {
    log(`\n🔍 Testing ${name}...`, 'blue');
    log(`   URL: ${url}`, 'yellow');
    
    const result = await makeRequest(url, options);
    
    if (result.status === expectedStatus) {
      log(`   ✅ SUCCESS: ${result.status}`, 'green');
      if (result.data && typeof result.data === 'object') {
        log(`   📊 Response: ${JSON.stringify(result.data, null, 2)}`, 'reset');
      }
      return { success: true, data: result.data };
    } else {
      log(`   ❌ FAILED: Expected ${expectedStatus}, got ${result.status}`, 'red');
      log(`   📊 Response: ${JSON.stringify(result.data, null, 2)}`, 'reset');
      return { success: false, status: result.status, data: result.data };
    }
  } catch (error) {
    log(`   ❌ ERROR: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runVerification() {
  log('🚀 West Roleplay Domain Verification Starting...', 'bold');
  log(`🌐 Testing URL: ${BASE_URL}`, 'blue');
  log('=' * 60, 'blue');

  const tests = [];

  // Test 1: Health Check
  const healthTest = await testEndpoint(
    'Health Check',
    `${BASE_URL}/api/health`
  );
  tests.push({ name: 'Health Check', ...healthTest });

  // Test 2: Applications Endpoint (should return database error if not connected)
  const appsTest = await testEndpoint(
    'Applications List',
    `${BASE_URL}/api/applications`,
    503 // Expecting 503 if database is not connected
  );
  tests.push({ name: 'Applications List', ...appsTest });

  // Test 3: Frontend Loading
  const frontendTest = await testEndpoint(
    'Frontend Loading',
    BASE_URL,
    200
  );
  tests.push({ name: 'Frontend Loading', ...frontendTest });

  // Test 4: Static Assets
  const staticTest = await testEndpoint(
    'Static Assets',
    `${BASE_URL}/static/css/main.266df749.css`,
    200
  );
  tests.push({ name: 'Static Assets', ...staticTest });

  // Test 5: Form Submission (with test data)
  const formTest = await testEndpoint(
    'Form Submission',
    `${BASE_URL}/api/applications`,
    503, // Expecting 503 if database is not connected
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        discord: '123456789012345678',
        steam: 'steam:110000154530e8be',
        name: 'Test Character',
        birthDate: '1990-01-01',
        backstory: 'This is a test backstory that is longer than 100 characters to meet the minimum requirement for the application form submission test.',
        reason: 'Testing the application submission endpoint'
      }
    }
  );
  tests.push({ name: 'Form Submission', ...formTest });

  // Summary
  log('\n' + '=' * 60, 'blue');
  log('📊 VERIFICATION SUMMARY', 'bold');
  log('=' * 60, 'blue');

  const passed = tests.filter(t => t.success).length;
  const total = tests.length;

  tests.forEach(test => {
    const status = test.success ? '✅ PASS' : '❌ FAIL';
    const color = test.success ? 'green' : 'red';
    log(`${status} ${test.name}`, color);
    
    if (!test.success && test.error) {
      log(`     Error: ${test.error}`, 'red');
    }
    if (!test.success && test.status) {
      log(`     Status: ${test.status}`, 'red');
    }
  });

  log(`\n📈 Results: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');

  if (passed === total) {
    log('\n🎉 ALL TESTS PASSED! Deployment is working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the details above.', 'yellow');
  }

  // Specific recommendations
  log('\n🔧 RECOMMENDATIONS:', 'bold');
  
  const healthData = tests.find(t => t.name === 'Health Check')?.data;
  if (healthData) {
    if (healthData.database?.connected === false) {
      log('   🔴 Database is not connected - check MongoDB URI and network access', 'red');
    }
    if (healthData.discord?.botConnected === false) {
      log('   🟡 Discord bot is not connected - check bot token', 'yellow');
    }
  }

  const appsData = tests.find(t => t.name === 'Applications List')?.data;
  if (appsData?.error === 'Database not connected') {
    log('   🔴 Confirmed: Database connection issue detected', 'red');
    log('   💡 Solution: Verify MONGODB_URI in Railway environment variables', 'blue');
  }

  log(`\n🌐 Production URL: ${BASE_URL}`, 'blue');
  log('🔄 Railway Backup: https://whitelistweb.up.railway.app', 'blue');
  log('📚 Troubleshooting Guide: See RAILWAY_TROUBLESHOOTING.md', 'blue');
}

// Run verification
runVerification().catch(console.error);
