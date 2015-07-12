var user = require("User");
var http = require("http");
var args = arguments[0] || {};

$.btnLogin.addEventListener("click", function() {
	var userName = $.name.value;
	var password = $.password.value;
	if (userName && password) {
		var url = Alloy.Globals.formatString(LoginUrl, [userName, password]);
		Alloy.Globals.Loading.show();
		http.request({
			url : url,
			format : "JSON",
			type : "GET",
			success : function(data) {
				Alloy.Globals.Loading.hide();
				if (data) {
					user.setUser({
						id : data.id,
						name : data.username,
						type : data.usertype,
						email : data.email
					});
					user.setCurrentUser(data.id);
					args.parent&&args.parent.fireEvent("reload");
				} else {
					alert("输入错误或者用户不存在，请重试。");
				}
			},
			failure : function(error) {
				alert("网络错误，请重试。");
				Alloy.Globals.Loading.hide();
			}
		});
	}
});


$.findPassword.addEventListener("click", function() {
	var findPasswordWindow = Alloy.createController("findPassword1").getView();
	Alloy.Globals.NavGroup.openWindow(findPasswordWindow);
});


$.register.addEventListener("click", function() {
	var registerWindow = Alloy.createController("register").getView();
	Alloy.Globals.NavGroup.openWindow(registerWindow);
});
