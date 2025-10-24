document.addEventListener('DOMContentLoaded', function () {
    carregarCliente();
    inicializarSelect2Cidades();
});

function inicializarSelect2Cidades() {
    const cidades = [
        { id: 'SP', text: 'São Paulo' },
        { id: 'RJ', text: 'Rio de Janeiro' },
        { id: 'MG', text: 'Minas Gerais' },
        { id: 'ES', text: 'Espírito Santo' }
    ];
    $('#clientCidade').select2({
        theme: 'bootstrap-5',
        placeholder: 'Selecione a cidade',
        allowClear: true,
        data: cidades.map(cidade => ({ id: cidade.id, text: cidade.text }))

    });
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[.-]/g, ""); // Remove pontos e traços
    if (cpf.length !== 11 || /^(\\d)\\1{10}$/.test(cpf)) {
        return false;
    }
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }
    return true;
}

document.getElementById("clientCPF").addEventListener("blur", function () {
    const cpf = this.value;
    if (!validarCPF(cpf)) {
        alert("CPF inválido. Por favor, insira um CPF válido.");
    }
});

document.getElementById('formCadastro').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('clientName').value;
    const cpf = document.getElementById('clientCPF').value;
    const telefone = document.getElementById('clientTelefone').value;
    const dtNascimento = document.getElementById('clientDtNascimento').value;
    const cidade = $('#clientCidade').select2('data')[0]?.text || '';
    const salario = document.getElementById('clientSalario').value;

    const salarioconvertido = converterEmCentavos(salario);
    const credito = salarioconvertido * 0.3;
    const creditoDisponivel = ConverterEmreal(credito);

    const cliente = {
        name, cpf, telefone, dtNascimento, cidade, salario, creditoDisponivel
    };
    if (existCPFCadastrado(cpf) === true) {
        alert('CPF Cadastrado!');
    } else {
        salvarCliente(cliente);
        alert('Cadastro realizado com sucesso!');
        limparFormulario();
    }

});

function existCPFCadastrado(cpf) {
    const total = obitertotalClientes();

    for (let i = 0; i < total; i++) {
        const cpfCadastrado = localStorage.getItem(`cliente_${i}_cpf`);

        if (cpf === cpfCadastrado) {
            return true;
        }
    }
    return false;
}
function obitertotalClientes() {
    return parseInt(localStorage.getItem('totalClientes') || '0', 10);
}

function salvarCliente(cliente) {

    const index = obitertotalClientes();

    localStorage.setItem(`cliente_${index}_name`, cliente.name);
    localStorage.setItem(`cliente_${index}_cpf`, cliente.cpf);
    localStorage.setItem(`cliente_${index}_telefone`, cliente.telefone);
    localStorage.setItem(`cliente_${index}_dtNascimento`, cliente.dtNascimento);
    localStorage.setItem(`cliente_${index}_cidade`, cliente.cidade);
    localStorage.setItem(`cliente_${index}_salario`, cliente.salario);
    localStorage.setItem(`cliente_${index}_creditoDisponivel`, cliente.creditoDisponivel);

    localStorage.setItem('totalClientes', index + 1);

    carregarCliente();
    console.log('Cliente salvo com sucesso!');

}

function limparFormulario() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientCPF').value = '';
    document.getElementById('clientTelefone').value = '';
    document.getElementById('clientDtNascimento').value = '';
    document.getElementById('clientSalario').value = '';

}

function buscarClientes() {
    const total = obitertotalClientes();
    const clientes = [];
    for (let i = 0; i < total; i++) {
        const cliente = {
            name: localStorage.getItem(`cliente_${i}_name`),
            cpf: localStorage.getItem(`cliente_${i}_cpf`),
            telefone: localStorage.getItem(`cliente_${i}_telefone`),
            dtNascimento: localStorage.getItem(`cliente_${i}_dtNascimento`),
            salario: localStorage.getItem(`cliente_${i}_salario`),
            cidade: localStorage.getItem(`cliente_${i}_cidade`) || '',
            creditoEmReal: localStorage.getItem(`cliente_${i}_creditoDisponivel`),
        };

        clientes.push(cliente);
    }

    return clientes;

}

function carregarCliente() {
    const clientes = buscarClientes();
    console.log(clientes);
    const tbody = document.getElementById('listaClientes');

    tbody.innerHTML = '';
    clientes.forEach(cli => {
        const tr = document.createElement('tr');
        const date = formatdData(cli.dtNascimento);
        tr.innerHTML = `
            <td>${cli.name}</td>
            <td>${cli.cpf}</td>
            <td>${cli.telefone}</td>
            <td>${date}</td>
            <td>${cli.salario}</td>
             <td>${cli.cidade}</td>
            <td>${cli.creditoEmReal}</td>
            `;

        tbody.appendChild(tr);
    });
}
function formatdData(dataStr) {
    if (!isNaN(dataStr)) return '';

    const parts = dataStr.split('-');
    if (parts.length === 3) {
        const [y, m, d] = parts;
        return `${d}/${m}/${y}`;
    }



}


function converterEmCentavos(salario) {
    const salarioEmCEntavos = salario.replace(/[^\d,]/g, '').replace(',', '.');
    return Math.round(parseFloat(salarioEmCEntavos) * 100);
}

function ConverterEmreal(creditdo) {
    const creditoconvertido = (creditdo / 100).toFixed(2).replace('.', ',');
    return creditoconvertido.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}