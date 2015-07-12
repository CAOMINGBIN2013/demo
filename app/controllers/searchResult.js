var args = arguments[0] || {};
var http = require("http");
var keyword = args.keyword;
init();

function init() {

	$.paging.setScrollableView($.scrollableView);

	$.navBar.showBack(function() {
		Alloy.Globals.NavGroup.closeWindow($.searchResult);
	});

	$.navBar.setTitle('"' + keyword + '"' + '搜索结果');
	fillAgentTable();
	fillNewTable();
	if (keyword) {
		Alloy.Globals.Loading.show();
		http.request({
			url : SearchAll,
			format : "JSON",
			type : "POST",
			data : {
				keyword : keyword
			},
			success : function(data) {
				Alloy.Globals.Loading.hide();
				if (_.isObject(data)) {
					fillTable(data.products);
					fillAgentTable(data.qsupplier);
				} else {
					alert("没有相关商品。");
					Alloy.Globals.NavGroup.closeWindow($.mainWindow);
				}
			},
			failure : function(error) {
				alert("网络错误，请重试。");
				Alloy.Globals.Loading.hide();
				Alloy.Globals.NavGroup.closeWindow($.mainWindow);
			}
		});
	}

}

function fillTable(data) {
	var rows = [];
	//alert(data.length);
	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		var row = Alloy.createController("listItemView", {
			image:FILE_BASE+(item.qfileList_.length>0?item.qfileList_[0].fileurl:""),
			title : item.productname,
			line1 : "生产商：" + item.suppliername_,
			line2 : "生产商地址："+'北京市11111街道',//(_.has(item,"address")?item.address:''),
			line3 : "规格：" + item.specifications
		}).getView();
		row.data = item;
		rows.push(row);
	}
	//alert(rows.length);
	if (rows.length > 0) {
		//$.tbAgent.setData(rows);
		$.tbProduct.setData(rows);
		//$.tbNew.setData(rows);
	} else {
		//alert("没有相关商品。");
	}
}

function fillAgentTable(data) {

	var agents = [];
	if (data && _.isArray(data)) {
		agents = _.map(data, function(d) {
			return {
				image : "/images/gs_logo.png",
				title : d.name,
				line1 : d.fileList_.join()
			};
		});
	}
	var rows = [];
	for (var i = 0; i < agents.length; i++) {
		var item = agents[i];
		var row = Alloy.createController("listItemView", item).getView();
		row.data=data[i];
		rows.push(row);
	};
	if (rows.length > 0) {
		$.tbAgent.setData(rows);
	} else {
		//alert("没有相关机构。");
	}
}

function fillNewTable() {
	var news = [{
		title : "质检总局要求江苏交日出蓝海公司产品检测报告",
		date : "2015-4-20"
	}, {
		title : "质检总局要求江苏交日出蓝海公司产品检测报告",
		date : "2015-4-20"
	}, {
		title : "质检总局要求江苏交日出蓝海公司产品检测报告",
		date : "2015-4-20"
	}];
	var rows = [];
	for (var i = 0; i < news.length; i++) {
		var item = news[i];
		var row = Alloy.createController("listItemNewView", item).getView();
		rows.push(row);
	};
	if (rows.length > 0) {
		$.tbNew.setData(rows);
	} else {
		alert("没有相关新闻。");
	}
}

$.tbProduct.addEventListener("click", function(e) {
	if (e.row) {
		var win = Alloy.createController("productInfo", {
			product : e.row.data
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

$.tbNew.addEventListener("click", function(e) {
	if (e.row) {
		var win = Alloy.createController("newInfo", {
			product : e.row.data
		}).getView();
		Alloy.Globals.NavGroup.openWindow(win);
	}
});

