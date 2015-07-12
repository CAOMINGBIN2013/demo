var args = arguments[0] || {};

init();


function init() {
	$.navBar.showBack(function() {
		Alloy.Globals.NavGroup.closeWindow($.mainWindow);
	});	
}
