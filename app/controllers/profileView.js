var user = require("User");
var args = arguments[0] || {};

init();

function init() {
	var currentUser = user.getCurrentUser();
	if (currentUser) {
		$.lblName.text = currentUser.name;
		fillAgentTable();
	}
}


$.myHistoryBtn.getView().addEventListener("click", function() {
	var myHistroyWindow = Alloy.createController("myHistory").getView();
	Alloy.Globals.NavGroup.openWindow(myHistroyWindow);
});

$.myFavorite.getView().addEventListener("click", function() {
	var myFavoriteWindow = Alloy.createController("myHistory").getView();
	Alloy.Globals.NavGroup.openWindow(myFavoriteWindow);
});

$.myAdvice.getView().addEventListener("click", function() {
	var myAdviceWindow = Alloy.createController("advice").getView();
	Alloy.Globals.NavGroup.openWindow(myAdviceWindow);
});

$.lblLine2.addEventListener("click", function() {
	user.logout();
	args.parent && args.parent.fireEvent("reload");
});

function fillAgentTable() {
	var agents = [{
		image : "/images/gs_logo.png",
		title : "蓝海公司",
		line1 : "检测项目：色牢度,纤维含量，摩擦牢度，抗起毛性，耐磨性"
	}];
	var rows = [];
	for (var i = 0; i < agents.length; i++) {
		var item = agents[i];
		var row = Alloy.createController("listItemView", item).getView();
		rows.push(row);
	};
	if (rows.length > 0) {
		$.tbAgent.setData(rows);
	} else {
		alert("没有相关机构。");
	}
}
