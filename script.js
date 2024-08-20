document.addEventListener('DOMContentLoaded', function() {
    atualizarListaClientes();
    atualizarCampoCliente();
    atualizarListaAgendamentos();
});

// Função para atualizar a lista de clientes
function atualizarListaClientes() {
    const listaClientes = document.getElementById('lista-clientes');
    listaClientes.innerHTML = ''; // Limpa a lista antes de atualizar

    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
    clientes.forEach((cliente, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            ${cliente.nome} - ${cliente.email}
            <button class="btn btn-danger btn-sm float-right ml-2" data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        listaClientes.appendChild(li);
    });
}

// Função para atualizar o campo de cliente no formulário de agendamento
function atualizarCampoCliente() {
    const clienteSelect = document.getElementById('cliente');
    clienteSelect.innerHTML = ''; 

    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nome;
        option.textContent = cliente.nome;
        clienteSelect.appendChild(option);
    });
}

// Função para adicionar um cliente
document.getElementById('form-cliente').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome-cliente').value;
    const email = document.getElementById('email-cliente').value;

    // Salvar no localStorage
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes.push({ nome, email });
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Atualizar listas
    atualizarListaClientes();
    atualizarCampoCliente();

    // Limpar o formulário
    document.getElementById('form-cliente').reset();
});

// Função para adicionar um agendamento
document.getElementById('form-agendamento').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const cliente = document.getElementById('cliente').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const valor = parseFloat(document.getElementById('valor').value);

    // Salvar no localStorage
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    agendamentos.push({ cliente, data, hora, valor, concluido: false });
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    // Atualizar lista de agendamentos
    atualizarListaAgendamentos();

    // Limpar o formulário
    document.getElementById('form-agendamento').reset();
});

// Função para atualizar a lista de agendamentos
function atualizarListaAgendamentos() {
    const listaAgendamentos = document.getElementById('lista-agendamentos');
    listaAgendamentos.innerHTML = ''; // Limpa a lista antes de atualizar

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    
    agendamentos.forEach((agendamento, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        if (agendamento.concluido) {
            li.classList.add('bg-light'); // Ou outra classe para destacar concluído
            li.innerHTML = `
                <span class="texto">${agendamento.cliente} - ${agendamento.data} ${agendamento.hora}</span>
                <span class="valor">R$ ${agendamento.valor.toFixed(2)}</span>
                <span class="badge badge-success">Concluído</span>
                <button class="btn btn-danger btn-sm float-right ml-2" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
        } else {
            li.innerHTML = `
                <span class="texto">${agendamento.cliente} - ${agendamento.data} ${agendamento.hora}</span>
                <span class="valor">R$ ${agendamento.valor.toFixed(2)}</span>
                <button class="concluido btn btn-success btn-sm float-right" data-index="${index}">Concluído</button>
                <button class="btn btn-danger btn-sm float-right ml-2" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
        }
        listaAgendamentos.appendChild(li);
    });

    // Atualizar o total de lucro
    atualizarTotalLucro();
}

// Função para atualizar o total de lucro
function atualizarTotalLucro() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const totalLucro = agendamentos.reduce((acc, agendamento) => acc + agendamento.valor, 0);
    document.getElementById('total-valor').textContent = totalLucro.toFixed(2);
}

// Função para marcar um agendamento como concluído
document.getElementById('lista-agendamentos').addEventListener('click', function(event) {
    if (event.target.classList.contains('concluido') || event.target.closest('.concluido')) {
        const index = event.target.closest('button').dataset.index;

        // Verifica se o índice é válido
        if (index !== undefined) {
            // Marcar agendamento como concluído
            const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
            if (agendamentos[index]) {
                agendamentos[index].concluido = true;
                localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

                // Atualizar lista de agendamentos
                atualizarListaAgendamentos();
            }
        } else {
            console.error('Índice do agendamento não encontrado.');
        }
    }
});

// Função para excluir um cliente
document.getElementById('lista-clientes').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-danger') || event.target.closest('.btn-danger')) {
        const index = event.target.closest('button').dataset.index;

        // Verifica se o índice é válido
        if (index !== undefined) {
            // Remover cliente
            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            clientes.splice(index, 1);
            localStorage.setItem('clientes', JSON.stringify(clientes));

            // Atualizar lista de clientes e o campo de clientes no formulário de agendamento
            atualizarListaClientes();
            atualizarCampoCliente();
        } else {
            console.error('Índice do cliente não encontrado.');
        }
    }
});

// Função para excluir um agendamento
document.getElementById('lista-agendamentos').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-danger') || event.target.closest('.btn-danger')) {
        const index = event.target.closest('button').dataset.index;

        // Verifica se o índice é válido
        if (index !== undefined) {
            // Remover agendamento
            const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
            agendamentos.splice(index, 1);
            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

            // Atualizar lista de agendamentos
            atualizarListaAgendamentos();
        } else {
            console.error('Índice do agendamento não encontrado.');
        }
    }
});
