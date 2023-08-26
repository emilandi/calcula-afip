var rate;
var sel;
var url;
var price;
var aduana;
var sitio = 1;

console.log( "ready!" );

url = 'https://www.dolarsi.com/api/api.php?type=dolar';
	fetch(url)
  		.then((response) => response.json())  		
  		.then((data) => result(data));	

function result(data) {	
    console.log(data);
    var resultado=data[0].casa.venta;
    console.log(resultado);    
	var fixusd = parseFloat(resultado).toFixed(2);	
    if (fixusd!=undefined) {
        //chrome.browserAction.setBadgeText({text: 123}); // We have 10+ unread items.	        
        //chrome.browserAction.setBadgeText({text: fixusd}); // We have 10+ unread items.	
        //chrome.browserAction.setBadgeBackgroundColor({color:color});		
        //chrome.browserAction.setTitle({title : msj + fixusd});
        //chrome.browserAction.setTitle({title : msj });        
    };		
}
