var args = arguments[0] || {};

init();


function init() {
	$.navBar.showBack(function() {
		Alloy.Globals.NavGroup.closeWindow($.mainWindow);
	});	
}

$.scan.addEventListener("click",function(){
	var Barcode = require('Barcode');
	Barcode.ScanBarcode(function(result) {
		//alert(result);
		var productWin=Alloy.createController("productInfo",{barcode:result}).getView();
		Alloy.Globals.NavGroup.openWindow(productWin);
	});
});
