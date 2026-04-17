from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

app = FastAPI()
mensagens = []
ids = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

class MensagemEntrada(BaseModel):
    msg: str

class Mensagem(BaseModel):
    id: int
    msg: str

def gerador_id():
    id = 1
    for i in ids:
        if(id == i):
            id += 1
    ids.append(id)
    return id 

@app.post("/enviar-mensagem")
def enviar_mensagem(nova_mensagem: MensagemEntrada):
    mensagem_normalizada = Mensagem(
        id= gerador_id(),
        msg= nova_mensagem.msg,
    )
    
    mensagens.append(mensagem_normalizada)
    return {"mensagem": f"Mensagem {mensagem_normalizada.id} enviada com sucesso."}

@app.get("/visualizar-mensagem/{id}")
def visualizar_mensagem(id: int):
    for mensagem in mensagens:
        if(id == mensagem.id):
            return {"mensagem": f"{mensagem.msg}"}