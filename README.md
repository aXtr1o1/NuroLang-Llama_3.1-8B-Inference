# NuroLnag Q&A Inference System

An AI-powered interactive Q&A system that generates follow-up questions using a fine-tuned LLaMA model. Built with Next.js frontend and FastAPI backend.

## 📋 Overview

This project provides an interactive chat interface where users can:
1. Start a conversation with an initial question
2. Answer the question
3. Get AI-generated follow-up questions automatically
4. Continue the conversation in a loop

The system uses a fine-tuned LLaMA 3.1 8B model with LoRA adapters to generate contextual follow-up questions.

---

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Communication**: REST API

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Model**: Meta-Llama-3.1-8B with LoRA adapters
- **Quantization**: 8-bit (bitsandbytes)

---

## 📁 Project Structure

```
project/
├── frontend/
│   ├── pages/
│   │   ├── index.js
│   │   └── api/
│   │       └── inference.js
│   ├── components/
│   │   └── Chat.js
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   ├── .env.local
│   └── .gitignore
│
└── backend/
    ├── main.py
    ├── requirements.txt
    ├── .env
    └── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- 8GB+ GPU memory (for model inference)
- Hugging Face API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# On Linux/Mac
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file:
```
HUGGINGFACE_API_KEY=your_api_key_here
```

6. Start the server:
```bash
uvicorn main:app --reload --port 8000
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 💻 Usage

1. Open your browser and go to `http://localhost:3000`
2. Click "Start" button to begin a session
3. Answer the initial question "What is Java?"
4. Submit your answer
5. System will generate a follow-up question
6. Continue the conversation
7. Click "Reset" to start a new session

---

## 🔧 API Endpoints

### Backend

#### Health Check
```
GET /health
```
Response: `{"status": "ok"}`

#### Generate Follow-up Question
```
POST /inference
Content-Type: application/json

{
  "question": "What is Java?",
  "answer": "Java is a programming language"
}
```

Response:
```json
{
  "followUpQuestion": "Can you explain the difference between Java and Python?"
}
```

#### Frontend API Route
```
POST /api/inference
Content-Type: application/json

{
  "question": "What is Java?",
  "answer": "Java is a programming language"
}
```

---

## 🔐 Environment Variables

### Backend (.env)
```
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## 📦 Dependencies

### Backend
- fastapi: Web framework
- uvicorn: ASGI server
- pydantic: Data validation
- torch: PyTorch framework
- transformers: LLaMA model
- peft: LoRA adapter support
- bitsandbytes: 8-bit quantization
- accelerate: Distributed training/inference
- python-dotenv: Environment variables

### Frontend
- react: UI library
- next: React framework
- tailwindcss: CSS framework
- lucide-react: Icon library

---

## 🎯 Model Details

- **Base Model**: Meta-Llama-3.1-8B
- **Fine-tuned Adapter**: Pragades/LlaMa_Layers
- **Quantization**: 8-bit NF4 with double quantization
- **Compute Dtype**: float16
- **Max New Tokens**: 100
- **Temperature**: 0.3
- **Top-k**: 30
- **Top-p**: 0.95

---

## 📝 Configuration

### Model Loading
The model is loaded on backend startup. This may take a few minutes on first run.

### Inference Settings
All inference parameters can be modified in `backend/main.py`:
- `max_new_tokens`: Maximum length of generated question
- `temperature`: Controls randomness (lower = more deterministic)
- `top_k`: Top-k sampling parameter
- `top_p`: Nucleus sampling parameter

---

## 🐛 Troubleshooting

### Backend Issues

**Model Loading Error**
- Ensure Hugging Face API key is valid
- Check GPU memory availability
- Verify internet connection for model download

**Port Already in Use**
```bash
# Change port
uvicorn main:app --reload --port 8001
```

### Frontend Issues

**Cannot Connect to Backend**
- Ensure backend is running on port 8000
- Check `.env.local` has correct backend URL
- Verify CORS is enabled in backend

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## 📈 Performance

- **Model Size**: ~16GB (with 8-bit quantization: ~8GB)
- **Inference Time**: 30-60 seconds per follow-up question (depends on GPU)
- **Memory Usage**: 8GB+ recommended

---

## 🔄 Workflow

1. User clicks "Start" → Initial question displayed
2. User enters answer → Sent to backend API
3. Backend processes → Generates follow-up question
4. Follow-up question displayed → Loop continues

---

## 📚 File Descriptions

### Backend (main.py)
- Model initialization on startup
- FastAPI application setup
- CORS middleware configuration
- POST endpoint for inference
- Health check endpoint

### Frontend (Chat.js)
- Chat state management
- Question/answer input handling
- API communication
- Message display

### Frontend (pages/api/inference.js)
- Next.js API route
- Backend proxy
- Error handling

---

## 🎓 Learning Notes

### LLaMA Model
- Large Language Model Meta AI
- 8B parameter base model
- Fine-tuned with LoRA for Q&A tasks

### LoRA
- Low-Rank Adaptation technique
- Efficient fine-tuning with fewer parameters
- Reduces memory footprint

### Quantization
- 8-bit: Reduces model size by 75%
- NF4: Normalized float 4-bit format
- Double quantization: Further memory optimization

---

## 🚢 Deployment

### Backend Deployment (Production)
```bash
# Using Gunicorn with Uvicorn workers
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment
```bash
# Build production bundle
npm run build
npm start
```

---

## ⚡ Tips & Best Practices

1. **First Run**: Model download on first run may take 10-20 minutes based on the GPU
2. **GPU Memory**: Monitor GPU usage during inference
3. **Answer Format**: Provide detailed answers for better follow-up questions
4. **Error Handling**: Check browser console for frontend errors
5. **Logs**: Check backend terminal for detailed logs

---

## 🔗 References

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Next.js Documentation](https://nextjs.org)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers)
- [PEFT Documentation](https://huggingface.co/docs/peft)
- [LLaMA Model Card](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B)

---

## 📊 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 16GB | 32GB |
| GPU | 5GB | 12GB+ |
| Storage | 30GB | 50GB |
| Python | 3.9 | 3.10+ |
| Node.js | 16 | 18+ |

---

