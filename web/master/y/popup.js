var tasa;
var rate;

$(document).ready(init);

function init () {
	console.log('ready');
	console.log('v.1');
	
	$('#get-usd').val('');
	$('#get-precio').attr('placeholder','loading...');	
	
	// get value rate USD/EUR;
	getRate = fnGetValues('rate');  

	if (getRate != 'USD' && getRate != 'EUR' ) {		
		console.log('Rate = ' + getRate + '..error');
		getRate='USD';
		fnSetValues('rate','USD');	
	};

	// config getRate select
	var src = getRate;    
    if (getRate == "EUR") {        
		fnChangeClass('get-usd','euro');		
		fnChangeClass('get-precio','euro');				
	}else{
		fnChangeClass('get-usd','dolar');		
		fnChangeClass('get-precio','dolar');				
    }

    //set mode ligth/dark
    var mode = fnGetValues('mode');
    if (mode=='dark') {    	
    	document.body.className="dark";
    }else{
    	document.body.className="ligth";
	}

	fnSetValues('sitio',1);

	getParam();
	consulta();	
}

function getParam() {
	var param = window.location.search;
	console.log(param);
	if(param){
		var value = param.substring(3,param.length);
		document.getElementById('get-precio').value=value;
		console.log(value);
	}else{
		
	}
	calcula();	
}

/*
function consulta () {

	console.clear();
	
	var sitio = fnGetValues('sitio');
	var src = fnGetValues('rate');
	var aduana = fnGetValues('optaduana');		
	
	// chrome.runtime.sendMessage({action:"cotiza"},function (response) {
	// 	console.log('enviando peticion: cotiza');
	// 	console.log('La respuesta es: ' + response);
	// 	if(response){
	// 		showFade(response);
	// 	}
    // });	
	
	console.log('Consultando Rate:' + src , 'Sitio:' + sitio , 'Aduana:' + aduana);	
}*/

function showFade(resultado) {	
	
	if(undefined != resultado) {		
		var usd=resultado;		
		var fixusd = usd;	
		var tipo = fnGetValues('rate');		
		
		if (tipo=='USD') {
			var txt = 'AR$ = 1 U$D';
			var mensaje='Cotizacion actual del dolar: ';
			var color = 'olive' 				
		}else{
			var txt = 'AR$ = 1 EUR';    		    	
			var mensaje='Cotizacion actual Euro: ';
			var color = '#65469b'  //violeta 	    	
		};	

		//efecto loading
		$("#loading").fadeOut(600, function () {					
			$("#get-usd").hide().fadeIn(300).val(fixusd);						
			$("#txttitulo").hide().fadeIn(300).text(txt);												
			$('#get-precio').attr('placeholder','Importe');									
			$("#get-precio").focus();			
		});	
		var msj=mensaje;
		var fixusd = parseFloat(usd).toFixed(2);	
		// if (fixusd!=undefined) {
		// 	chrome.browserAction.setBadgeText({text: fixusd}); // We have 10+ unread items.	
		// 	chrome.browserAction.setBadgeBackgroundColor({color:color});		
		// 	chrome.browserAction.setTitle({title : msj + fixusd});
		// };		
	
	
	}else{	    
	    $("#get-usd").hide().fadeIn(200).val('');
	}

}	

//**********************************************************//

//funciones
function fnGetValues (value) {
	var obj = localStorage.getItem(value);
	return obj;
}

function fnSetValues (field,value) {
	localStorage.setItem(field,value);
}

function fnRateChange (getRate) {		
	if (getRate == 'USD') {			    				
		fnSetValues('rate','EUR');
		fnChangeClass('get-usd','euro');
		fnChangeClass('get-precio','euro');
		$('#txttitulo').text('AR$ = 1 EUR');
	}else{			
		fnSetValues('rate','USD');						
		fnChangeClass('get-usd','dolar');		
		fnChangeClass('get-precio','dolar');		
		$('#txttitulo').text('AR$ = 1 USD');
	};	
	consulta();
}

//cambiar clase CSS usd/euro
function fnChangeClass (id,src) {		
	document.getElementById(id).className=src;	
}

function fixvalues (values) {
	var obj=parseFloat(values).toFixed(2);
	return obj;
}

//Solo permite introducir numeros.
function soloNumeros(e){  	 	
  	var key = window.event ? e.which : e.keyCode;	
	var el = e.srcElement.value;	
	if(key == 8 || key == 13 || key == 46 || key == 0 || key ==110 || key == 190) {
		//return true;		
		if(el.indexOf('.') > -1){
			e.preventDefault();								
		}
	}
	else{
		if (key < 48 || key > 57) {			
			e.preventDefault();
		}
  	}
}

function calcula () {

	var usd = document.getElementById("get-usd").value; //cotizacion del dolar
	var precio = document.getElementById("get-precio").value;	//importe de la compra en usd		
	var preciousd=(usd * precio); // usd to ars importe de la compra
	
	var afip35  = parseFloat(preciousd) * 0.35;

	//impuesto aduanero
	var aduana = fnaduana(usd,precio); 
	
	//calcula AFIP / impuesto solidario
	var afip = fnafip(preciousd);		
	
	//TASA CORREO(140pe)
	var tasa = fntasa();		
	
	var total = parseFloat(preciousd) + parseFloat(afip) + parseFloat(afip35) +  parseFloat (aduana) + parseFloat(tasa);
	
	//mostrar datos 
	document.getElementById("afip").value=fixvalues(afip);		
	document.getElementById("afip35").value=fixvalues(afip35);		
	document.getElementById('tasa').value=fixvalues(tasa);
	document.getElementById("aduana").value=fixvalues(aduana);
	document.getElementById("total").value=fixvalues(preciousd);	
	document.getElementById("preciototal").value=fixvalues(total);
	
	document.getElementById("total2").innerText='ARS: ' + fixvalues(total);

	console.log('----------------------------------')		
	console.log('Precio ARS: ' + usd);
	console.log('Aduana: ' + aduana);	
	console.log('AFIP: ' + afip);
	console.log('Correo: ' + tasa);		
	console.log('Total General: ' + total);
		
}

//eventos
document.addEventListener('DOMContentLoaded', function() {		
	
	//iniciar siempre form popup
	localStorage.setItem('attach',"false");

	//verifica estado del localstorage para checkbox
	getStatus = localStorage.getItem('optaduana');    
    if (getStatus == "true") {
        document.getElementById("optaduana").checked=true;
    }   

    var elem = document.getElementById('get-precio');

	elem.addEventListener('keypress',soloNumeros,false);
	elem.addEventListener('keyup',calcula,false);
	elem.addEventListener('focus',calcula);	    

	//evento click del checkbox 
	document.getElementById('optaduana').addEventListener('click', function() {			
		if (this.checked==true){
			localStorage.setItem('optaduana','true');
			document.getElementById('optcorreo').checked=true;
			document.getElementById('tasa').value=parseFloat('140').toFixed(2);		
		}else{
			localStorage.setItem('optaduana','false');			
			document.getElementById('optcorreo').checked=false;
			document.getElementById('tasa').value=parseFloat('0').toFixed(2);
		}
		calcula();		
	});

	//TASA CORREO
	document.getElementById('optcorreo').addEventListener('click',function(){
		fntasa();					
		calcula();
	});

	//edit valor del dolar
	document.getElementById('edit').addEventListener('click', function() {		
		document.getElementById("get-usd").disabled=false;
		document.getElementById("get-usd").focus();
		document.getElementById("get-usd").select();
	});

	var el = document.getElementById('get-precio');
	if(el.value<0){				
		var preciousd=0;		
		el.style.color='red';	
	}else{
		el.style.color='white';
	}
	
	
	//desahabiliar edit getdolar una vez que pierde el foco	
	var obj=document.getElementById("get-usd")	
	obj.addEventListener('blur', function () {	
		this.disabled=true;		
	});

	obj.addEventListener('keypress', function(e) {		
		var key = window.event ? e.which : e.keyCode;		
		if(key == 13 ) {
			this.disabled=true;
			document.getElementById('get-precio').focus();						
		}
	});

	
	document.getElementById("optrate").addEventListener('click', function () { 											
		getRate = fnGetValues('rate');	
		fnRateChange(getRate);						
	});	

	document.getElementById('btndark').addEventListener('click',dark);
	
	function dark () {		
		var mode=fnGetValues('mode');
		if(mode=='dark'){
			document.body.className=null;				
			fnSetValues('mode','ligth');
		}else{
			document.body.className='dark';				
			fnSetValues('mode','dark');			
		}
	}	

	document.getElementById('wp').addEventListener('click',function(){
		var value = document.getElementById('get-precio').value;
		if(value){
			var url = 'https://api.whatsapp.com/send?text=https://calcula-afip.web.app/?=v' + value;
			this.href = url;
		}else{
			alert('Ingrese un importe valido ');
			$('#get-precio').focus();
		}	

	})
	
});

//verificar estado del check para calcular true=aduana
function fnaduana (usd,precio) {
	var aduana=0;
	var elem = document.getElementById("optaduana");
	if (elem.checked){													
		if (precio>50){
			aduana = (precio - 50) *  0.50 * usd; // ars aduana	%50		
		}
	}
	return aduana; 
}

//dolar solidario
function fnafip (preciousd) {			
	var afip = parseFloat(preciousd * 0.3).toFixed(2);
	return afip;	
}

//tasa correo
function fntasa () {
	var el = document.getElementById('optcorreo');

	if (el.checked==true) {
		return parseFloat(140);
	}
	else{
		return parseFloat(0);
	}
}