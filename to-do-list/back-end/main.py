from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
tasks = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    id: int
    titulo: str
    completa: bool = False

@app.post("/tasks")
def criar_task(nova_task: Task):
    for task in tasks:
        if nova_task.id == task.id:   
            return {"erro": "ID inserido já está sendo utilizado"}
        if nova_task.titulo == task.titulo:
            return {"erro": "Título inserido já está sendo utilizado"}
            
    tasks.append(nova_task)    
    return nova_task

@app.get("/tasks")
def visualizar_tasks():
    return tasks

@app.get("/tasks/{task_id}")
def buscar_task(task_id: int):
    for task in tasks:
        if task.id == task_id:
            return task
    return {"erro": "Tarefa não encontrada"}

@app.delete("/tasks/{task_id}")
def deletar_task(task_id: int):
    for task in tasks:
        if task.id == task_id:
            tasks.remove(task)
            return {"mensagem": f"Tarefa {task_id} apagada"}
    return {"erro": "Tarefa não encontrada"} 

@app.put("/tasks/{task_id}")
def alterar_task(task_id: int):
    for task in tasks:
        if task.id == task_id:
            task.completa = True
            return {"mensagem": f"Tarefa {task_id} concluída"}
    return {"mensagem": "Tarefa não encontrada"} 
