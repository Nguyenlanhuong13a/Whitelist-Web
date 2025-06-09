#!/usr/bin/env node

/**
 * MongoDB New Credentials Verification Script
 * Tests the updated whitelistweb credentials
 */

const mongoose = require('mongoose');

// Updated connection string with new credentials
const NEW_MONGODB_URI = 'mongodb+srv://whitelistweb:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0';
const OLD_MONGODB_URI = 'mongodb+srv://whitelisted:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0';

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

async function testConnection(uri, label, username) {
  try {
    log(`\n🔍 Testing ${label}...`, 'blue');
    log(`   Username: ${username}`, 'cyan');
    log(`   URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`, 'cyan');
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    log(`   ✅ SUCCESS: Connection established`, 'green');
    log(`   📊 Ready State: ${mongoose.connection.readyState}`, 'green');
    log(`   🏷️ Database: ${mongoose.connection.name}`, 'green');
    log(`   🌐 Host: ${mongoose.connection.host}`, 'green');

    // Test basic operations
    const testCollection = mongoose.connection.db.collection('credential_test');
    const testDoc = { 
      timestamp: new Date(), 
      test: `${username} credentials test`,
      source: 'credential_verification_script'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    log(`   ✍️ Test write successful: ${insertResult.insertedId}`, 'green');

    const readResult = await testCollection.findOne({ _id: insertResult.insertedId });
    log(`   📖 Test read successful: ${readResult ? 'Found' : 'Not found'}`, 'green');

    await testCollection.deleteOne({ _id: insertResult.insertedId });
    log(`   🧹 Test document cleaned up`, 'green');

    await mongoose.connection.close();
    log(`   🔌 Connection closed`, 'green');

    return { success: true, username, uri };
  } catch (error) {
    log(`   ❌ FAILED: ${error.message}`, 'red');
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    return { success: false, username, uri, error: error.message };
  }
}

async function runCredentialsVerification() {
  log('🔄 MongoDB Credentials Verification', 'bold');
  log('🎯 Testing updated credentials for West Roleplay', 'cyan');
  log('=' * 60, 'blue');

  const tests = [];

  // Test new credentials
  const newTest = await testConnection(NEW_MONGODB_URI, 'NEW Credentials (whitelistweb)', 'whitelistweb');
  tests.push({ name: 'New Credentials', ...newTest });

  // Test old credentials (should fail if user was changed)
  const oldTest = await testConnection(OLD_MONGODB_URI, 'OLD Credentials (whitelisted)', 'whitelisted');
  tests.push({ name: 'Old Credentials', ...oldTest });

  // Summary
  log('\n' + '=' * 60, 'blue');
  log('📊 CREDENTIALS VERIFICATION SUMMARY', 'bold');
  log('=' * 60, 'blue');

  tests.forEach(test => {
    const status = test.success ? '✅ WORKING' : '❌ FAILED';
    const color = test.success ? 'green' : 'red';
    log(`${status} ${test.name} (${test.username})`, color);
    
    if (!test.success && test.error) {
      log(`     Error: ${test.error}`, 'red');
    }
  });

  const newWorking = tests.find(t => t.name === 'New Credentials')?.success;
  const oldWorking = tests.find(t => t.name === 'Old Credentials')?.success;

  log('\n🔧 ANALYSIS:', 'bold');
  
  if (newWorking && !oldWorking) {
    log('   🎉 PERFECT: New credentials working, old credentials disabled', 'green');
    log('   ✅ Credential migration completed successfully', 'green');
  } else if (newWorking && oldWorking) {
    log('   ⚠️  BOTH WORKING: Both old and new credentials are active', 'yellow');
    log('   💡 Consider disabling old credentials for security', 'yellow');
  } else if (!newWorking && oldWorking) {
    log('   🚨 ISSUE: New credentials not working, old credentials still active', 'red');
    log('   🔧 Action needed: Check MongoDB Atlas user configuration', 'red');
  } else {
    log('   💥 CRITICAL: Neither credentials are working', 'red');
    log('   🆘 Action needed: Check MongoDB Atlas cluster and network access', 'red');
  }

  // Railway update instructions
  log('\n📋 RAILWAY UPDATE INSTRUCTIONS:', 'bold');
  
  if (newWorking) {
    log('   1. Login to Railway dashboard', 'cyan');
    log('   2. Navigate to Whitelist-Web project', 'cyan');
    log('   3. Go to Variables tab', 'cyan');
    log('   4. Update MONGODB_URI with:', 'cyan');
    log(`      ${NEW_MONGODB_URI}`, 'green');
    log('   5. Save and wait for redeploy (3-5 minutes)', 'cyan');
  } else {
    log('   ⚠️  Do not update Railway until new credentials are working', 'red');
    log('   🔧 Fix MongoDB Atlas configuration first', 'red');
  }

  // Verification steps
  log('\n🔍 POST-UPDATE VERIFICATION:', 'bold');
  log('   1. Check health endpoint: https://whitelistweb.up.railway.app/api/health', 'cyan');
  log('   2. Expected: "database": {"connected": true, "readyState": 1}', 'cyan');
  log('   3. Test form submission on Railway domain', 'cyan');
  log('   4. Verify no database connection errors', 'cyan');

  log('\n🎯 SUCCESS CRITERIA:', 'bold');
  log('   ✅ New credentials (whitelistweb) working', newWorking ? 'green' : 'red');
  log('   ✅ Railway health endpoint shows connected', 'yellow');
  log('   ✅ Form submissions work without errors', 'yellow');
  log('   ✅ Application history loads correctly', 'yellow');

  return { newWorking, oldWorking, tests };
}

// Run verification
runCredentialsVerification()
  .then(result => {
    if (result.newWorking) {
      log('\n🚀 Ready to update Railway environment variables!', 'green');
      process.exit(0);
    } else {
      log('\n🛑 Fix MongoDB Atlas configuration before updating Railway', 'red');
      process.exit(1);
    }
  })
  .catch(error => {
    log(`\n💥 Verification failed: ${error.message}`, 'red');
    process.exit(1);
  });
