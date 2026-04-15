const API_URL = "http://127.0.0.1:8000";

window.onload = function () {
    carregar_saldo();
}

function limpar_inputs() {
    document.getElementById("id").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("descricao").value = "";
}

async function carregar_saldo() {
    const response = await fetch(`${API_URL}/saldo`, {
        method: "GET"
    });
    const data = await response.json();

    document.getElementById("saldo").innerText = data.mensagem;
}

async function adicionar_transacao() {
    const id = document.getElementById("id").value;
    const valor = document.getElementById("valor").value;
    const tipo = document.getElementById("tipo").value;
    const descricao = document.getElementById("descricao").value;
    
    const response = await fetch(`${API_URL}/transacoes`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: Number(id),
            valor: parseFloat(valor), 
            tipo: tipo,
            descricao: descricao    
        })
    });

    const data = await response.json();
    console.log(data);

    const resultado = document.getElementById("resultado");

    if(data.erro) {
        resultado.innerHTML = `Erro: ${data.erro}`;
        return
    } else {
        resultado.innerHTML = `Transação adicionada com sucesso`;
        limpar_inputs();
    }

    carregar_saldo();
}

async function remover_transacao() {
    const id = document.getElementById("id").value
    const resultado = document.getElementById("resultado");

    const response = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "DELETE"
    });
    const data = await response.json();

    console.log(data);

    if(data.erro) {
        resultado.innerHTML = `Erro: ${data.erro}`;
        return
    } else {
        resultado.innerHTML= `Transação de ID ${id} excluída.`;
        limpar_inputs();
    }

    carregar_saldo();
}

async function visualizar_transacao() {
    const id = document.getElementById("id").value;
    const resultado = document.getElementById("resultado");

    const response = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "GET"
    });
    const data = await response.json();

    console.log(data);

    if(data.erro) {
        resultado.innerHTML = `Erro: ${data.erro}`;
        return
    } else{
        resultado.innerHTML = `
            ID: ${data.id}<br>
            Valor: ${data.valor}<br>
            Tipo: ${data.tipo}<br>
            Descrição: ${data.descricao}<br> 

            <button onclick="limpar_inputs()">Cancelar</button>
            <button onclick="remover_transacao()">Remover Transação</button>
        `;
    }
}