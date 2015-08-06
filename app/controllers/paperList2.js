var args = arguments[0] || {};
var fileurl = args.fileurl;

$.navBar.showBack(function() {
	Alloy.Globals.NavGroup.closeWindow($.paperList2);
});

var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileurl);

if (!file.exists()) {
	var httpUrl = WEBAPI_BASE + "/files/" + fileurl;
	Alloy.Globals.Loading.show();
	var http = require("http");
	http.request({
		url : httpUrl,
		format : "DATA",
		type : "GET",
		success : function(data) {

			file.write(data);
			display(file);
			Alloy.Globals.Loading.hide();
		},
		failure : function(error) {
			alert("网络错误，请重试。");
			Alloy.Globals.Loading.hide();
			Alloy.Globals.NavGroup.closeWindow($.paperList2);
		}
	});

} else {
	display(file);
}

function display(pdf) {

	if (fileurl.toLowerCase().indexOf(".pdf") > 0) {

		var pdfReader = {};
		if (OS_ANDROID) {
			var pdfreader = require('com.mykingdom.pdfreader');
			pdfReader = pdfreader.createReader();
			pdfReader.loadPDFFromFile(pdf);
		} else if (OS_IOS) {
			var reader = require("de.ortinteractive.pdfreader");
			pdfReader = reader.createReader({
				top : 0,
				left : 0,
				width : Ti.UI.FILL,
				height : Ti.UI.FILL,
				pdf : pdf.resolve(),
			});
		}

		$.tabContainer.add(pdfReader);

	} else if (fileurl.toLowerCase().indexOf(".xls") > 0) {
		var anImageView = Ti.UI.createWebView({
			url : pdf.nativePath,
			width : Ti.UI.FILL,
			height : Ti.UI.FILL
		});
		// Add to the parent view.
		$.tabContainer.add(anImageView);

	} else {
		//alert(pdf.name);
		// Create an ImageView.
		var anImageView = Ti.UI.createImageView({
			image : pdf.nativePath,
			width : Ti.UI.FILL
		});
		// Add to the parent view.
		$.tabContainer.add(anImageView);

	}
}
