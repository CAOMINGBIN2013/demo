$.navBar.showBack(function() {
	Alloy.Globals.NavGroup.closeWindow($.mainWindow);
});

$.cService.addEventListener("click", function(e) {
	if (e.source.service) {
		var appointWin = Alloy.createController("appoint", {
			service : e.source.service
		}).getView();
		Alloy.Globals.NavGroup.openWindow(appointWin);
	}
});

for (var i = 0; i < $.cService.children.length; i++) {
	var service = $.cService.children[i];
	service.text = '';
	service.backgroundImage = "/images/category/" + (i + 1) + ".png";
};
