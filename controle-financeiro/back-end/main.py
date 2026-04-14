from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal

app = FastAPI()
transacoes = []

class MovimentacaoFinanceira(BaseModel):
    id: int
    valor: float
    tipo: Literal["ENTRADA", "SAÍDA"]
    descricao: str

@app.post("/transacoes")
def adicionar_transacao(nova_transacao: MovimentacaoFinanceira):
    for transacao in transacoes:
        if nova_transacao.id == transacao.id:
            return {"erro": f"Já existe transação utilizando o ID {nova_transacao.id}"}
    transacoes.append(nova_transacao)
    return {"mensagem": f"Transação de ID {nova_transacao.id} adicionada com sucesso."}
    
@app.delete("/transacoes/{id}")
def remover_transacao(id: int):
    for transacao in transacoes:
        if id == transacao.id: 
            transacoes.remove(transacao)
            return {"mensagem": f"Transação de ID {id} removida com sucesso."}
    return {"erro": f"Não existe transação com o ID {id}"}
    
@app.get("/transacoes/{id}")
def visualizar_transacao(id: int):
    for transacao in transacoes:
        if id == transacao.id:
            return transacao
    return{"erro": "ID de transação não encontrado."}

@app.get("/transacoes")
def visualizar_todas_transacoes():
    return transacoes

@app.put("/transacoes/{id}")
def alterar_transacao(id: int, nova_transacao: MovimentacaoFinanceira):
    for i, transacao in enumerate(transacoes):
        if id == transacao.id:
            if nova_transacao.id != transacao.id:
                return {"erro": "ID da Transação não pode ser alterado."}
            transacoes[i] = nova_transacao
            return {"mensagem": f"Transação {id} alterada com sucesso."}
    return {"erro": f"Não foi possível alterar a transação ID {id}."}

