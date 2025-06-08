const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testApplicationHistoryAPI() {
  try {
    console.log('🧪 Testing Application History API...');
    console.log('');

    // Test with a known Discord ID from the logs
    const testDiscordId = '1016226800403230732'; // From the server logs
    const baseUrl = 'http://localhost:5000/api';

    console.log(`📋 Testing with Discord ID: ${testDiscordId}`);
    console.log('');

    // Test 1: Get application history
    console.log('🔍 Test 1: Fetching application history...');
    try {
      const response = await fetch(`${baseUrl}/applications/history/${testDiscordId}`);
      const data = await response.json();

      if (data.success) {
        console.log('✅ Application history retrieved successfully!');
        console.log(`   Total applications: ${data.pagination.totalApplications}`);
        console.log(`   Current page: ${data.pagination.currentPage}/${data.pagination.totalPages}`);
        console.log('');
        console.log('📊 Summary:');
        console.log(`   Total: ${data.summary.total}`);
        console.log(`   Pending: ${data.summary.pending}`);
        console.log(`   Approved: ${data.summary.approved}`);
        console.log(`   Rejected: ${data.summary.rejected}`);
        console.log('');
        
        if (data.applications.length > 0) {
          console.log('📋 Applications found:');
          data.applications.forEach((app, index) => {
            console.log(`   ${index + 1}. ${app.characterName} - Status: ${app.status}`);
            console.log(`      ID: ${app.id}`);
            console.log(`      Submitted: ${new Date(app.submissionDate).toLocaleString()}`);
            if (app.feedback) {
              console.log(`      Feedback: ${app.feedback}`);
            }
            if (app.moderator) {
              console.log(`      Reviewed by: ${app.moderator.username}`);
            }
            console.log('');
          });
        }
      } else {
        console.log('❌ Failed to retrieve application history');
        console.log(`   Error: ${data.message}`);
      }
    } catch (error) {
      console.log('❌ API request failed:', error.message);
    }

    console.log('');

    // Test 2: Test with status filter
    console.log('🔍 Test 2: Testing status filter (rejected applications)...');
    try {
      const response = await fetch(`${baseUrl}/applications/history/${testDiscordId}?status=rejected`);
      const data = await response.json();

      if (data.success) {
        console.log('✅ Filtered results retrieved successfully!');
        console.log(`   Rejected applications: ${data.applications.length}`);
        
        data.applications.forEach((app, index) => {
          console.log(`   ${index + 1}. ${app.characterName} - ${app.status}`);
          if (app.feedback) {
            console.log(`      Rejection reason: ${app.feedback}`);
          }
        });
      } else {
        console.log('❌ Failed to retrieve filtered results');
        console.log(`   Error: ${data.message}`);
      }
    } catch (error) {
      console.log('❌ Filtered API request failed:', error.message);
    }

    console.log('');

    // Test 3: Test pagination
    console.log('🔍 Test 3: Testing pagination...');
    try {
      const response = await fetch(`${baseUrl}/applications/history/${testDiscordId}?page=1&limit=2`);
      const data = await response.json();

      if (data.success) {
        console.log('✅ Pagination test successful!');
        console.log(`   Page: ${data.pagination.currentPage}/${data.pagination.totalPages}`);
        console.log(`   Limit: ${data.pagination.limit}`);
        console.log(`   Has next page: ${data.pagination.hasNextPage}`);
        console.log(`   Has previous page: ${data.pagination.hasPrevPage}`);
        console.log(`   Applications on this page: ${data.applications.length}`);
      } else {
        console.log('❌ Pagination test failed');
        console.log(`   Error: ${data.message}`);
      }
    } catch (error) {
      console.log('❌ Pagination API request failed:', error.message);
    }

    console.log('');

    // Test 4: Test with non-existent identifier
    console.log('🔍 Test 4: Testing with non-existent identifier...');
    try {
      const response = await fetch(`${baseUrl}/applications/history/nonexistent123`);
      const data = await response.json();

      if (!data.success) {
        console.log('✅ Correctly handled non-existent identifier');
        console.log(`   Expected error: ${data.message}`);
      } else {
        console.log('❌ Should have returned error for non-existent identifier');
      }
    } catch (error) {
      console.log('❌ Non-existent identifier test failed:', error.message);
    }

    console.log('');

    // Test 5: Test with Steam ID (if available)
    console.log('🔍 Test 5: Testing with Steam ID...');
    const testSteamId = 'steam:110000123456789'; // Example Steam ID
    try {
      const response = await fetch(`${baseUrl}/applications/history/${encodeURIComponent(testSteamId)}`);
      const data = await response.json();

      if (data.success) {
        console.log('✅ Steam ID search successful!');
        console.log(`   Applications found: ${data.applications.length}`);
      } else {
        console.log('ℹ️ No applications found for test Steam ID (expected)');
        console.log(`   Message: ${data.message}`);
      }
    } catch (error) {
      console.log('❌ Steam ID test failed:', error.message);
    }

    console.log('');
    console.log('🎉 Application History API testing completed!');
    console.log('');
    console.log('📋 Next steps to test the full feature:');
    console.log('1. Open http://localhost:3000/history in your browser');
    console.log('2. Enter a Discord ID or Steam ID that has applications');
    console.log('3. Test the search, filtering, and pagination features');
    console.log('4. Verify that rejection reasons are displayed correctly');
    console.log('5. Test the responsive design on mobile devices');

  } catch (error) {
    console.error('❌ Application History API test failed:', error.message);
  }
}

// Run the test
testApplicationHistoryAPI();
