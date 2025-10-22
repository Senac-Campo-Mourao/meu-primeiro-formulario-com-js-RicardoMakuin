
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
    const salario = document.getElementById('clientSalario').value;

    const salarioconvertido = converterEmCentavos(salario);
    const credito = salarioconvertido * 0.3;
    const creditoDisponivel = ConverterEmreal(credito);

    const cliente = {
        name, cpf, telefone, dtNascimento, salario, creditoDisponivel
    };

    limparFormulario();
    alert('Cadastro realizado com sucesso!');

});
function obitertotalClientes() {
    return parseInt(localStorage.getItem('totalClientes') || '0', 10);
}

function salvarCliente(cliente) {

    const index = obitertotalClientes();


    localStorage.setItem(`cliente_${index}_name`, cliente.name);
    localStorage.setItem(`cliente_${index}_cpf`, cliente.cpf);
    localStorage.setItem(`cliente_${index}_telefone`, cliente.telefone);
    localStorage.setItem(`cliente_${index}_dtNascimento`, cliente.dtNascimento);
    localStorage.setItem(`cliente_${index}_salario`, cliente.salario);
    localStorage.setItem(`cliente_${index}_creditoDisponivel`, cliente.creditoDisponivel);

    localStorage.setItem('totalClientes', index + 1);

    carregarCliente();

}

function limparFormulario() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientCPF').value = '';
    document.getElementById('clientTelefone').value = '';
    document.getElementById('clientDtNascimento').value = '';
    document.getElementById('clientSalario').value = '';
}

function buscrClientes() {
    const total = obitertotalClientes();
    const clientes = [];
    for (let i = 0; i < total; i++) []
    const cliente = {


        name: localStorage.getItem(`cliente_${i}_name`),
        cpf: localStorage.getItem(`cliente_${i}_cpf`),
        telefone: localStorage.getItem(`cliente_${i}_telefone`),
        dtNascimento: localStorage.getItem(`cliente_${i}_dtNascimento`),
        salario: localStorage.getItem(`cliente_${i}_salario`),
        creditoEmReal: localStorage.getItem(`cliente_${i}_creditoDisponivel`),

    };
    clientes.push(cliente);

    return clientes;

}

function carregarCliente() {
    const clientes = buscrClientes();
    const tbody = document.getElementById('listaClientes');

    tbody.innerHTML = '';
    clientes.fortEach(cli => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
    <td>${cli.name}</td>
    <td>${cli.cpf}</td>
    <td>${cli.telefone}</td>
    <td>${cli.dtNascimento}</td>
    <td>${cli.salario}</td>
    <td>${cli.creditoEmReal}</td>
    `;
        tbody.appendChild(tr);
    })
}

function converterEmCentavos(salario) {
    const salarioEmCEntavos = salario.replace(/[^\d,]/g, '').replace(',', '.');
    return Math.round(parseFloat(salarioEmCEntavos) * 100);
}

function ConverterEmreal(creditdo) {

    const creditoconvertido = (creditdo / 100).toFixed(2).replace('.', ',');
    return creditoconvertido.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}