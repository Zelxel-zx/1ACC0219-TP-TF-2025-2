from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
from huggingface_hub import login
import torch
import re
from fastapi.middleware.cors import CORSMiddleware

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True,
    allow_methods=["*"],         
    allow_headers=["*"],
)
class NewsRequest(BaseModel):
    texto: str


class NewsResponse(BaseModel):
    label: int 
    confidence: float 


def clasificar_aya(texto: str) -> int:
    """
    Devuelve 0 si Aya cree que la noticia es FALSA,
    1 si cree que es VERDADERA.
    """

    prompt = (
    "Clasifica la siguiente noticia como 0=falsa o 1=verdadera.\n"
    "Reglas:\n"
    "- Marca 1 (verdadera) si el texto parece una noticia periodística normal: coherente, descriptiva, "
    "con hechos plausibles, instituciones reales, lugares, fechas o citas.\n"
    "- Marca 0 (falsa) solo si hay señales claras de desinformación: insultos, lenguaje muy emocional o agresivo, "
    "teorías conspirativas, exageraciones extremas, estructura caótica o texto claramente propagandístico.\n"
    "- Si el texto es neutral, informativo o no muestra señales fuertes de falsedad, clasifícalo como 1.\n"
    "- No seas demasiado estricto: recuerda que muchas noticias son verdaderas aunque no tengas toda la evidencia.\n"
    "Responde SOLO con 0 o 1.\n\n"
    "Ejemplos:\n"
    "FALSO -> 0: 'Aquí está el falso negro... Sanders... #DemDebate'\n"
    "FALSO -> 0: 'Trump llama títere, desastre, WEAK on Crime... Rusia Rusia Rusia...'\n"
    "VERDADERO -> 1: 'Singapur planea desplegar autobuses autónomos en 2022 para mejorar el transporte público.'\n"
    "VERDADERO -> 1: 'El Servicio Secreto investiga un incidente con un fotógrafo de Time en un mitin de Trump.'\n\n"
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
