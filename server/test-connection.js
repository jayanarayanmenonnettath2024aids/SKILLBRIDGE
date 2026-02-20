import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection URI:', process.env.MONGODB_URI?.replace(/:[^:@]*@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // Create a test user to initialize the database
    const User = mongoose.model('User', new mongoose.Schema({
      fullName: String,
      email: String,
      phoneNumber: String,
      testUser: Boolean
    }));
    
    // Check if database exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Existing collections:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None (database will be created on first write)');
    
    // Create a test document to initialize the database
    console.log('\n🧪 Creating test user to initialize database...');
    const testUser = new User({
      fullName: 'Test User',
      email: 'test@skillbridge.com',
      phoneNumber: '9999999999',
      testUser: true
    });
    
    await testUser.save();
    console.log('✅ Test user created! Database "skillbridge" is now visible in MongoDB Atlas.');
    console.log('   You can now see it in your Data Explorer.');
    
    // Clean up test user
    await User.deleteOne({ testUser: true });
    console.log('🧹 Test user removed (cleanup).');
    
    console.log('\n✨ Database is ready! You can now:');
    console.log('   1. Check MongoDB Atlas Data Explorer - "skillbridge" database should appear');
    console.log('   2. Start the server: npm run dev');
    console.log('   3. Register users through the frontend');
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check your internet connection');
    console.error('   2. Verify MongoDB Atlas credentials');
    console.error('   3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.error('   4. Check if the connection string is correct in .env file');
    process.exit(1);
  });
