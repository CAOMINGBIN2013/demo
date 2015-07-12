$.navBar.showBack(function() {
	Alloy.Globals.NavGroup.closeWindow($.mainWindow);
});

$.verifyCode.text=randomChar(5);

function randomChar(l) {
	var x = "123456789QWERTYUIPLKJHGFDSAZXCVBNM";
	var tmp = "";
	for (var i = 0; i < l; i++) {
		tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
	}
	return tmp;
}

$.btnNext.addEventListener("click",function(){
	var step2Win=Alloy.createController("findPassword2").getView();
	Alloy.Globals.NavGroup.openWindow(step2Win);
});
