const API_URL = "http://127.0.0.1:8000";

async function criarTask() {
    const id = document.getElementById("id").value;
    const titulo = document.getElementById("titulo").value;

    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: Number(id),
            titulo: titulo,
            completa: false
        })
    });

    const data = await response.json();
    console.log(data);

    listarTasks();
}

async function listarTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();
    
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    
    tasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${task.id} - ${task.titulo} - ${task.completa ? "SIM" : "NÃO"}
            <button onclick="concluirTask(${task.id})">Concluir</button>
            <button onclick="deletarTask(${task.id})">Deletar</button>
        `;

        lista.appendChild(li);
    });
}

async function concluirTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT"
    });

    listarTasks();
}

async function deletarTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });

    listarTasks();
}