// realizar calcula y mostrar en pantalla 

function fetchExchangeRate(from,to) {
    chrome.browserAction.setBadgeText({text: '..?'}); // We have 10+ unread items.	

    $.ajax({
		
		//url: 'http://rate-exchange.herokuapp.com/fetchRate',		
		///url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22USDARS%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=',
		
		url: 'http://finance.yahoo.com/d/quotes.csv?e=.csv&f=c4l1&s=USDARS=X',
		
		cache: true,
		async: true,	
		
		beforeSend: function() {
			//$('#final_amount').text('Loading...');
		},
		success: function(responseObj) {
			console.log(responseObj);			
			var resultado = responseObj.substr(6,10);
			console.log(resultado);

			if(undefined != resultado) {									
			var usd=resultado;	
			//efecto loading
				$("#loading").fadeOut(600, function () {
					$("#get-usd").hide().fadeIn(200).val(usd);										
				});			
				
				texto(usd);
							
			}			
			
			//else {
			//    $('#final_amount').text('Try again...');
			//}
		},
		error: function() {
			alert('Sorry! Server Busy...');
		}
	});

}

function texto (usd) {    	
	var fixusd = parseFloat(usd).toFixed(2);	
	if (fixusd!=undefined) {
		chrome.browserAction.setBadgeText({text: fixusd}); // We have 10+ unread items.	
		chrome.browserAction.setBadgeBackgroundColor({ color: [0, 190, 70, 200] });		
	    chrome.browserAction.setTitle({title :"Cotizacion actual del dolar: " + fixusd});

	};	
}

$(document).ready(function () {
	init();
 });

function init () {
	var src = 'USD';
    var target = 'ARS';        
    var sourceAmount = 1;
    fetchExchangeRate(src, target);   
    $("#get-precio").focus();       	
}

function calcula() {

	var fixtotal = 0;

	var usd = document.getElementById("get-usd").value;
	var precio=document.getElementById("get-precio").value;				
	
	var preciousd=(usd * precio);	
	var aduana=preciousd * 0.50;	
    
	//verificar estado del check para calcular true=aduana
		
	if (document.getElementById("optaduana").checked)
		{
				
		    localStorage.setItem('optaduana', "true");	    	
	        var fixaduana = aduana.toFixed(2);	        
	        var total = preciousd *  1.5;

	        if (aduana==0) {fixaduana=0;}

	        document.getElementById("aduana").value=(fixaduana);
	        				
		}
	else
		{        
        	var total = preciousd;
        	document.getElementById("aduana").value=0;
    		localStorage.setItem('optaduana', "false");
    	}

	//formatear valores para mostrar en pantalla
	var fixusd = preciousd.toFixed(2);	
    var fixtotal = total.toFixed(2);

    //mostrar datos 
	document.getElementById("total").value=parseFloat(fixusd);	
	document.getElementById("preciototal").value=parseFloat(fixtotal);
	
	console.clear();	
	console.log('total usd: ' + fixusd);
	console.log('aduana: ' + fixaduana);	
	console.log('total general: ' + fixtotal);

}

//realizar function al presionar una tecla
document.addEventListener('keyup', function () { 
	calcula();
 });

document.addEventListener('DOMContentLoaded', function() {
	
	//iniciar siempre form popup
	localStorage.setItem('attach',"false");

	//verifica estado del localstorage para checkbox
	getStatus = localStorage.getItem('optaduana');
    if (getStatus == "true") {
        document.getElementById("optaduana").checked=true;
    } 

	//evento click del checkbox 
	document.getElementById('optaduana').addEventListener('click', function() {
		calcula();
	});

	//edit valor del dolar
	document.getElementById('edit').addEventListener('click', function() {				
		document.getElementById("get-usd").disabled=false;
		document.getElementById("get-usd").focus();
		document.getElementById("get-usd").select();
	});
	
	//crear ventana de tipo panel 
	document.getElementById("btndock").addEventListener('click', function () { 					
		chrome.windows.create({url: '../attach.html', width: 380, height:420, type: 'panel'});					
		localStorage.setItem('attach', "true");					
		self.close();
	});
	
	//desahabiliar edit getdolar una vez que pierde el foco
	document.getElementById("get-usd").addEventListener('blur', function () { 		
		document.getElementById("get-usd").disabled=true;		
	});

	getattach = localStorage.getItem('attach');
    if (getattach == "true") {
    	document.getElementById("btndock").style.visibility='hidden';
    }; 
 
});



// para probar con id window

//consulta id window
//chrome.windows.getCurrent(function(win)
//{
//	console.log(win.id);
//	var idwin=win.id;	
//});


/*
chrome.windows.getCurrent(function(win)
{
   chrome.tabs.getAllInWindow(win.id, function(tabs)
  {
        // Should output an array of tab objects to your dev console.
        alert(win.id);
    });
});
*/


// chrome.windows.create(function(winnew)
// {
//     chrome.tabs.getAllInWindow(winnew.id, function(tabs)
//     {
//         // Should output an array of tab objects to your dev console.
//         alert(winnew.id);
// 		chrome.windows.update(winnew.id, { width: 10 });

//     });

//});

//recibe texto seleccionado desde menu conetextual
// chrome.extension.onRequest.addListener(
//     function(request, sender, sendResponse) {
//         // text selection is stored in request.selection       
//         select=request.selection;
//         chrome.windows.create({url: '../calcula.html', width: 390, height:420, type: 'panel'});
        
//     	if(document.isReady){
//     		document.getElementById("get-precio").value=request.selection;
//   		}
//     });

