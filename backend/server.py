from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
from huggingface_hub import login
import torch
import re

# AUTENTICACIÓN EN HUGGING FACE
# IMPORTANTE: reemplaza "tu_nuevo_token_aqui" por tu token real


MODEL_NAME = "CohereLabs/aya-23-8B"

print("Cargando modelo Aya para el backend...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto",
)

app = FastAPI()


class NewsRequest(BaseModel):
    texto: str


class NewsResponse(BaseModel):
    label: int  # 0=falsa, 1=verdadera
    confidence: float  # heurística, por ejemplo 0.9


def clasificar_aya(texto: str) -> int:
    """Misma lógica que en tu notebook: devuelve 0 o 1."""
    prompt = (
        "Clasifica la noticia como 0=falsa o 1=verdadera.\n"
        "Reglas:\n"
        "- 1 si el texto tiene estilo periodístico, hechos plausibles, citas o instituciones reales.\n"
        "- 0 si hay insultos, lenguaje emocional, propaganda, formato caótico o repeticiones absurdas.\n"
        "- Si no hay señales claras de falsedad, marca 1.\n"
        "Responde solo con 0 o 1.\n\n"
        "Ejemplos:\n"
        "FALSO: 'Aquí está el falso negro... Sanders... #DemDebate' -> 0\n"
        "FALSO: 'Clinton vence a Trump... EE., EE., EE...' -> 0\n"
        "FALSO: 'Roy Moore títere Schumer/Pelosi... Rusia Rusia Rusia' -> 0\n\n"
        "VERDADERO: 'Singapur desplegará autobuses autónomos en 2022...' -> 1\n"
        "VERDADERO: 'Marcus Pretzell deja la AfD en Alemania...' -> 1\n"
        "VERDADERO: 'El Servicio Secreto investiga incidente con fotógrafo de Time...' -> 1\n\n"
        "Noticia:\n"
        f"{texto}\n\n"
        "Respuesta:"
    )

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=4,
            do_sample=False,
            temperature=0.0,
        )

    generated = output_ids[0][inputs["input_ids"].shape[1]:]
    gen_text = tokenizer.decode(generated, skip_special_tokens=True)
    gen_text = gen_text.strip()

    match = re.search(r"[01]", gen_text)
    if match:
        return int(match.group(0))
    else:
        return 0


@app.post("/clasificar", response_model=NewsResponse)
async def clasificar_noticia(req: NewsRequest):
    label = clasificar_aya(req.texto)

    # Confianza heurística fija al 90%
    confidence = 0.9

    return NewsResponse(label=label, confidence=confidence)


@app.get("/")
async def root():
    return {"status": "ok", "message": "Backend Aya listo"}
