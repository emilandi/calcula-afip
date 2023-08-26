var tasa;
var rate;
var taxpais=30;
var taxafip=45;

$(document).ready(function(){	
	console.log('ready');	
	$('#get-usd').val('');	
	$('#get-precio').attr('placeholder','loading...');		
	getDatos();
});

function getDatos () {
	let url = 'https://www.dolarsi.com/api/api.php?type=dolar';
	fetch(url)
  		.then((response) => response.json())  		
  		.then((data) => result(data));		
}

function result(data) {	
	console.log(data);
	var resultado=data[0].casa.venta;	
	showFade(resultado);
}

function showFade(resultado) {	
	
	if(undefined != resultado) {		
		
		var usd=resultado.replace(',','.');			

		var txt = 'AR$ = 1 U$D';
		var mensaje='Cotizacion actual del dolar: ';
		var color = 'olive';
		
		var msj=mensaje;
		
		var fixusd = parseFloat(usd).toFixed(2);	
		
		console.log(fixusd);
		
		$("#get-usd").hide().fadeIn(300).val(fixusd);
		$('#get-precio').attr('placeholder','');	

		//efecto loading
		$("#loading").fadeOut(600, function () {					
			$("#get-usd").hide().fadeIn(300).val(fixusd);						
			$("#txttitulo").hide().fadeIn(300).text(txt);												
			$('#get-precio').attr('placeholder','Importe');									
			$("#get-precio").focus();			
		});	
		
		if (fixusd!=undefined) {
			chrome.action.setBadgeText({text: fixusd}); // We have 10+ unread items.	
			chrome.action.setBadgeBackgroundColor({color:color});		
			chrome.action.setTitle({title : msj + fixusd});
		};		

		document.getElementById('get-precio').focus();	
	
	}else{	    
	    $("#get-usd").hide().fadeIn(200).val('');
	}
}	

function fnGetValues (value) {
	var obj = localStorage.getItem(value);
	return obj;
}

function fnSetValues (field,value) {
	localStorage.setItem(field,value);
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
	
	var usd = parseFloat(document.getElementById("get-usd").value.replace(',', '.')); //cotizacion del dolar
	var precio = parseFloat(document.getElementById("get-precio").value);	//importe de la compra en usd		
	
	if (isNaN(precio)){		
		precio=0;
	}

	if (isNaN(usd)){		
		usd=0;
	}

	var precioARS = parseFloat(precio * usd);	
	var afipARS = parseFloat(precioARS * taxafip / 100);
	var paisARS = parseFloat(precioARS * taxpais / 100);
	var preciousd = parseFloat(usd * precio); // usd to ars importe de la compra		
	var total = parseFloat(afipARS+paisARS+precioARS);

	document.getElementById('afip').value=paisARS.toFixed(2);
	document.getElementById('afip35').value=afipARS.toFixed(2);
	document.getElementById('total').value=precioARS.toFixed(2);	
	document.getElementById('preciototal').value=total.toFixed(2);		
		
}

//mostrar datos 
function mostrar(afip,tasa,aduana,preciousd,total,afip35) {	
	document.getElementById("afip").value=afip;		
	document.getElementById('tasa').value=fixvalues(tasa);
	document.getElementById("aduana").value=fixvalues(aduana);
	document.getElementById("total").value=fixvalues(preciousd);	
	document.getElementById("preciototal").value=fixvalues(total);	
	document.getElementById("afip35").value=fixvalues(afip35);
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
	
	//crear ventana de tipo panel 	
	document.getElementById("btndock").addEventListener('click', createPanel);

	function createPanel() {		
		
		fnSetValues('attach', "true");									
		
		var options ={
			'url': '../calcula.html', 
			'width':380, 
			'height':450,
			'type': 'panel'
		};					
		
		chrome.windows.create(options,function(e){
			console.log(e);
		});	
		
		self.close();
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

	getattach = localStorage.getItem('attach');
    if (getattach == "true") {
    	document.getElementById("btndock").style.visibility='hidden';
    };

	document.getElementById("optrate").addEventListener('click', function () { 											
		getRate = fnGetValues('rate');	
		fnRateChange(getRate);						
	});		
	
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
	var afip = parseFloat(preciousd * taxpais /100).toFixed(2);
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