exports.ScanBarcode = function(callback) {
	var Barcode = require('ti.barcode');
	Barcode.allowRotation = false;
	Barcode.displayedMessage = ' ';
	Barcode.allowMenu = false;
	Barcode.allowInstructions = false;
	Barcode.useLED = false;

	/**
	 * Create a chrome for the barcode scanner.
	 */
	var overlay = Ti.UI.createView({
		backgroundColor : 'transparent',
		top : 0,
		right : 0,
		bottom : 0,
		left : 0
	});

	var header = Ti.UI.createView({
		backgroundColor : '#bbb',
		opacity : 0.8,
		height : 90,
		top : 0
	});

	var headerContainer = Ti.UI.createView({
		top : 20,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		layout : "horizontal"
	});

	var barcodeIcon = Alloy.createWidget("ti.ux.iconlabel", {
		width : Ti.UI.SIZE,
		text : "条形码",
		icon : "fa-barcode"
	}).getView();

	var qrcodeIcon = Alloy.createWidget("ti.ux.iconlabel", {
		width : Ti.UI.SIZE,
		left : 40,
		text : "二维码",
		icon : "fa-qrcode"
	}).getView();

	headerContainer.add(barcodeIcon);
	headerContainer.add(qrcodeIcon);
	header.add(headerContainer);
	overlay.add(header);

	var bottom = Ti.UI.createView({
		backgroundColor : '#bbb',
		opacity : 0.8,
		height : 90,
		bottom : 0
	});

	var bottomContainer = Ti.UI.createView({
		top : 20,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		layout : "horizontal"
	});

	var handIcon = Alloy.createWidget("ti.ux.iconlabel", {
		width : Ti.UI.SIZE,
		text : "手输",
		icon : "fa-edit"
	}).getView();
	var imageIcon = Alloy.createWidget("ti.ux.iconlabel", {
		width : Ti.UI.SIZE,
		left : 60,
		text : "图片",
		icon : "fa-image"
	}).getView();
	var flashIcon = Alloy.createWidget("ti.ux.iconlabel", {
		width : Ti.UI.SIZE,
		left : 50,
		text : "闪光灯",
		icon : "fa-flash"
	}).getView();

	handIcon.addEventListener('click', function() {
		Barcode.cancel();
		var content = Alloy.createController("inputBarcodeView");
		var aboutPopover = Alloy.createWidget("wriststrap.dialog", "widget", {
			content : content.getView(),
			animate : true,
			contentHeight : 300
		});

		content.skip.addEventListener("click", function() {
			aboutPopover.getView().animateClose();
		});
		content.query.addEventListener("click", function() {
			if (content.txtCode.value != '') {
				callback && callback(content.txtCode.value);
				aboutPopover.getView().animateClose();
			}
		});
	});

	imageIcon.addEventListener('click', function() {
		Barcode.cancel();
		Ti.Media.openPhotoGallery({
			success : function(evt) {
				Barcode.parse({
					image : evt.media
				});
			}
		});
	});
	
	flashIcon.addEventListener('click',function(){
		Barcode.useLED=!Barcode.useLED;
	});

	bottomContainer.add(handIcon);
	bottomContainer.add(imageIcon);
	bottomContainer.add(flashIcon);
	bottom.add(bottomContainer);
	overlay.add(bottom);

	/*
	 var switchButton = Ti.UI.createButton({
	 title : Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera',
	 textAlign : 'center',
	 color : '#000',
	 backgroundColor : '#fff',
	 style : 0,
	 font : {
	 fontWeight : 'bold',
	 fontSize : 16
	 },
	 borderColor : '#000',
	 borderRadius : 10,
	 borderWidth : 1,
	 opacity : 0.5,
	 width : 220,
	 height : 30,
	 bottom : 10
	 });
	 switchButton.addEventListener('click', function() {
	 Barcode.useFrontCamera = !Barcode.useFrontCamera;
	 switchButton.title = Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera';
	 });
	 overlay.add(switchButton);
	 var cancelButton = Ti.UI.createButton({
	 title : 'Cancel',
	 textAlign : 'center',
	 color : '#000',
	 backgroundColor : '#fff',
	 style : 0,
	 font : {
	 fontWeight : 'bold',
	 fontSize : 16
	 },
	 borderColor : '#000',
	 borderRadius : 10,
	 borderWidth : 1,
	 opacity : 0.5,
	 width : 220,
	 height : 30,
	 top : 20
	 });
	 cancelButton.addEventListener('click', function() {
	 Barcode.cancel();
	 });
	 overlay.add(cancelButton);*/

	Barcode.capture({
		animate : true,
		overlay : overlay,
		showCancel : false,
		showRectangle : true,
		keepOpen : false
	});

	Barcode.addEventListener('error', function(e) {
		alert(e.message);
		Ti.API.error(e);
	});
	Barcode.addEventListener('cancel', function(e) {
		Ti.API.info('Cancel received');
	});
	Barcode.addEventListener('success', function(e) {
		Ti.API.info('Success called with barcode: ' + e.result);
		callback && callback(e.result);
	});

};
