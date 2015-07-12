	var http = require("http");

	$.navBar.showBack(function() {
		Alloy.Globals.NavGroup.closeWindow($.mainWindow);
	});	
	$.paging.setScrollableView($.scrollableView);
	Alloy.Globals.Loading.show();
	http.request({
		url : ExposureUrl,
		format : "JSON",
		type : "POST",
		success : function(data) {
			Alloy.Globals.Loading.hide();
			if (_.isArray(data)) {
				fillNewTable($.tbNew,data);
				fillNewTable($.tbProduct,data);
			} else {
				alert("没有相关记录。");
			}

		},
		failure : function(error) {
			alert("网络错误，请重试。");
			Alloy.Globals.Loading.hide();
		}
	});
	
function fillNewTable(table,data) {
	var news =_.map(data,function(item){
		return {
			title : item.exposurtitle,
		date : Alloy.Globals.formatDate(item.updatedTime)
		};
	});
	 
	var rows=[];
	for (var i=0; i < news.length; i++) {
	  var item=news[i];
	  var row = Alloy.createController("listItemNewView", item).getView();
	  row.data=data[i];
		rows.push(row);
	};	
	if (rows.length > 0) {
		table.setData(rows);
	} else {
		alert("没有相关标准。");
	}
}

$.tbNew.addEventListener("click",function(e){
	if(e.row){
		var win=Alloy.createController("newInfo",{news:e.row.data}).getView();
		Alloy.Globals.NavGroup.openWindow(win);	
	}
});

$.tbProduct.addEventListener("click",function(e){
	if(e.row){
		var win=Alloy.createController("newInfo",{news:e.row.data}).getView();
		Alloy.Globals.NavGroup.openWindow(win);	
	}
});