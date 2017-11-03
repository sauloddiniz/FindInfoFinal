
$('#imgHard div').on('click',function(){
	var categoriaProd = $(this).attr('id');
	display = categoriaProd;
	listarProdutos(categoriaProd);
	$('#getNomeItem').text(categoriaProd);
	filtrarProduto.setCat(categoriaProd);
	mainView.router.load({
		pageName : 'list'
	});
});


function remove(){
	$('#ulItem li#1').remove();
}

function removeLoja(){
	$('#ulLoja li#1').remove();
}

var display = null;
function openDisplay() {
	$('#acordPlMae').hide();
	$('#acordPlVideo').hide();

	if (display == 'Placa mae') {
		$('#acordPlMae').show();
		queryPlacaMae();
	}

	if (display == 'Placa de video') {
		$('#acordPlVideo').show();
		queryVideo();
	}
}