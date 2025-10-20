
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

    localStorage.setItem('name', name);
    localStorage.setItem('cpf', cpf);
    localStorage.setItem('telefone', telefone);
    localStorage.setItem('dtNascimento', dtNascimento);
    localStorage.setItem('salario', salario);
    localStorage.setItem('creditoDisponivel', creditoDisponivel);

    limparFormulario();
    alert('Cadastro realizado com sucesso!');

});


function limparFormulario() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientCPF').value = '';
    document.getElementById('clientTelefone').value = '';
    document.getElementById('clientDtNascimento').value = '';
    document.getElementById('clientSalario').value = '';


}
function mostrarclientes() {
    const name = localStorage.getItem('name');
    const cpf = localStorage.getItem('cpf');
    const telefone = localStorage.getItem('telefone');
    const dtNascimento = localStorage.getItem('dtNascimento');
    const salario = localStorage.getItem('salario');
    const creditoDisponivel = localStorage.getItem('creditoDisponivel');
    alert(
        'Nome do cliente: ' + name + '\n' +
        'CPF: ' + cpf + '\n' +
        'Telefone: ' + telefone + '\n' +
        'Data de Nascimento: ' + dtNascimento + '\n' +
        'Salário: ' + salario + '\n' +

        'Crédito Disponível: R$ ' + creditoDisponivel
    );
}

function converterEmCentavos(salario) {
    const salarioEmCEntavos = salario.replace(/[^\d,]/g, '').replace(',', '.');
    return Math.round(parseFloat(salarioEmCEntavos) * 100);
}

function ConverterEmreal(creditdo) {

    const creditoconvertido = (creditdo / 100).toFixed(2).replace('.', ',');
    return creditoconvertido.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}