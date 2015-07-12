var args = arguments[0] || {};
var http = require("http");
var user = require("User");
init();

function init() {

	$.paging.setScrollableView($.scrollableView);

	fillAgentTable();
	fillTable();

}

exports.reload = function() {
	fillAgentTable();
	fillTable();
};

function fillTable() {
	var data = user.getHistories(0);
	if (!data)
		return;
	var rows = [];
	for (var i = data.length-1; i >=0; i--) {
		var item = data[i];
		var row = Alloy.createController("listItemView", item).getView();
		row.data = item;
		rows.push(row);
	}
	//alert(rows.length);
	if (rows.length > 0) {
		//$.tbAgent.setData(rows);
		$.tbProduct.setData(rows);
		//$.tbNew.setData(rows);
	} else {
		$.tbProduct.setData([{title:"暂时没有记录"}]);
	}
}

function fillAgentTable() {
	var agents = user.getHistories(1);
	if (!agents)
		return;
	var rows = [];
	for (var i = agents.length-1; i >=0; i--) {
		var item = agents[i];
		var row = Alloy.createController("listItemView", item).getView();
		rows.push(row);
	};
	if (rows.length > 0) {
		$.tbAgent.setData(rows);
	} else {
		$.tbAgent.setData([{title:"暂时没有记录"}]);
	}
}

$.tbProduct.addEventListener("click", function(e) {
	if (e.row) {
		var win = Alloy.createController("productInfo", {
			barcode : e.row.data.code
		}).getView();
		Alloy.Globals.NavGroup.openWindow(win);
	}
});

$.tbAgent.addEventListener("click", function(e) {
	if (e.row) {
		var win = Alloy.createController("agentInfo", {
			product : e.row.data
		}).getView();
		Alloy.Globals.NavGroup.openWindow(win);
	}
});

