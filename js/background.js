
chrome.windows.getCurrent(function(win)
{
   chrome.tabs.getAllInWindow(win.id, function(tabs)
  	{
        //Should output an array of tab objects to your dev console.
        //console.log(tabs);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   //alert(changeInfo.url);
	fetchExchangeRate('USD','ARS');
}); 

function fetchExchangeRate(from,to) {

	$.ajax({
				
		url: 'http://finance.yahoo.com/d/quotes.csv?e=.csv&f=c4l1&s=USDARS=X',
		
		cache: true,
		async: true,	
		
		beforeSend: function() {
			//$('#final_amount').text('Loading...');
		},

		success: function(responseObj) {
			var resultado = responseObj.substr(6,10);
			if(undefined != resultado) {									
				var usd=resultado;					
				texto(usd);
			}			
		},

		error: function() {			
		    chrome.browserAction.setBadgeText({text: '..?'}); // We have 10+ unread items.	
		    chrome.browserAction.setTitle({title :'error! no se puede conectar con el servidor...'});
		}
		
	});		
}

function texto (usd) {    	
	var fixusd = parseFloat(usd).toFixed(2);	
	if (fixusd!=undefined) {
		chrome.browserAction.setBadgeText({text: fixusd}); // We have 10+ unread items.	
		//chrome.browserAction.setBadgeBackgroundColor({ color: [0, 190, 70, 200] });	
		chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });	
	    chrome.browserAction.setTitle({title :"Cotizacion actual del dolar: " + fixusd});
	};	
}