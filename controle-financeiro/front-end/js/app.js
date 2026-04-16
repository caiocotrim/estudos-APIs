const API_URL = "http://127.0.0.1:8000";

window.onload = function () {
    const saldo = document.getElementById("saldo");
    if(saldo){
        carregar_saldo();
    }
}

function limpar_inputs() {
    const id = document.getElementById("id");
    if(id){
        id.value = '';
    }

    const valor = document.getElementById("valor");
    if(valor){
        valor.value = '';
    }

    const tipo = document.getElementById("tipo");
    if(tipo){
        tipo.value = '';
    }

    const descricao = document.getElementById("descricao");
    if(descricao){
        descricao.value = '';
    }

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
    
    const tipo_normalizado = tipo.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");;

    const response = await fetch(`${API_URL}/transacoes`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: Number(id),
            valor: parseFloat(valor), 
            tipo: tipo_normalizado,
            descricao: descricao    
        })
    });

    const data = await response.json();
    console.log(data);

    const resultado = document.getElementById("resultado");

    if(data.erro) {
        resultado.innerHTML = `<br>Erro: ${data.erro}`;
        return
    } else {
        resultado.innerHTML = `<br>Transação adicionada com sucesso`;
        limpar_inputs();
    }

    carregar_saldo();
}

async function remover_transacao(id) {
    const resultado = document.getElementById("resultado");

    const response = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "DELETE"
    });
    const data = await response.json();

    console.log(data);

    if(data.erro) {
        resultado.innerHTML = `<br>Erro: ${data.erro}`;
        return
    } else {
        resultado.innerHTML= `<br>Transação de ID ${id} excluída.`;
        limpar_inputs();
    }

    carregar_saldo();
}

async function visualizar_para_remover_transacao() {
    const id = document.getElementById("id").value;
    const resultado = document.getElementById("resultado");

    const response = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "GET"
    });
    const data = await response.json();

    console.log(data);

    if(data.erro) {
        resultado.innerHTML = `<br>Erro: ${data.erro}`;
        return
    } else{
        resultado.innerHTML = `
            <br>
            ID: ${data.id}<br>
            Valor: ${data.valor}<br>
            Tipo: ${data.tipo}<br>
            Descrição: ${data.descricao}<br>
            <br>

            <button onclick="limpar_inputs()">Cancelar</button>
            <button onclick="remover_transacao(${data.id})">Remover Transação</button>
        `;
    }
}

async function visualizar_transacao() {
    const id = document.getElementById("id").value;
    const resultado = document.getElementById("resultado");

    const response = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "GET"
    });

    const data = await response.json();

    console.log(data);

    if(data.erro){
        resultado.innerHTML = `<br>Erro: ${data.erro}`;
        return
    } else {    
        resultado.innerHTML = `
            <br>ID: ${data.id}<br>
            Valor: ${data.valor}<br>
            Tipo: ${data.tipo}<br>
            Descrição: ${data.descricao}<br>
        `;
    }
}

async function visualizar_todas_transacoes() {
    const resultado = document.getElementById("resultado");
    
    const response = await fetch(`${API_URL}/transacoes`, {
        method: "GET"
    });
    
    const data = await response.json();

    let html = "";
    if(data.erro) {
        resultado.innerHTML = `Erro: ${data.erro}`;
        return
    } else {
        if(data.length==0) {
            resultado.innerHTML = `Não existe nenhuma transação cadastrada.`;
            return;
        } else {
            for(let transacao of data) {
                html += `
                    <br>ID: ${transacao.id}<br>
                    Valor: ${transacao.valor}<br>
                    Tipo: ${transacao.tipo}<br>
                    Descrição: ${transacao.descricao}<br>
                `;
            }
        }
        resultado.innerHTML = html;
    }
        
}