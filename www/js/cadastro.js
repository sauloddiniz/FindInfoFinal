function getText() {
    var nome = $('#nome').val();
    var email = $('#emailCadastro').val();
    var senha = $('#senhaCadastro').val();
    var sexo = $('#sexo').val();
    var data_nasc = $('#dataNascimento').val();

    verificarCadastro(email, senha, nome, sexo, data_nasc);
}

function verificarCadastro(email, senha, nome, sexo, data_nasc) {
    if (email == '' || senha == '') {
        myApp.alert("Email e Senha obrigatorios", "Atenção");
    } else
    if (!validateEmail(email)) {
        myApp.alert("e-mail invalido", "Error");
    } else {
        saveOnLocalStorage(email, senha, nome, sexo, data_nasc);
    }
}

function saveOnLocalStorage(email, senha, nome, sexo, data_nasc) {

    var usuario = {
        email: email,
        senha: senha,
        nome: nome,
        sexo: sexo,
        data_nasc: data_nasc
    };
    //localStorage.setItem('user', JSON.stringify(usuario));
    //auxMsgTarefa('Cadastro efetuado com sucesso', 5000);
    //alert(usuario.email);

    $.ajax({
            type: 'post',
            url: URL + "/usuario",
            data: JSON.stringify(usuario),
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                auxMsgTarefa('Cadastro efetuado com sucesso', 5000);
            }
        }).done(function() {
            telaIndex();
        })
        .fail(function() {
            alert("error");
        });
}

function telaIndex() {
	mainView.router.load({pageName: 'index'});
}

function auxMsgTarefa(mensagem, tempo) {
    myApp.addNotification({
        message: mensagem,
        hold: tempo,
        button: {
            text: 'Fechar',
            color: 'cyan'
        }
    });
}