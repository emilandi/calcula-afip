var rate;
var sel;
var url;
var price;
var aduana;
var sitio = 1;

document.addEventListener('DOMContentLoaded', init)

function init () {
	
	console.log( "ready!" );	
	
	//init values
	fnSetValues('price','');	
	
	//set sitio
	fnSetSitio(sitio); 
	
	// get rate USD / EUR
	rate = fnGetValues('rate');	
	if (rate==null || rate=='') {
		rate='USD';
		fnSetValues('rate',rate);
	};
	
	//sitio=fnGetValues('sitio');
	if(sitio==null){
		fnSetValues('sitio',1);
	}

	aduana=fnGetValues('optaduana');
	if(aduana==null){
		aduana=false;
		fnSetValues('optaduana',aduana);
	}
	
	var url = getUrl (rate);	
	
	consulta();	
	
	console.log('Rate: ' + rate + ' Sitio: ' +  sitio + ' Aduana: ' + aduana);	
}

function reload() {
	chrome.runtime.reload();
}

//Setter - Getters
function fnSetSitio (id) {
	localStorage.setItem('sitio',id);
}

function fnGetValues (value) {
	var obj = localStorage.getItem(value);
	return obj;
}

function fnSetValues (field,value) {
	localStorage.setItem(field,value);
}

//menu contextual
function getword(info,tab) {	
	sel=info.selectionText;	
	var importe=info.selectionText;			
	var data = fnNumero(importe);	
	if (data==0 || data==null || data == undefined) {
		console.log('Seleccione un importe valido');
	}else{
		createPanel(data);
	};
			
}

function createPanel (data) {
	
	console.log('data: ' + data);	
	localStorage.setItem('context',data);	
	
	var url = '../calcula.html';		
	var options ={
	    'url': url, 
	    'width':360, 
	    'height':450,
	    'type': 'popup'
	};	

	chrome.windows.create(options, function(win) {
		console.log("ventana creada " ,win);		
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){   		
			console.log(request);
			var action=request.action;
			if(action=='context'){
				var data=fnNumero(sel); 				
				sendResponse(data);
				// chrome.tabs.getSelected(null, function(tabs) {
				// 	chrome.tabs.sendRequest(tabs.id, { action: data });
				// });			
				sel=null;		
			}			
		});
		
	});
}

chrome.contextMenus.create({
  title: "Calculadora de compras: %s", 
  contexts:["selection"], 
  onclick: getword
});


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){   		
	
// 	var data=fnNumero(sel);    
// 	if(request.action){
// 		sendResponse(data);
//         chrome.tabs.getSelected(null, function(tabs) {
//             chrome.tabs.sendRequest(tabs.id, { action: data });
//         });
// 	}
// 	sel=null;
// });

function fnNumero (price) {

	//console.clear();
	if (price==null || price=='') {
		console.log('sin dato');
	}else{
		console.log(price);	
		var cadena = /([$|£|€|U|S|D|A|R|E])/g;

		var num = price.replace(',','.');
		console.log(num);
		
		var fix = num.replace(cadena,'');
		console.log(fix);

		var priceNum = parseFloat(fix);	
		console.log(priceNum);
		
	 	if (isNaN(priceNum)) {
	    	return 0;
	  	}else{
			return priceNum;  		
	  	}
	}
	
}


/*	ACTUALIZAR DATOS CADA 30+ MINUTOS */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { 

	getRate = localStorage.getItem('rate');   //rate ID
	getUhora = localStorage.getItem('uhora'); //ultima consulta

	if (getUhora==null || getUhora=='null') {				
		var date=new Date();
		localStorage.setItem('uhora',date.getTime());
		console.log('nueva hora: ' + date);
	};

    var dif=hora();
    //console.log('diferencia: ' + parseFloat(dif).toFixed(1) + ' minutos');        	
	var cantidad = parseInt(localStorage.getItem('cantidad'));    
    
    //consulta en segundo plano cada 30 minutos
    if (dif > 29) { 
    	localStorage.setItem('uhora',null);
    	var cantidad = parseInt(localStorage.getItem('con'));
		parseInt(localStorage.setItem('con',cantidad + 1 ));		       	
    };
    
}); 

function hora () {			
	var now = new Date();
	var date1 = now.getTime(); //hora acrual
	var date2 = new Date(parseFloat(localStorage.getItem('uhora'))); //ultima hora de consulta	
	var hours = Math.abs(date1 - date2) / 6e4; //36e5 = notacion cientifica de 60*60*1000 (1 hora) 6e4 = 60*1000 (1 minuto)
	
	
	var dia1 = localStorage.getItem('dia');
	if (dia1==null || dia1=='null') {
		localStorage.setItem('dia',now.getDate());
	};

	var dia1 = parseInt(localStorage.getItem('dia'));
	var dia2 = now.getDate();
	
	if (dia1<dia2) {
		localStorage.setItem('dia',dia2);
		localStorage.setItem('con',0);
	};
	
	return hours;
}