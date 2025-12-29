# AI Video Generator - Complete Setup Guide

A free, open-source AI-powered application featuring **semantic search** and **AI video generation** with text-to-speech capabilities.

## 🚀 Complete Setup Guide (From Zero to Video Generation)

### Prerequisites

Before you begin, install these tools:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python 3.9** - [Download](https://www.python.org/)
- **Homebrew** (macOS) - For installing system dependencies
- **Git** - [Download](https://git-scm.com/)

---

## 📋 Step-by-Step Setup Process

### Step 1: Clone the Repository

```bash
git clone https://github.com/Muthuvel-M/Ai-image-generator.git
cd Ai-image-generator
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

This installs Next.js and all React dependencies (~2 minutes).

### Step 3: Setup Python Backend

#### 3.1 Create Virtual Environment

```bash
cd backend
python3 -m venv venv
```

#### 3.2 Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` prefix in your terminal.

#### 3.3 Install Python Dependencies

**Important**: Do NOT install from `requirements.txt` directly (it has TTS dependency conflicts). Use this command instead:

```bash
./venv/bin/python -m pip install chromadb==0.4.22 sentence-transformers==2.3.1 "numpy<2.0.0" fastapi==0.109.0 "uvicorn[standard]==0.27.0" python-multipart==0.0.6 requests==2.31.0 python-dotenv==1.0.0 pydantic==2.5.3 aiosqlite==0.19.0 httpx "moviepy==1.0.3"
```

This will take **5-10 minutes** and download ~2GB of AI models.

#### 3.4 Install TTS (Text-to-Speech)

```bash
./venv/bin/python -m pip install TTS
```

This may take **10-15 minutes** to resolve dependencies.

#### 3.5 Fix TTS Dependencies

TTS has compatibility issues with Python 3.9. Fix them:

```bash
# Downgrade bangla package for Python 3.9 compatibility
./venv/bin/python -m pip install "bangla==0.0.2"

# Upgrade numpy for ChromaDB compatibility
./venv/bin/python -m pip install --upgrade "numpy>=1.22.5,<2.0.0"

# Upgrade pip (optional but recommended)
./venv/bin/python -m pip install --upgrade pip
```

#### 3.6 Install espeak-ng (Required for TTS)

**macOS:**
```bash
brew install espeak-ng
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install espeak-ng
```

**Windows:**
Download from [espeak-ng releases](https://github.com/espeak-ng/espeak-ng/releases)

Verify installation:
```bash
espeak-ng --version
# Should show: eSpeak NG text-to-speech: 1.52.0
```

### Step 4: Populate the Knowledge Base

```bash
python populate_db.py
```

**Expected Output:**
```
INFO: Successfully populated database with 49 documents!
INFO: Top result: Quantum computing uses quantum bits...
```

This loads 49 tech documents into ChromaDB vector database.

### Step 5: Start the Application

You need **TWO terminal windows** running simultaneously:

#### Terminal 1 - Backend Server

```bash
cd backend
source venv/bin/activate  # Activate venv first!
PATH="/opt/homebrew/bin:$PATH" python mcp_server.py
```

**Important**: The `PATH` prefix is required so Python can find `espeak-ng`.

**Expected Output:**
```
INFO: Documents in database: 49
INFO: Uvicorn running on http://0.0.0.0:8000
```

#### Terminal 2 - Frontend Development Server

Open a **new terminal window**:

```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  
✓ Ready in 2.3s
```

### Step 6: Open the Application

Visit: **http://localhost:3000**

---

## 🎬 How to Generate AI Videos (Complete Workflow)

### Step 1: Search for a Topic

1. Open http://localhost:3000
2. Type a question in the chat input, for example:
   - "Explain quantum computing"
   - "What is machine learning"
   - "How does blockchain work"

3. Press **Enter** or click the **Send** button

### Step 2: Review Search Results

You'll see 5 AI-powered search results ranked by relevance:
- Result #1 (highest relevance ~95%)
- Result #2-5 (decreasing relevance)

### Step 3: Generate Video

1. Click the **"Generate Video Explanation"** button
2. You'll see a progress indicator:
   ```
   🎬 Generating AI video... (10-15 seconds)
   ```

### Step 4: Watch Your AI-Generated Video

Once complete, the video will:
- ✅ Auto-play in the chat
- 🔊 Narrate the **first search result** using AI voice
- 🎥 Display as a playable video with controls

**What the video contains:**
- **Audio**: TTS narration of the most relevant search result
- **Visual**: Static background (currently)
- **Duration**: Based on text length (~5-30 seconds)

### Video Generation Behind the Scenes:

1. **Script Extraction**: Takes the first (most relevant) search result
2. **Text-to-Speech**: Uses TTS + espeak-ng to convert text → audio
3. **Video Assembly**: Combines audio with visuals using MoviePy
4. **Delivery**: Serves video from `backend/videos/` directory

---

## 🛠️ Complete Troubleshooting Guide

### 🔴 Issue 1: `ModuleNotFoundError: No module named 'chromadb'`

**Cause**: Python packages not installed in virtual environment

**Solution**:
```bash
cd backend
source venv/bin/activate
./venv/bin/python -m pip install chromadb==0.4.22 sentence-transformers==2.3.1 "numpy<2.0.0" fastapi==0.109.0 "uvicorn[standard]==0.27.0" python-multipart==0.0.6 requests==2.31.0 python-dotenv==1.0.0 pydantic==2.5.3 aiosqlite==0.19.0 httpx "moviepy==1.0.3"
```

---

### 🔴 Issue 2: `ModuleNotFoundError: No module named 'moviepy.editor'`

**Cause**: MoviePy version 2.x doesn't have the `editor` module

**Solution**:
```bash
./venv/bin/python -m pip uninstall -y moviepy
./venv/bin/python -m pip install "moviepy==1.0.3"
```

**Verify**:
```bash
./venv/bin/python -c "from moviepy.editor import ImageClip; print('✅ Works!')"
```

---

### 🔴 Issue 3: Video Generation Fails with "No espeak backend found"

**Cause**: espeak-ng not installed on system

**Full Error**:
```
ERROR: Video generation failed: [!] No espeak backend found. 
Install espeak-ng or espeak to your system.
```

**Solution**:

**Step 1 - Install espeak-ng:**
```bash
# macOS
brew install espeak-ng

# Linux
sudo apt-get install espeak-ng

# Windows - Download from GitHub releases
```

**Step 2 - Restart Backend with Updated PATH:**
```bash
# Stop the running server (Ctrl+C)
# Then restart with:
PATH="/opt/homebrew/bin:$PATH" python mcp_server.py
```

**Why PATH is needed**: Python needs to find the `espeak-ng` executable in Homebrew's bin directory.

**Verify espeak-ng works:**
```bash
espeak-ng --version
# Should output: eSpeak NG text-to-speech: 1.52.0
```

---

### 🔴 Issue 4: `TypeError: unsupported operand type(s) for |: 'type' and 'NoneType'`

**Cause**: `bangla` package version 0.0.5 uses Python 3.10+ syntax incompatible with Python 3.9

**Full Error**:
```python
File ".../bangla/__init__.py", line 139, in <module>
    def get_date(passed_date=None, passed_month=None, passed_year=None, ordinal: bool | None = False):
TypeError: unsupported operand type(s) for |: 'type' and 'NoneType'
```

**Solution**:
```bash
./venv/bin/python -m pip install "bangla==0.0.2"
```

---

### 🔴 Issue 5: Numpy Version Conflicts

**Warning Message**:
```
ERROR: pip's dependency resolver does not currently take into account all packages...
chromadb 0.4.22 requires numpy>=1.22.5, but you have numpy 1.22.0
tts 0.22.0 requires numpy==1.22.0; python_version <= "3.10", but you have numpy 1.26.4
```

**Cause**: TTS wants numpy 1.22.0, but ChromaDB needs >=1.22.5

**Solution**:
```bash
./venv/bin/python -m pip install --upgrade "numpy>=1.22.5,<2.0.0"
```

**Note**: This warning is usually non-critical. The app will work with numpy 1.26.4.

---

### 🔴 Issue 6: Next.js Hydration Warning

**Error in Browser Console**:
```
Warning: A tree hydrated but some attributes of the server rendered HTML 
didn't match the client properties...
data-locator-target="antigravity://file/${projectPath}..."
```

**Cause**: Next.js dev tools add attributes during development

**Solution**: Already fixed in `app/layout.jsx`:
```jsx
<html lang="en" suppressHydrationWarning>
```

This warning is harmless and only appears in development mode.

---

### 🔴 Issue 7: Port Already in Use

**Error**: `Address already in use` on port 8000 or 3000

**Solution**:

**macOS/Linux:**
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

### 🔴 Issue 8: "Failed to generate video: HTTP error! status: 500"

**Possible Causes**:
1. espeak-ng not installed ✓
2. Server needs restart after installing espeak-ng ✓
3. Virtual environment not activated ✓

**Debugging Steps**:

**Step 1 - Check Backend Logs:**
Look in Terminal 1 for error messages like:
```
ERROR: Video generation failed: [!] No espeak backend found
```

**Step 2 - Verify espeak-ng:**
```bash
PATH="/opt/homebrew/bin:$PATH" which espeak-ng
# Should show: /opt/homebrew/bin/espeak-ng
```

**Step 3 - Restart Backend:**
```bash
# Stop server (Ctrl+C)
PATH="/opt/homebrew/bin:$PATH" python mcp_server.py
```

---

### 🔴 Issue 9: Search Returns 0 Results

**Cause**: Database not populated

**Solution**:
```bash
cd backend
source venv/bin/activate
python populate_db.py
```

**Verify**:
Backend logs should show:
```
INFO: Documents in database: 49
```

---

### 🔴 Issue 10: Frontend Can't Connect to Backend

**Error**: "Failed to fetch" in browser console

**Solutions**:

**1. Check Backend is Running:**
```bash
curl http://localhost:8000
# Should return: {"message":"MCP Server is running!"}
```

**2. Check Correct Ports:**
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

**3. Clear Browser Cache:**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

## ✨ Features

### ✅ Implemented

- **🔍 Semantic Search**: 
  - AI-powered knowledge base search
  - 49 tech documents indexed
  - Relevance scoring
  - Feedback system (👍/👎)

- **🎬 AI Video Generation**:
  - Text-to-Speech narration
  - Automatic video creation from search results
  - Uses first (most relevant) result
  - 10-15 second generation time

### 🚧 Coming Soon

- **🎨 Image Generation**: DALL-E style image creation
- **🎥 Advanced Videos**: Custom avatars, animations
- **📊 Analytics Dashboard**: Search insights

---

## 📊 System Requirements

### Minimum
- **RAM**: 8GB
- **Storage**: 20GB free
- **CPU**: Any modern processor (2+ cores)
- **OS**: macOS, Linux, or Windows

### Recommended
- **RAM**: 16GB
- **Storage**: 50GB free
- **CPU**: 4+ cores (Apple Silicon M1/M2 ideal)
- **GPU**: Optional (speeds up AI processing)

---

## �️ Technology Stack

**Frontend**:
- Next.js 16.0.10
- React 19
- Tailwind CSS
- Vercel Analytics

**Backend**:
- FastAPI 0.109.0
- Python 3.9
- ChromaDB 0.4.22 (Vector Database)
- Sentence Transformers 2.3.1 (Embeddings)
- TTS 0.22.0 (Text-to-Speech)
- MoviePy 1.0.3 (Video Generation)

**AI Models** (All Free & Local):
- `all-MiniLM-L6-v2` - Semantic search embeddings
- `tts_models/en/ljspeech/vits` - Voice synthesis

**System Dependencies**:
- espeak-ng 1.52.0 - Phoneme generation for TTS

---

## 📁 Project Structure

```
Ai-image-generator/
├── app/                      # Next.js App Router
│   ├── layout.jsx           # Root layout
│   ├── page.jsx             # Homepage (chat interface)
│   └── globals.css          # Global styles
├── components/               # React components
│   ├── ai-chat-screen.jsx   # Main chat UI with search & video
│   └── floating-dots.jsx    # Background animation
├── backend/                  # Python backend
│   ├── mcp_server.py        # FastAPI server (main)
│   ├── vector_db.py         # ChromaDB wrapper
│   ├── populate_db.py       # Database seeder
│   ├── local_video_generator.py  # Video generation
│   ├── video_generator.py   # Video API handler
│   ├── requirements.txt     # Python dependencies
│   ├── venv/                # Virtual environment (git-ignored)
│   └── videos/              # Generated videos (created at runtime)
├── data/
│   └── chromadb/            # Vector database storage
├── public/                   # Static assets
└── package.json             # Node.js config
```

---

## 🔧 Development

### Backend API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/search` | POST | Semantic search (returns 5 results) |
| `/api/generate-video` | POST | Generate AI video from script |
| `/api/feedback` | POST | Save user feedback (👍/👎) |
| `/api/stats` | GET | Database statistics |
| `/docs` | GET | Swagger UI (API documentation) |
| `/videos/{filename}` | GET | Serve generated videos |

### API Documentation

Visit http://localhost:8000/docs for interactive Swagger UI.

### Key Files to Know

**Frontend**:
- `components/ai-chat-screen.jsx` - Main UI logic, search, and video generation
- `app/page.jsx` - Homepage route

**Backend**:
- `mcp_server.py` - API server, all endpoints
- `local_video_generator.py` - TTS + MoviePy video creation
- `vector_db.py` - ChromaDB search logic

---

## 💰 Cost

**$0/month** - Everything runs locally!

No API keys, no cloud costs, fully offline-capable (after initial model download).

---

## 📝 Useful Commands

### Frontend
```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm start            # Production server
npm run lint         # Check code quality
```

### Backend
```bash
# Start server
PATH="/opt/homebrew/bin:$PATH" python mcp_server.py

# Populate database
python populate_db.py

# Test TTS directly
python -c "from TTS.api import TTS; print('✅ TTS works!')"

# Test moviepy
python -c "from moviepy.editor import ImageClip; print('✅ MoviePy works!')"
```

---

## 🤝 Contributing

Found an issue? Have an improvement?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - Feel free to use this project however you want!

---

## 🙏 Acknowledgments

- **ChromaDB** - Vector database
- **Sentence Transformers** - AI embeddings
- **Coqui TTS** - Text-to-speech
- **MoviePy** - Video generation
- **FastAPI** - Backend framework
- **Next.js** - Frontend framework

---

## 🆘 Still Having Issues?

If you encounter problems not covered here:

1. **Check Backend Logs** (Terminal 1) for error messages
2. **Check Browser Console** (F12 → Console) for frontend errors
3. **Verify Prerequisites** are installed correctly
4. **Restart Both Servers** (often fixes state issues)
5. **Check GitHub Issues**: [github.com/Muthuvel-M/Ai-image-generator/issues](https://github.com/Muthuvel-M/Ai-image-generator/issues)

---

**Made with ❤️ by Muthuvel M**

**Star ⭐ this repo if it helped you!**
