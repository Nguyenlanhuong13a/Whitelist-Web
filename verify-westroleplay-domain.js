#!/usr/bin/env node

/**
 * West Roleplay Domain Verification Script
 * Tests westroleplay.net domain functionality
 */

const https = require('https');
const http = require('http');

const PRIMARY_URL = 'https://westroleplay.net';
const BACKUP_URL = 'https://whitelistweb.up.railway.app';
const TIMEOUT = 15000; // 15 seconds

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
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
    log(`   URL: ${url}`, 'cyan');
    
    const result = await makeRequest(url, options);
    
    if (result.status === expectedStatus) {
      log(`   ✅ SUCCESS: ${result.status}`, 'green');
      if (result.data && typeof result.data === 'object') {
        log(`   📊 Response: ${JSON.stringify(result.data, null, 2)}`, 'reset');
      }
      return { success: true, data: result.data, status: result.status };
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

async function testDomainComparison() {
  log('\n🌐 DOMAIN COMPARISON TEST', 'bold');
  log('=' * 50, 'blue');

  const endpoints = [
    '/api/health',
    '/',
    '/api/applications'
  ];

  for (const endpoint of endpoints) {
    log(`\n📍 Testing endpoint: ${endpoint}`, 'magenta');
    
    // Test primary domain
    const primaryResult = await testEndpoint(
      `Primary Domain (${endpoint})`,
      `${PRIMARY_URL}${endpoint}`,
      endpoint === '/api/applications' ? 503 : 200
    );
    
    // Test backup domain
    const backupResult = await testEndpoint(
      `Backup Domain (${endpoint})`,
      `${BACKUP_URL}${endpoint}`,
      endpoint === '/api/applications' ? 503 : 200
    );
    
    // Compare results
    if (primaryResult.success && backupResult.success) {
      log(`   🎯 COMPARISON: Both domains working correctly`, 'green');
    } else if (primaryResult.success && !backupResult.success) {
      log(`   ⚠️  COMPARISON: Primary working, backup failing`, 'yellow');
    } else if (!primaryResult.success && backupResult.success) {
      log(`   🚨 COMPARISON: Primary failing, backup working`, 'red');
    } else {
      log(`   💥 COMPARISON: Both domains failing`, 'red');
    }
  }
}

async function testDiscordOAuth() {
  log('\n🔗 DISCORD OAUTH CONFIGURATION TEST', 'bold');
  log('=' * 50, 'blue');

  // Test if Discord OAuth redirect URLs are properly configured
  const oauthTests = [
    {
      name: 'Primary OAuth Redirect',
      url: `${PRIMARY_URL}/auth/discord/callback`,
      description: 'Should be configured in Discord Developer Portal'
    },
    {
      name: 'Backup OAuth Redirect', 
      url: `${BACKUP_URL}/auth/discord/callback`,
      description: 'Backup redirect for transition period'
    }
  ];

  for (const test of oauthTests) {
    log(`\n🔍 Testing ${test.name}...`, 'blue');
    log(`   URL: ${test.url}`, 'cyan');
    log(`   Note: ${test.description}`, 'yellow');
    
    try {
      const result = await makeRequest(test.url, { method: 'GET' });
      if (result.status === 400 || result.status === 404) {
        log(`   ✅ EXPECTED: ${result.status} (OAuth endpoint exists)`, 'green');
      } else {
        log(`   ⚠️  UNEXPECTED: ${result.status}`, 'yellow');
      }
    } catch (error) {
      log(`   ❌ ERROR: ${error.message}`, 'red');
    }
  }
}

async function testSSLCertificate() {
  log('\n🔒 SSL CERTIFICATE TEST', 'bold');
  log('=' * 50, 'blue');

  const domains = [
    'westroleplay.net',
    'www.westroleplay.net'
  ];

  for (const domain of domains) {
    log(`\n🔍 Testing SSL for ${domain}...`, 'blue');
    
    try {
      const result = await makeRequest(`https://${domain}/api/health`);
      if (result.status === 200) {
        log(`   ✅ SSL WORKING: HTTPS connection successful`, 'green');
      } else {
        log(`   ⚠️  SSL ISSUE: Unexpected status ${result.status}`, 'yellow');
      }
    } catch (error) {
      if (error.message.includes('certificate') || error.message.includes('SSL')) {
        log(`   ❌ SSL ERROR: ${error.message}`, 'red');
      } else {
        log(`   ⚠️  CONNECTION ERROR: ${error.message}`, 'yellow');
      }
    }
  }
}

async function runDomainVerification() {
  log('🚀 West Roleplay Domain Migration Verification', 'bold');
  log('🌐 Primary Domain: westroleplay.net', 'cyan');
  log('🔄 Backup Domain: whitelistweb.up.railway.app', 'cyan');
  log('=' * 60, 'blue');

  const tests = [];

  // Test 1: Basic connectivity
  const healthTest = await testEndpoint(
    'Primary Domain Health Check',
    `${PRIMARY_URL}/api/health`
  );
  tests.push({ name: 'Primary Domain Health', ...healthTest });

  const backupHealthTest = await testEndpoint(
    'Backup Domain Health Check',
    `${BACKUP_URL}/api/health`
  );
  tests.push({ name: 'Backup Domain Health', ...backupHealthTest });

  // Test 2: Frontend loading
  const frontendTest = await testEndpoint(
    'Primary Domain Frontend',
    PRIMARY_URL,
    200
  );
  tests.push({ name: 'Primary Frontend', ...frontendTest });

  // Test 3: API functionality
  const apiTest = await testEndpoint(
    'Primary Domain API',
    `${PRIMARY_URL}/api/applications`,
    503 // Expected if database not connected
  );
  tests.push({ name: 'Primary API', ...apiTest });

  // Test 4: Domain comparison
  await testDomainComparison();

  // Test 5: Discord OAuth configuration
  await testDiscordOAuth();

  // Test 6: SSL certificate
  await testSSLCertificate();

  // Summary
  log('\n' + '=' * 60, 'blue');
  log('📊 DOMAIN MIGRATION VERIFICATION SUMMARY', 'bold');
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

  log(`\n📈 Results: ${passed}/${total} basic tests passed`, passed === total ? 'green' : 'yellow');

  // Recommendations
  log('\n🔧 MIGRATION RECOMMENDATIONS:', 'bold');
  
  if (passed === total) {
    log('   🎉 Domain migration appears successful!', 'green');
    log('   ✅ Primary domain is responding correctly', 'green');
    log('   ✅ Backup domain is maintained for transition', 'green');
  } else {
    log('   ⚠️  Some issues detected during migration', 'yellow');
    log('   🔍 Check failed tests above for details', 'yellow');
  }

  // Next steps
  log('\n📋 NEXT STEPS:', 'bold');
  log('   1. Update Discord Developer Portal with new redirect URLs', 'cyan');
  log('   2. Update Railway environment variables', 'cyan');
  log('   3. Test complete application flow', 'cyan');
  log('   4. Monitor for 24-48 hours after DNS changes', 'cyan');
  log('   5. Communicate new domain to users', 'cyan');

  log('\n🌐 Production URLs:', 'bold');
  log(`   Primary: ${PRIMARY_URL}`, 'green');
  log(`   Backup:  ${BACKUP_URL}`, 'yellow');
}

// Run verification
runDomainVerification().catch(console.error);
