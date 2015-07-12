var user = require("User");
var profileView = Alloy.createController("profileView",{parent:$.tabContainer}).getView();
var loginView = Alloy.createController("loginView",{parent:$.tabContainer}).getView();
$.tabContainer.addEventListener("reload", function() {
	init();
});
function init() {
	var currentUser = user.getCurrentUser();
	if($.tabContainer.children.length>=2){
		$.tabContainer.remove($.tabContainer.children[1]);
	}
	if (currentUser) {
		$.tabContainer.add(profileView);
		$.navBar.setTitle("个人中心");
	} else {
		$.tabContainer.add(loginView);
		$.navBar.setTitle("登录");
	}
}

