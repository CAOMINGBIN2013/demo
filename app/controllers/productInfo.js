var args = arguments[0] || {};
var http = require("http");
var user = require("User");

init();

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
					var nocode=Alloy.createController("nocode").getView();
					Alloy.Globals.NavGroup.openWindow(nocode);
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

	$.lblTitle.text = product.productname;
	$.lblLine1.text = "生产商：" + product.suppliername_ || '其他';
	$.lblLine2.text = "生产商地址：" + '北京市11111街道';
	$.lblLine3.text = "规格：" + product.specifications;
	$.lblLine4.text = "生产日期：" + Alloy.Globals.formatDate(product.shenchanriqi);
	$.lblLine5.text = "有效期：" + Alloy.Globals.formatDate(product.youxiaoqi);

	http.request({
		url : GetSupplierById,
		format : "JSON",
		type : "POST",
		data : {
			"supplier.id" : product.supplierid
		},
		success : function(data) {
			if (data) {
				$.lblLine1.text = "生产商：" + data.suppliername;
				$.lblLine2.text = "生产商地址：" + data.address;

				user.addHistory({
					id : product.id,
					image : FILE_BASE + (product.qfileList_.length > 0 ? product.qfileList_[0].fileurl : ""),
					title : product.productname,
					line1 : "生产商：" + data.suppliername,
					line2 : "生产商地址：" + data.address,
					line3 : "规格：" + product.specifications,
					code : product.productcode
				}, 0);
			}

		}
	});

	$.image.image = FILE_BASE + (product.qfileList_.length > 0 ? product.qfileList_[0].fileurl : "");

	$.result.setData([Alloy.createWidget("ti.ux.rowitem", "widget", {
		icon : "fa-check-square-o",
		iconColor : "#e87726",
		color : "#e87726",
		fontSize : "18dp",
		title : "经查，该批产品已按相关标准进行检测，详见检测报告。",
		hasChildren : false
	}).getView()]);

	/*
	$.result.addEventListener("click", function(e) {
			if (e.row) {
				var win = Alloy.createController("productInfoBatch", {
					product : product
				}).getView();
				Alloy.Globals.NavGroup.openWindow(win);
			}
		});*/

	$.resultTb.addEventListener("click", function(e) {
		if (e.row) {
			var win = Alloy.createController("productInfoBatch", {
				product : product,
				type : (e.index == 0 ? "SUPPLIER" : "ZHENGSHU")
			}).getView();
			Alloy.Globals.NavGroup.openWindow(win);
		}
	});

	//address
	/*
	 http.request({
	 url : GetSupplierById,
	 format : "JSON",
	 type : "POST",
	 data:{"qsupplier.id":product.supplierid},
	 success : function(data) {
	 if(data){
	 $.lblLine2.text = "生产商地址："+data.address;
	 }

	 }});*/

}

