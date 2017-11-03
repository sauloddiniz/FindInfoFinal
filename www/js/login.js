function validarLogin() {
    var email = $('#email').val();
    var senha = $('#senha').val();
    if (email == '' || senha == '') {
        myApp.alert("E-mail e Senha 'obrigatorios'", "Errou");
    } else if (!validateEmail(email)) {
        myApp.alert("este não e um email valido", "Errou");
    } else {
        verificarLogin(email, senha);
    }
}

function verificarLogin(email, senha) {
	myApp.showIndicator();
    var params = jQuery.param({
        email: email,
        senha: senha
    });
    
    $.ajax({
            type: 'post',
            url: URL + "/usuario/login",
            data: params,
            contentType: "application/x-www-form-urlencoded",
            success: function(data) {   	
            }
        })
        .done(function() {
            successLogin();
        })
        .fail(function(data) {
        	myApp.hideIndicator();
            if (data.email != email && data.senha != senha) {
                myApp.alert("Usuario ou senha invalidos");
            } else {
                myApp.alert("Falha na conexão");
            }
        });
}

function successLogin() {
	myApp.hideIndicator();
	mainView.router.load({pageName: 'autocomplete'});
}

function telaCadastro() {
	mainView.router.load({pageName: 'cadastro'});
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