# MongoDB Setup Instructions

## Option 1: Install MongoDB Locally (Recommended)

### Windows:

1. **Download MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server (Windows)
   - Run the installer (`.msi` file)

2. **Install MongoDB Compass** (GUI Tool)
   - Visit: https://www.mongodb.com/try/download/compass
   - Download and install MongoDB Compass
   - This provides a visual interface to manage your database

3. **Start MongoDB Service**
   ```powershell
   # MongoDB should start automatically after installation
   # Or start manually:
   net start MongoDB
   ```

4. **Verify Connection**
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017/`
   - You should see the connection successful

## Option 2: Use MongoDB Atlas (Cloud)

1. **Create Free Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free tier (512MB storage)

2. **Create Cluster**
   - Follow the setup wizard
   - Choose "Shared" (Free tier)
   - Select your region

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

4. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://username:<password>@cluster.mongodb.net/
   MONGODB_DB_NAME=skillbridge
   ```

## Database Setup

Once MongoDB is running:

1. **Install Python Dependencies**
   ```bash
   cd skillgap-backend
   pip install -r requirements.txt
   ```

2. **Seed Data** (Create demo users and skills)
   ```bash
   python seed_data.py
   ```

3. **Start Backend**
   ```bash
   python app.py
   ```

## Verify Setup

- Backend should start at: `http://localhost:5000`
- MongoDB Compass should show:
  - Database: `skillbridge`
  - Collections: `users`, `requiredSkills`, `auth_users`, etc.

## Environment Variables

Required in `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=skillbridge
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SEARCH_API_KEY=your_google_search_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
PORT=5000
```

## Collections Structure

### users
```json
{
  "_id": "user_001",
  "name": "John Doe",
  "role": "Software Developer",
  "skills": {
    "Python": 8,
    "JavaScript": 7
  },
  "resumeURL": "http://localhost:5000/api/files/resumes/user_001/resume.pdf",
  "geminiAnalysis": {...}
}
```

### requiredSkills
```json
{
  "role": "Software Developer",
  "skills": {
    "Python": 9,
    "JavaScript": 8,
    "Git Version Control": 7
  }
}
```

## Troubleshooting

### Connection Failed
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify MONGODB_URI in .env file

### Permission Errors
- Run MongoDB Compass or terminal as Administrator
- Check Windows Firewall settings

### Database Empty
- Run `python seed_data.py` to populate demo data
- Check MongoDB Compass to verify collections

## Benefits of MongoDB over Firebase

✅ **No External Dependencies** - Works completely offline
✅ **Free & Open Source** - No billing or quotas
✅ **Better Performance** - Local database, faster queries
✅ **Full Control** - Own your data
✅ **MongoDB Compass** - Professional GUI tool included
✅ **Industry Standard** - Widely used in production
