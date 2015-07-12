$.navBar.showBack(function() {
	Alloy.Globals.NavGroup.closeWindow($.mainWindow);
});

$.btnNext.addEventListener("click",function(){
	var step2Win=Alloy.createController("findPassword3").getView();
	Alloy.Globals.NavGroup.openWindow(step2Win);
});
