var args = arguments[0] || {};
var http = require("http");
var user = require("User");

init();

$.resultTb.addEventListener("click", function(e) {
	if (e.row && e.row.files) {
		var file = _.find(e.row.files, function(f) {
			if (args.type) {
				return f.type == args.type;
			}
			return true;
		});
		if (file) {
			Alloy.Globals.NavGroup.openWindow(Alloy.createController("paperList2", {
				fileurl : file.fileurl
			}).getView(), {
				swipeBack : false
			});
		}
	}
});

function init() {
	$.navBar.showBack(function() {
		Alloy.Globals.NavGroup.closeWindow($.mainWindow);
	});

	if (args.barcode) {
		Alloy.Globals.Loading.show();
		http.request({
			url : SearchBarcode_url + args.barcode,
			format : "JSON",
			type : "GET",
			success : function(data) {
				Alloy.Globals.Loading.hide();
				if (_.isArray(data)) {
					var product = data[0];

					fillTable(product);
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

	if (args.product) {
		fillTable(args.product);
	}

}

function fillTable(product) {

	user.addHistory({
		id : product.id,
		image : "/images/product_small.jpg",
		title : product.productname,
		line1 : product.productdes
	}, 0);

	$.lblProductName.text = product.productname;
	$.lblProductDescription.text = product.productdes;
	$.image.image = FILE_BASE + (product.qfileList_.length > 0 ? product.qfileList_[0].fileurl : "");
	var id = product.id;
	http.request({
		url : WEBAPI_BASE + "/myRepport_queryCheckItermByPINSession.m?productcheckiterm.productid=" + id,
		format : "JSON",
		type : "GET",
		success : function(data) {
			http.request({
				url : WEBAPI_BASE + "/myRepport_getSupplierDataBySession.m",
				format : "JSON",
				type : "GET",
				success : function(data) {
					var rows = [];
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						var row = Alloy.createWidget("ti.ux.rowitem", "widget", {
							title : "批次: " + (item.batch),
							//count : item.qfileList_.length,
							hasChildren : item.qfileList_.length
						}).getView();
						row.files = item.qfileList_;
						rows.push(row);
					}
					//alert(rows.length);
					if (rows.length > 0)
						$.resultTb.setData(rows);
					else {
						rows.push(Alloy.createWidget("ti.ux.rowitem", "widget", {
							title : "该商品没有相关批次.",
							hasChildren : false
						}).getView());
						$.resultTb.setData(rows);
					}
				}
			});
		}
	});

}
