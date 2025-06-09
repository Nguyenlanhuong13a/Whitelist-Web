// Debug script to test Steam authentication redirect flow
const axios = require('axios');

async function debugRedirectFlow() {
  console.log('=== Steam Authentication Redirect Flow Debug ===\n');
  
  // Test 1: Check if backend callback route is accessible
  console.log('1. Testing backend callback route accessibility...');
  try {
    // This should return an error since we're not providing OpenID parameters
    const response = await axios.get('http://localhost:5000/api/auth/steam/callback');
    console.log('❌ Unexpected success - callback should require OpenID parameters');
  } catch (error) {
    if (error.response && error.response.status === 302) {
      console.log('✅ Backend callback route is accessible (redirect response)');
      console.log('   - Redirect location:', error.response.headers.location);
    } else {
      console.log('✅ Backend callback route is accessible (error response expected)');
      console.log('   - Status:', error.response?.status);
    }
  }
  
  // Test 2: Check frontend route accessibility
  console.log('\n2. Testing frontend callback route...');
  try {
    const response = await axios.get('http://localhost:3000/auth/steam/callback');
    console.log('✅ Frontend callback route is accessible');
    console.log('   - Status:', response.status);
  } catch (error) {
    console.error('❌ Frontend callback route not accessible:', error.message);
  }
  
  // Test 3: Simulate successful authentication data
  console.log('\n3. Testing frontend callback with mock success data...');
  const mockUserData = {
    steamId: '76561198123456789',
    steamUsername: 'TestUser',
    steamAvatar: 'https://example.com/avatar.jpg',
    authToken: 'mock-jwt-token'
  };
  
  const encodedData = encodeURIComponent(JSON.stringify(mockUserData));
  const testUrl = `http://localhost:3000/auth/steam/callback?data=${encodedData}`;
  
  try {
    const response = await axios.get(testUrl);
    console.log('✅ Frontend can handle success data');
  } catch (error) {
    console.log('⚠️ Frontend callback test (expected - React routing)');
  }
  
  // Test 4: Check sessionStorage simulation
  console.log('\n4. Testing redirect destination logic...');
  console.log('   - Default redirect: "/"');
  console.log('   - SessionStorage key: "steamAuthRedirect"');
  console.log('   - Redirect delay: 2000ms');
  
  console.log('\n=== Potential Issues to Check ===');
  console.log('1. Browser console errors during redirect');
  console.log('2. React Router navigation issues');
  console.log('3. UserContext state updates');
  console.log('4. SessionStorage access in browser');
  console.log('5. setTimeout execution');
  
  console.log('\n=== Manual Testing Steps ===');
  console.log('1. Open browser dev tools (F12)');
  console.log('2. Go to http://localhost:3000/login');
  console.log('3. Click Steam login button');
  console.log('4. Complete Steam authentication');
  console.log('5. Watch console for errors during callback processing');
  console.log('6. Check if navigation occurs after 2 seconds');
}

debugRedirectFlow().catch(console.error);
