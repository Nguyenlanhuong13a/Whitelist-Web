#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * Tests the connection with the provided credentials
 */

const mongoose = require('mongoose');

// Connection string with correct credentials
const MONGODB_URI = 'mongodb+srv://whitelisted:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔄 Testing MongoDB Atlas Connection...');
console.log('📍 URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
console.log('👤 Username: whitelisted');
console.log('🏷️ Database: whitelist-web');
console.log('🌐 Cluster: cluster0.mooze8v.mongodb.net');

async function testConnection() {
  try {
    console.log('\n⏳ Attempting connection...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB connection successful!');
    console.log('📊 Connection details:');
    console.log('   - Ready State:', mongoose.connection.readyState);
    console.log('   - Database Name:', mongoose.connection.name);
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Port:', mongoose.connection.port);

    // Test basic operations
    console.log('\n🧪 Testing basic operations...');
    
    // Test collection access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));

    // Test write operation
    const testCollection = mongoose.connection.db.collection('connection_test');
    const testDoc = { 
      timestamp: new Date(), 
      test: 'Railway connection test',
      source: 'local_test_script'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✍️ Test write successful, ID:', insertResult.insertedId);

    // Test read operation
    const readResult = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('📖 Test read successful:', readResult ? 'Found document' : 'Document not found');

    // Cleanup test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('🧹 Test document cleaned up');

    console.log('\n🎉 All tests passed! MongoDB connection is working correctly.');
    console.log('\n📋 Railway Environment Variable:');
    console.log('MONGODB_URI=' + MONGODB_URI);

  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error('📋 Error details:');
    console.error('   - Name:', error.name);
    console.error('   - Message:', error.message);
    
    if (error.reason) {
      console.error('   - Reason:', error.reason);
    }
    
    if (error.code) {
      console.error('   - Code:', error.code);
    }

    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check MongoDB Atlas Network Access (allow 0.0.0.0/0)');
    console.log('2. Verify database user credentials');
    console.log('3. Ensure cluster is not paused');
    console.log('4. Check if IP is whitelisted');

    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Connection closed');
    }
  }
}

// Run the test
testConnection();
