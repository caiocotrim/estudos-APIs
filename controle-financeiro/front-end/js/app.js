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

async function inputs_alterar_transacao(id) {
    const response = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "GET"
    });

    const data = await response.json();

    const inputs_alterar = document.getElementById("inputs_alterar");

    inputs_alterar.innerHTML = `
        <input id="id" value="${data.id}" readonly><br><br>
        <input id="valor" value="${data.valor}" placeholder="Valor"><br><br>
        <input id="tipo" value="${data.tipo}" placeholder="Tipo"><br><br>
        <input id="descricao" value="${data.descricao}" placeholder="Descricao"><br><br>

        <button onclick="location.reload()">Cancelar</button>
        <button onclick="alterar_transacao(${data.id})">Confirmar</button>
    `;
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
    
    const tipo_normalizado = tipo.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

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
        resultado.innerHTML= `<br>Transação ID ${id} excluída.`;
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

            <button onclick="location.reload()">Cancelar</button>
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

async function visualizar_alterar_transacao() {
    const id = document.getElementById("id").value;
    const resultado = document.getElementById("resultado");

    const response = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "GET"
    });

    const data = await response.json();

    if(data.erro){
        resultado.innerHTML = `<br>Erro: ${data.erro}`;
        return
    } else {
        resultado.innerHTML = `
        <br>ID: ${data.id}<br>
        Valor: ${data.valor}<br>
        Tipo: ${data.tipo}<br>
        Descricao: ${data.descricao}<br>
        <br>

        <button onclick="location.reload()">Cancelar</button>
        <button onclick="inputs_alterar_transacao(${data.id})">Alterar Transação</button>
    `;
    }    
}

async function alterar_transacao(id) {
    const info_alterar_transacao = document.getElementById("info_alterar_transacao"); 
    const inputs_alterar = document.getElementById("inputs_alterar");
    const resultado = document.getElementById("resultado");

    const valor = document.getElementById("valor").value;
    const tipo = document.getElementById("tipo").value;
    const descricao = document.getElementById("descricao").value;

    const tipo_normalizado = tipo.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    const response = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({
            id: Number(id),
            valor: parseFloat(valor),
            tipo: tipo_normalizado,
            descricao: descricao
        }) 
    });

    const data = await response.json();

    if(data.erro){
        info_alterar_transacao.innerHTML = `Erro: ${data.erro}`;
        return
    } else {
        info_alterar_transacao.innerHTML = `Transação ID ${id} alterada com sucesso.`;
        inputs_alterar.innerHTML = ``;
        resultado.innerHTML = ``;
    }

    carregar_saldo();
}