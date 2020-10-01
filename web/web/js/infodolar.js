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
			datos(resp); 			
	    }
	}	
	
	xhr.onerror = function () {	 
		console.log("** error no se pudo consultar la cotizacion **");
	};

	xhr.send();
}