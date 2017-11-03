function listarProdutos(categoriaProd) {
	myApp.showIndicator();
	remove();
	var params = jQuery.param({
    	latUser: minhaLocalidade.getMyLatLon().myLat,
    	lonUser: minhaLocalidade.getMyLatLon().myLon
    });
	
	$.ajax({
    	type: 'post',
    	url: URL + "/categoria/" + categoriaProd,
    	data: params,
    	contentType: "application/x-www-form-urlencoded",
    	success: function(data){
    		listarCategoria(data);
    	}
    }).done(function() {
		myApp.hideIndicator();
	}).error(function() {
		myApp.alert("Error");
		myApp.hideIndicator();
		});
}

function listarCategoria(data){
	$(data).each(function(i) {
		$(this.produtosCat).each(function(i) {
			var produto = this;
			var copiaLi = $('#ulItem li#0').first().clone().attr('id','1').show();
			copiaLi.find('.item-title').text(this.nome);
			copiaLi.find('.item-after').text((this.lojaProxima.distancia).toFixed(2) + " Km");
			copiaLi.find('.item-subtitle').text(this.marca);
			copiaLi.find('.item-text').text(this.textoProduto);
			copiaLi.find('.item-media img').attr(
					'src',URL + "/avatar/"+ this.avatar.id);
			copiaLi.click(function() {
				removeLoja();
				$('#prod-titulo').text(produto.nome);
				$('#prod-sub').text(produto.marca);
				$('#prod-desc').text(produto.textoProduto);
				$('#prod-img').css('background-image',
						'url(' + URL + '/avatar/'+ produto.avatar.id + ')');
				photoBrow(produto.imagem);
				abrirMapa(produto.lojas, produto.lojaProxima);
				$(produto.lojas).each(function(i){
					var loja = this;
					var copiaLiLoja = $("#ulLoja li#0").first().clone().attr('id','1').show();
					copiaLiLoja.find('.item-title').text(this.nome);
					copiaLiLoja.find('.item-after').text((this.distancia).toFixed(2) + " Km");
					copiaLiLoja.click(function(){
						gpsLoja(loja);
					});
					$('#ulLoja').append(copiaLiLoja);
					
				});
				});
			$('#ulItem').append(copiaLi);
			})
			})
}

var minhaLocalidade = (function(){
	var latitude = 0;
	var longitude = 0;

	var setLatitudeAndlongitude = function(){
		var onSuccess = function(position) {
	    	latitude = position.coords.latitude;
	    	longitude = position.coords.longitude;
	    };

	    function onError(error) {
	        alert('onError');
	    };
	    navigator.geolocation.getCurrentPosition(onSuccess, onError);
	};
    
    var getMyCordenada = function(){
    	var cordenada = new google.maps.LatLng(latitude, longitude);
    	return cordenada;
    };
    
    var getMyLatLon = function(){
    	var myLat = latitude;
    	var myLon = longitude;
    	return {
    		myLat: myLat,
    		myLon: myLon
    	}
    };
    
    return {
    	setLatitudeAndlongitude: setLatitudeAndlongitude,
    	getMyCordenada: getMyCordenada,
    	getMyLatLon: getMyLatLon
    }
    
})();

function gpsLoja(loja){
	
	var pos = new google.maps.LatLng(loja.lat, loja.lon);

	myApp.confirm('Deseja Criar a rota ?','Rota via Google Maps', function(){
		launchnavigator.navigate(""+ pos +"", {
		    start: ""+minhaLocalidade.getMyCordenada()+""
		});
	});
}

function photoBrow(imgProdutos){
	var imgs = new Array;
	$(imgProdutos).each(function(){
		imgs.push(URL + '/img/' + this.id);
	});
	
	myPhotoBrowser = myApp.photoBrowser({
	    photos : imgs,
	    ofText: 'de',
	    type: 'page'
	});
	
	$('#prod-fotos').click(function () {
		myPhotoBrowser.open();
	});
		
}

function abrirMapa(lojas,lojaProxima) {

	$('#rastrear').on('click',function(){
		
		var map;
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();
		
		var latLongLojaProxima = new google.maps.LatLng(lojaProxima.lat, lojaProxima.lon);
				
		var mapOptions = {
				center : minhaLocalidade.getMyCordenada(),
				zoom : 5,
				mapTypeId : google.maps.MapTypeId.ROADMAP
				};
		
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
		directionsDisplay.setMap(map);
		
		$(lojas).each(function(i){

			if(i == 0){
				var myMarker = new google.maps.Marker({
					position : minhaLocalidade.getMyCordenada(),
					map : map,
					title : 'myLocations'
						});
				
				var myLatLon = '<div> my Location </div>';
				
				var infowindowMyLocation = new google.maps.InfoWindow({
				    content: myLatLon
				    });
			}
			
			var contentString = '<div>'+lojas[i].nome+'</div>';

			var infowindow = new google.maps.InfoWindow({
			    content: contentString
			    });
			
			var pos = new google.maps.LatLng(lojas[i].lat, lojas[i].lon); 
			var marker = new google.maps.Marker({
				position : pos,
				map : map,
				title : 'Locations'
					});
			
			marker.addListener('click', function() {
					launchnavigator.navigate(""+ pos +"", {
					    start: ""+minhaLocalidade.getMyCordenada()+""
					});
				
				});
			
			infowindow.open(map, marker);
			
		});
		
		var request = {
				  origin : minhaLocalidade.getMyCordenada(),
				  destination : latLongLojaProxima,
				  optimizeWaypoints : true,
				  travelMode : google.maps.TravelMode.DRIVING
				  };

		directionsService.route(request,function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) { // Se
				directionsDisplay.setDirections(result); // Renderizamos
				directionsDisplay.setOptions({suppressMarkers: true});
			}
			});
		
		mainView.router.load({pageName : 'map'});
	});
}
	/*$('#rastrear').click(function() {
	  var map;
	  var directionsDisplay = new google.maps.DirectionsRenderer();
	  var directionsService = new google.maps.DirectionsService();
	  
	  var onSuccess = function(position) {
	  var longitude = position.coords.longitude;
	  var latitude = position.coords.latitude;
	  var latLong = new google.maps.LatLng(latitude,longitude);
	  var mapOptions = {
			  center : latLong,
			  zoom : 13,
			  mapTypeId : google.maps.MapTypeId.ROADMAP
			  };
	  map = new google.maps.Map(document.getElementById("map"), mapOptions);
	  directionsDisplay.setMap(map);
	  
	  for (i = 0; i < lojas.length; i++) {
		  var points = new Array;
		  points[i] = new google.maps.LatLng(
				  lojas[i].lat, lojas[i].lon);
		  var marker = new google.maps.Marker({
			  position : points[i],
			  map : map,
			  title : 'Locations'});
		  }
	  function calcularPontoMaisProximo(listaLojas,
			  latitudeDoEnderecoDoUsuario,
			  longitudeDoEnderecoDoUsuario) {
		  function rad(x) {
			  return x * Math.PI / 180;
			  }
		  var lat = latitudeDoEnderecoDoUsuario;
		  var lng = longitudeDoEnderecoDoUsuario;
		  var R = 6371; // radius of earth in km
		  var distances = [];
		  var closest = -1;

		  for (i = 0; i < listaLojas.length; i++) {
			  var mlat = listaLojas[i].lat;
			  var mlng = listaLojas[i].lon;
			  var dLat = rad(mlat - lat);
			  var dLong = rad(mlng - lng);
			  var a = Math.sin(dLat / 2)* Math.sin(dLat / 2)+ Math.cos(rad(lat))* Math.cos(rad(lat))* Math.sin(dLong / 2)* Math.sin(dLong / 2);
			  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			  var d = R * c;
			  distances[i] = d;
			  if (closest == -1 || d < distances[closest]) {
				  closest = i;
				  }
			  }
		  if (closest != -1) {
			  var point = new google.maps.LatLng(
					  listaLojas[closest].lat,
					  listaLojas[closest].lon)
			  var request = {
				  origin : latLong,
				  destination : point,
				  optimizeWaypoints : true,
				  travelMode : google.maps.TravelMode.DRIVING
				  };
			  directionsService.route(
					  request,function(result, status) {
						  if (status == google.maps.DirectionsStatus.OK) { // Se
							  directionsDisplay.setDirections(result); // Renderizamos
							  }
						  });
			  }
		  }
	  calcularPontoMaisProximo(lojas, latitude, longitude)
	  };
	  function onError(error) {
		  alert("the code is " + error.code + ". \n"+ "message: " + error.message);
		  }
	  mainView.router.load({
		  pageName : 'map'
			  });
	  navigator.geolocation.getCurrentPosition(onSuccess,
			  onError);
	  });*/
