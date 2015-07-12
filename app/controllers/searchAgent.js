var http = require("http");

$.navBar.showBack(function() {
	Alloy.Globals.NavGroup.closeWindow($.mainWindow);
});

$.navBar.setHandlers({
	search : function() {
	}
});

$.paging.setScrollableView($.scrollableView);

searchAgentByCity('深圳市');
searchAgentByCategory('建筑材料');

function tabHandler(e) {
	/*
	if (e.tab == 0) {
			fillAgentTable($.tbZoneAgent);
		}*/
	
	/*
	if (e.tab == 1) {
			fillAgentTable($.tbPriceAgent);
		}*/
	
	/*
	if (e.tab == 1) {
			fillAgentTable($.tbCategoryAgent);
		}*/
	
}

function fillAgentTable(table,data) {
	var agents = _.map(data,function(d){return {title:d.name,image:Alloy.Globals.formatFileUrl(d.fileList_,'MY')};});
	var rows = [];
	for (var i = 0; i < agents.length; i++) {
		var item = agents[i];
		var row = Alloy.createController("listItemSimpleView", item).getView();
		row.data=data[i];
		rows.push(row);
	};
	if (rows.length > 0) {
		table.setData(rows);
	} else {
		table.setData([]);
	}
}

$.cZone.addEventListener("click", function(e) {
	var city;
	var zone;
	if (e.source.apiName == "Ti.UI.View") {
		city = e.source.children[0].text;
		zone=e.source;
	}
	if (e.source.action) {
		city = e.source.text;
		zone=e.source.parent;
	}
	if (city&&zone) {
		_.each($.cZone.children, function(i) {
			i.backgroundColor = "#E8E8E8";
		});
		searchAgentByCity(city);
		zone.backgroundColor = "#FFFFFF";
	}
});

$.cCategory.addEventListener("click", function(e) {
	var zone;
	var category;
	if (e.source.apiName == "Ti.UI.View") {
		zone = e.source;
		category=e.source.children[0].text;
	}
	if (e.source.action) {
		zone = e.source.parent;
		category=e.source.text;
	}
	if (zone&&category) {
		_.each(zone.parent.children, function(i) {
			i.backgroundColor = "#E8E8E8";
		});
		searchAgentByCategory(category);
		zone.backgroundColor = "#FFFFFF";
	}
});

$.tbZoneAgent.addEventListener("click", function(e) {
	if (e.row) {
		var win = Alloy.createController("agentInfo", {
			agent : e.row.data
		}).getView();
		Alloy.Globals.NavGroup.openWindow(win);
	}
});
/*
$.tbPriceAgent.addEventListener("click", function(e) {
	if (e.row) {
		var win = Alloy.createController("agentInfo", {
			product : e.row.data
		}).getView();
		Alloy.Globals.NavGroup.openWindow(win);
	}
});*/

$.tbCategoryAgent.addEventListener("click", function(e) {
	if (e.row) {
		var win = Alloy.createController("agentInfo", {
			agent : e.row.data
		}).getView();
		Alloy.Globals.NavGroup.openWindow(win);
	}
});

function searchAgentByCity(city){
	Alloy.Globals.Loading.show();
		http.request({
			url : SearchAgentByCity,
			format : "JSON",
			type : "POST",
			data : {
				'qsupplier.city' : city
			},
			success : function(data) {
				Alloy.Globals.Loading.hide();
				if (_.isArray(data)) {
					fillAgentTable($.tbZoneAgent,data);
				} else {
					//alert("没有相关记录。");
					$.tbZoneAgent.data=[];
				}
			},
			failure : function(error) {
				alert("网络错误，请重试。");
				Alloy.Globals.Loading.hide();
			}
		});
}

function searchAgentByCategory(category){
	Alloy.Globals.Loading.show();
		http.request({
			url : SearchAgentByNengLi,
			format : "JSON",
			type : "POST",
			data : {
				'keyword' : category
			},
			success : function(data) {
				Alloy.Globals.Loading.hide();
				if (_.isArray(data)) {
					fillAgentTable($.tbCategoryAgent,data);
				} else {
					//alert("没有相关记录。");
					$.tbCategoryAgent.data=[];
				}
			},
			failure : function(error) {
				alert("网络错误，请重试。");
				Alloy.Globals.Loading.hide();
				
			}
		});
}
