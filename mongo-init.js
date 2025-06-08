// MongoDB initialization script
// This script runs when the container starts for the first time

// Switch to the whitelist-web database
db = db.getSiblingDB('whitelist-web');

// Create a user for the application
db.createUser({
  user: 'whitelistapp',
  pwd: 'whitelistpass123',
  roles: [
    {
      role: 'readWrite',
      db: 'whitelist-web'
    }
  ]
});

// Create indexes for better performance
db.applications.createIndex({ "discordId": 1 });
db.applications.createIndex({ "status": 1 });
db.applications.createIndex({ "submittedAt": -1 });
db.applications.createIndex({ "discordId": 1, "status": 1 });

print('MongoDB initialization completed for whitelist-web database');
