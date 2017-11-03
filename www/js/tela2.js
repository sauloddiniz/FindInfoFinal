
// itens data demo array
var itens = ('Placa de video,Placa mae,Mouse,Teclado,Fonte,Processador,'
		+ 'Headset,HD,Memoria ram,Pen driver, Cartão SD').split(',');
/* ===== Autocomplete ===== */

myApp.onPageInit('autocomplete', function(page) {
	var autocomplete1 = myApp.autocomplete({
        input: '#autocomplete-dropdown',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'id', //object's "value" property name
        textProperty: 'nome', //object's "text" property name
        limit: 20, //limit to 20 results
        //dropdownPlaceholderText: 'Tente "Placa"',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Show Preloader
            autocomplete.showPreloader();
            // request to Autocomplete data
            $.get({
                url: URL + '/categoria',
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },
                success: function (data) {
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nome.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        }
    });

});

function buscarProduto() {

	var categoriaProd = $('#autocomplete-dropdown').val();
	var count = 0;
	for (var i = 0; i < itens.length; i++) {
		if (categoriaProd != '' && categoriaProd == itens[i]) {
			count++;
			listarProdutos(categoriaProd);
			display = categoriaProd;
			filtrarProduto.setCat(categoriaProd);
			mainView.router.load({
				pageName : 'list'
			});
			$('#getNomeItem').text(categoriaProd);
		}
	}

	if (count == 0) {
		myApp.alert("Produto não encontrado");
	}
};



var filtrarProduto = (function(){
	var cat = "";
	var URI = "";
	var desc = "";	
	
	var setCat = function(catU){
		cat = catU;
	};
	
	var setURI = function(uriU){
		URI = uriU;
	};
	
	var setDesc = function(descU){
		desc = descU;
	};
	
	var getFiltrarProduto = function(){
		var catU = cat;
		var uriU = URI;
		var descU = desc;
		return {
			catU: catU,
			uriU: uriU,
			descU: descU
		}
	};
	
	var pesFiltrarProduto = function(){
		myApp.showIndicator();
		remove();
		var params = jQuery.param({
			latUser: minhaLocalidade.getMyLatLon().myLat,
	    	lonUser: minhaLocalidade.getMyLatLon().myLon
		});
		
		$.ajax({
	    	type: 'post',
	    	url: URL + "/produto/"+cat+"/"+URI+"/"+desc+"",
	    	data: params,
	    	contentType: "application/x-www-form-urlencoded",
	    	success: function(data){
	    		showData(data);
	    	}
	    }).done(function() {
			myApp.hideIndicator();
		}).error(function() {
			myApp.alert("Error");
			myApp.hideIndicator();
			});
	}
	
	return{
		setCat:setCat,
		setURI:setURI,
		setDesc:setDesc,
		getFiltrarProduto: getFiltrarProduto,
		pesFiltrarProduto: pesFiltrarProduto
	}
})();

function queryPlacaMae(){
	$('input[name=marcaMae-radio]').change(function(){
		URI = "marca";
		desc = $('input[name=marcaMae-radio]:checked').val();
		filtrarProduto.setURI(URI);
		filtrarProduto.setDesc(desc);
		filtrarProduto.pesFiltrarProduto();
	});
	
	$('input[name=soqueteMae-radio]').change(function(){
		URI = "soquete";
		desc = $('input[name=soqueteMae-radio]:checked').val();
		filtrarProduto.setURI(URI);
		filtrarProduto.setDesc(desc);
		filtrarProduto.pesFiltrarProduto();
	});
	
	$('input[name=tMemoriaMae-radio]').change(function(){
		URI = "tipoMemoria";
		desc = $('input[name=tMemoriaMae-radio]:checked').val();
		filtrarProduto.setURI(URI);
		filtrarProduto.setDesc(desc);
		filtrarProduto.pesFiltrarProduto();
	});
	
	$('input[name=cProcessadoresMae-radio]').change(function(){
		URI = "processadores";
		desc = $('input[name=cProcessadoresMae-radio]:checked').val();
		filtrarProduto.setURI(URI);
		filtrarProduto.setDesc(desc);
		filtrarProduto.pesFiltrarProduto();
	});
}

function queryVideo(){
	cat = "placa de video";
	
	$('input[name=marcaVideo-radio]').change(function(){
		URI = "marca";
		desc = $('input[name=marcaVideo-radio]:checked').val();
		filtrarProduto.setURI(URI);
		filtrarProduto.setDesc(desc);
		filtrarProduto.pesFiltrarProduto();
	});
	
	$('input[name=memoriaVideo-radio]').change(function(){
		URI = "memoria";
		desc = $('input[name=memoriaVideo-radio]:checked').val();
		filtrarProduto.setURI(URI);
		filtrarProduto.setDesc(desc);
		filtrarProduto.pesFiltrarProduto();
	});	
	
	$('input[name=tMemoriaVideo-radio]').change(function(){
		URI = "tipoMemoria";
		desc = $('input[name=tMemoriaVideo-radio]:checked').val();
		filtrarProduto.setURI(URI);
		filtrarProduto.setDesc(desc);
		filtrarProduto.pesFiltrarProduto();
	});
	
	$('input[name=bitsVideo-radio]').change(function(){
		URI = "memoria";
		desc = $('input[name=bitsVideo-radio]:checked').val();
		filtrarProduto.setURI(URI);
		filtrarProduto.setDesc(desc);
		filtrarProduto.pesFiltrarProduto();
	});	
}

function showData(data){
	$(data).each(function(i){
		var produto = this;
		var copiaLi = $('#ulItem li#0').first().clone().attr('id','1').show();
			copiaLi.find('.item-title').text(this.nome);
			copiaLi.find('.item-after').text((this.lojaProxima.distancia).toFixed(2) + " Km");
			copiaLi.find('.item-subtitle').text(this.marca);
			copiaLi.find('.item-text').text(this.textoProduto);
			copiaLi.find('.item-media img').attr('src', URL + "/avatar/" + this.avatar.id);		
			copiaLi.click(function(){
				$("#prod-titulo").text(produto.nome);
				$("#prod-sub").text(produto.marca)
				$("#prod-desc").text(produto.textoProduto);
				$("#prod-img").css('background-image','url(' + URL + '/avatar/' + produto.avatar.id + ')');
				photoBrow(produto.imagem);
				abrirMapa(produto.lojas);
			});
			$('#ulItem').append(copiaLi);
			})
}