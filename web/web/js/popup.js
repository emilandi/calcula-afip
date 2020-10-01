var tasa;
var rate;

//$(document).ready(init);

function init () {
	console.log('ready');
	
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
		document.getElementById('get-precio').value=value
		console.log(value);
	}	
	calcula();
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
		$("#get-usd").hide().fadeIn(200).val('');	
	}else{
		
		rate = parseFloat(rate.toString().replace(/,/, '.')).toFixed(2);		

		if (isNaN(rate)) {			
			fnSetValues('price',null);		
		}else{	
			fnSetValues('price',rate);
		};	
		
		console.log('Rate: ' + rate + ' - ' + Date() );					
		
		document.getElementById('get-precio').placeholder='';
		
		//solidario
		var solid = fixvalues(rate * 1.65);
		
		//return fecha
		var fecha = getDate();				

		//return USD/EUR
		var tipo = fnGetValues('rate');						
		
		if (tipo=='USD') {
			var txt = 'AR$ = 1 U$D';
			var mensaje='Cotizacion actual del dolar: ';
			var color = 'olive';					
		}else{
			var txt = 'AR$ = 1 EUR';	    	
			var mensaje='Cotizacion actual Euro: ';
			var color = '#65469b';  //violeta	  
		};	

		var msg = '(*) solidario: ' + solid;

		//mostrar datos
		$("#loading").fadeOut("slow");	

		$("#get-usd").hide().fadeIn(300).val(rate);						
		$('#solid').hide().fadeIn(300).text(msg);
		$('#txttitulo').hide().fadeIn(300).val(fecha);
		
		$("#get-precio").focus();	

		calcula();
		
		return rate;			
		
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

	$('.smile').hide();
	
	if(total > 999 && total < 9999){
		$('#smile1').show();
	}
	
	if(total > 9999 && total < 99999){
		$('#smile2').show();
	}
	
	if(total > 99999 && total < 999999){
		$('#smile3').show();
	}

	if(total > 999999 && total < 9999999){
		$('#smile4').show();		
	}

	if(total > 9999999 && total < 99999999){
		$('#smile5').show();		
	}

	if(total > 99999999){
		$('#smile6').show();		
	}



	
	// console.log('----------------------------------')		
	// console.log('Precio ARS: ' + usd);
	// console.log('Aduana: ' + aduana);	
	// console.log('AFIP: ' + afip);
	// console.log('Correo: ' + tasa);		
	// console.log('Total General: ' + total);
		
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
		$('#txttitulo').text('AR$ = 1 EUR');		
	};	

	var fecha = getDate();	
	$('#txttitulo').text(fecha);

	consulta();
}


function getSolid() {
	var usd = document.getElementById('get-usd').value;
	alert(usd)	;
	if(usd){
		var solid = parseFloat(usd * 1.65);
		return solid;
	}
}

//cambiar clase CSS usd/euro
function fnChangeClass (id,src) {		
	document.getElementById(id).className=src;
}

function fixvalues (values) {
	var obj=parseFloat(values).toFixed(2);
	return obj;
}




function getDate() {
	var f = new Date();
	var fecha =	 f.getDate() + "·" + (f.getMonth() +1) + "·" + f.getFullYear();
	var srtDate = 'Cotización al '  + fecha
	return srtDate;
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
	
	// document.getElementById("optrate").addEventListener('click', function () { 											
	// 	getRate = fnGetValues('rate');	
	// 	fnRateChange(getRate);						
	// });	

	document.getElementById("optUSD").addEventListener('click', function () { 											
		getRate = 'EUR' //fnGetValues('rate');	
		fnRateChange(getRate);						
	});	
	
	document.getElementById("optEUR").addEventListener('click', function () { 											
		getRate = 'USD' //fnGetValues('rate');	
		fnRateChange(getRate);						
	});	

	
	var audio = new Audio('march.ogg');
	var hand = document.getElementById('hand');

	hand.addEventListener('mouseover',function(){		
		audio.currentTime = 37			
		audio.play();	
	})

	hand.addEventListener('mouseleave',function(){								
		audio.pause();
		//audio.currentTime = 0;		
	})	

	// $('#hand').click(function() {
	// 	audio.play();		
	// });

	// $('#hand').blur(function() {
	// 	audio.pause();
	// 	audio.currentTime = 0;
	// });

	
});


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