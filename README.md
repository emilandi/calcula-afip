Calculadora de compras en el exterior 
(Chrome Extension)
=============================================

Calculadora de precios para compras en el exterior desde argentina

var price = document.getElementById('priceblock_ourprice').innerText;
var num = price.replace(/USD|US|U|US$|EUR/g,'').trim();
var fix = num.replace('$','').trim();
console.log(fix);


var price = document.getElementById('priceblock_ourprice').innerText;
var num = price.replace(/U|S|D|E|R|A/g,'').trim();
var fix = num.replace('$','').trim();
console.log(fix);
