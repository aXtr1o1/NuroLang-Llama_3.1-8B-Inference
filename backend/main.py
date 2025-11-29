from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, pipeline
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
model = None
tokenizer = None
pipe = None

class Request(BaseModel):
    question: str
    answer: str

class Response(BaseModel):
    followUpQuestion: str

@app.on_event("startup")
async def startup():
    global model, tokenizer, pipe
    
    print("Loading model...")
    api_key = os.getenv("HUGGINGFACE_API_KEY")
    
    bnb_config = BitsAndBytesConfig(
        load_in_8bit=True,
        bnb_8bit_quant_type="nf4",
        bnb_8bit_use_double_quant=True,
        bnb_8bit_compute_dtype="float16"
    )
    
    model = AutoModelForCausalLM.from_pretrained(
        "meta-llama/Meta-Llama-3.1-8B",
        trust_remote_code=True,
        torch_dtype="auto",
        device_map="auto",
        quantization_config=bnb_config,
        token=api_key,
    )
    
    tokenizer = AutoTokenizer.from_pretrained("Pragades/LlaMa_Layers")
    model = PeftModel.from_pretrained(model, "Pragades/LlaMa_Layers")
    pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)
    print("Model loaded!")

@app.post("/inference", response_model=Response)
async def inference(req: Request):
    prompt = (
        "Below is a Conversation between a human and AI agent. "
        "Provide the corresponding followup question of the Question and answer provided. "
        f"Question:{req.question} \n Answer:{req.answer}\n FollowUp Question:"
    )
    
    outputs = pipe(
        prompt,
        max_new_tokens=100,
        eos_token_id=tokenizer.eos_token_id,
        do_sample=True,
        temperature=0.3,
        top_k=30,
        top_p=0.95,
        pad_token_id=tokenizer.pad_token_id,
    )
    
    response = outputs[0]["generated_text"][len(prompt):].strip()
    
    cutoff = min(
        response.find("Question:") if response.find("Question:") > 0 else len(response),
        response.find("Answer:") if response.find("Answer:") > 0 else len(response)
    )
    
    if cutoff > 0:
        response = response[:cutoff].strip()
    
    return Response(followUpQuestion=response)

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host= "0.0.0.0",
        port= 8000,
        reload=True,
        log_level="info"
    )