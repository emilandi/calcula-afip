/*
URL's src

#1 exchangerate.com
https://api.exchangerate-api.com/v4/latest/USD
https://api.exchangerate-api.com/v4/latest/EUR

#2 dolarsi.com
https://www.dolarsi.com/api/api.php?type=dolar
https://www.dolarsi.com/api/api.php?type=euro

*/

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
			url = 'https://www.dolarsi.com/api/api.php?type=dolar'		
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
		document.getElementById('get-usd').value=rate;
		document.getElementById('get-precio').placeholder='';
		
		
		// $('#loading').fadeOut();
		document.getElementById('loading').style.display='none';
		return rate;			
		
	}
}

function consulta () {

	rate = fnGetValues('rate');
	url = getUrl (rate);
	sitio = fnGetValues('sitio');	

	if(sitio==null){		
		fnSetValues('sitio',1);	
	}	
	
	getResp(url);			

	console.log('Consultando URL:' + url + ' rate: ' + rate + ' sitio: ' + sitio);	

}

function fnGetValues (value) {
	var obj = localStorage.getItem(value);
	return obj;
}

function fnSetValues (field,value) {
	localStorage.setItem(field,value);
}

