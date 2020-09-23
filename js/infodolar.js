/*
URL's src

#1 exchangerate.com
https://api.exchangerate-api.com/v4/latest/USD
https://api.exchangerate-api.com/v4/latest/EUR

#2 dolarsi.com
https://www.dolarsi.com/api/api.php?type=dolar
https://www.dolarsi.com/api/api.php?type=euro
https://www.dolarsi.com/api/api.php?type=valoresprincipales
*/

//http://contenidos.lanacion.com.ar/json/dolar
//https://api.bluelytics.com.ar/json/last_price
//http://ws.geeklab.com.ar/dolar/get-dolar-json.php

var url;
var tipo;
var json;
var data;

//retorna url de consulta en base al id sitio
function getUrl (tipo) {	
	
	sitio = fnGetValues('sitio');
	
	if (tipo=='USD') {	
		if (sitio==1) {
			url = 'https://api.exchangerate-api.com/v4/latest/USD';			
		}		
		if (sitio==2) {
			url = 'https://www.dolarsi.com/api/api.php?type=dolar';
		}		
	}else{		
		if (sitio==1) {
			url = 'https://api.exchangerate-api.com/v4/latest/EUR';
		}		
		if (sitio==2) {
			url='https://www.dolarsi.com/api/api.php?type=euro';			
		}
	}
	
	return url;	
}


function getResp (url) {						
	
	var xhr = new XMLHttpRequest();		
	xhr.open("GET", url,true);
	
	console.log('Consultando URL:' + url);
	
	xhr.onreadystatechange = function() {
	    if(xhr.readyState == XMLHttpRequest.DONE) {	     	
	     	var obj = xhr;			
			var resp=obj.response;    		    		    		
			var data = datos(resp); 
			mostrar(data);
	    }
	}	
	
	xhr.onerror = function () {	 
		console.log("** error no se pudo consultar la cotizacion **");
	};

	xhr.send();
}

function datos (resp) {	
	console.log(resp);	
	
	if (sitio==1) {
		var obj = JSON.parse(resp);			
		rate = obj.rates.ARS;
	};

	if (sitio==2) {
		var obj = JSON.parse(resp);
		rate=obj[0].casa.venta;		
	};
	
	if(rate=='' || rate == null) {	
		console.log('No se pudo obtener rate value');	
	}else{
		
		rate = parseFloat(rate.toString().replace(/,/, '.')).toFixed(2);
		
		if (isNaN(rate)) {			
			fnSetValues('price',null);		
		}else{	
			fnSetValues('price',rate);
		};	
		console.log('Rate: ' + rate + ' - ' + Date() );		
		return rate;				
	}
}

function consulta () {
	sitio = fnGetValues('sitio');
	rate = fnGetValues('rate');
	url = getUrl (rate);		
	getResp(url);	
	console.log('Consultando URL:' + url + ' rate: ' + rate + ' sitio: ' + sitio);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("infodolar.js recibio una solicitud " ,request);		
	var action = request.action;
	if(action=='cotiza'){						
		rate = fnGetValues('rate');						
		url = getUrl(rate);
		console.log('Consultando :' + url + ' Rate: ' + rate);			

		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onreadystatechange = function (e) {				
			if (xhr.readyState == 4) {
				if(xhr.status == 200){
					var resp = xhr.responseText;
					var data = datos(resp);	
					sendResponse(data);
				}else{
					console.log("Error loading page\n");
				}
			}
		};
		xhr.send(null); 			
		return true;
	}
    }
);

function fnGetValues (value) {
	var obj = localStorage.getItem(value);
	return obj;
}

function fnSetValues (field,value) {
	localStorage.setItem(field,value);
}

function mostrar (data) {

	var resultado=data;	
	if(undefined != resultado) {		
		var solid =  parseFloat(resultado * 1.3).toFixed(2);
		var tipo = fnGetValues('rate');		
		if (tipo=='USD') {
			var txt = 'AR$ = 1 U$D';
			var mensaje='\nDolar Oficial:    ' + resultado + '\nDolar Solidario: '  + solid;
			var color = 'olive' 				
		}else{
			var txt = 'AR$ = 1 EUR';    		    	
	    	var mensaje='Cotizacion actual Euro: ';
	    	var color = '#65469b'  //violeta 	    	
		};				
		
		var msj=mensaje;		
		var fixusd = parseFloat(resultado).toFixed(2);	
		if (fixusd!=undefined) {
			chrome.browserAction.setBadgeText({text: fixusd}); // We have 10+ unread items.	
			chrome.browserAction.setBadgeBackgroundColor({color:color});		
	    	//chrome.browserAction.setTitle({title : msj + fixusd});
	    	chrome.browserAction.setTitle({title : msj });
		};		
	
		//chrome.runtime.sendMessage({data: rate}); // cuando tenga datos que envie al front
	
	}

}