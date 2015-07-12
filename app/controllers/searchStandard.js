var args = arguments[0] || {};
var http = require("http");
var keyword = args.keyword;

$.navBar.showBack(function() {
	Alloy.Globals.NavGroup.closeWindow($.mainWindow);
});
$.navBar.setTitle(keyword);

if (keyword) {
	Alloy.Globals.Loading.show();
	http.request({
		url : SearchNews,
		format : "JSON",
		type : "POST",
		data : {
			"news.newstype" : keyword
		},
		success : function(data) {
			Alloy.Globals.Loading.hide();
			if (_.isArray(data)) {
				fillNewTable(data);
			} else {
				alert("没有相关记录。");
			}

		},
		failure : function(error) {
			alert("网络错误，请重试。");
			Alloy.Globals.Loading.hide();
		}
	});
}
function fillNewTable(data) {
	var news =_.map(data,function(n){
		return{
			title : n.newstitle,
		date : Alloy.Globals.formatDate(n.updatedTime)
		};
	});
	 
	var rows = [];
	for (var i = 0; i < news.length; i++) {
		var item = news[i];
		var row = Alloy.createController("listItemNewView", item).getView();
		row.data=data[i];
		rows.push(row);
	};
	if (rows.length > 0) {
		$.tbNew.setData(rows);
	} else {
		alert("没有相关记录。");
	}
}

$.tbNew.addEventListener("click", function(e) {
	if (e.row) {
		var win = Alloy.createController("newInfo", {
			news : e.row.data
		}).getView();
		Alloy.Globals.NavGroup.openWindow(win);
	}
});

