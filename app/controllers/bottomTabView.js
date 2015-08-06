var args = arguments[0] || {};
var index = args.index;

var init = function(tabGroup, index) {
	if (!Alloy.Globals.bottomTab || Alloy.Globals.bottomTabs.length <= 0) {
		Alloy.Globals.bottomTabs = [{
			id : 0,
			title : "首页",
			icon : "/images/bottom/home.png",
			activeIcon : "/images/bottom/home.png",
			controller : 'index'
		}, {
			id : 1,
			title : "浏览记录",
			icon : "/images/bottom/history.png",
			activeIcon : "/images/bottom/history.png",
			controller : 'history'
		}, {
			id : 2,
			title : "扫质量",
			icon : "/images/bottom/scan.png",
			activeIcon : "/images/bottom/scan.png",
			width : 110
		}, {
			id : 3,
			title : "我的",
			icon : "/images/bottom/my.png",
			activeIcon : "/images/bottom/my.png",
			controller : 'my'
		}, {
			id : 4,
			title : "更多",
			icon : "/images/bottom/more.png",
			activeIcon : "/images/bottom/more.png",
			controller : 'more'
		}];
	}
	// Initialize the tab bar
	tabGroup.init({
		nodes : Alloy.Globals.bottomTabs,
		backgroundColor : "#ffffff",
		activeBackgroundColor : "#dddd",
		tabClickCallback : tabClickCallback
	});

	//alert(index);
	// Set the first tab as active
	tabGroup.setIndex(index);

	// Handle the click event on a tab
	function tabClickCallback(_index) {
		//if(_index>2)_index--;
		$.parent.children[0].scrollToView(_index);
		//if(_index==1){
		//alert($.parent.children[0].currentPage);
		$.parent.children[0].views[_index].fireEvent("reload");
		//}
	}

};

init($.tabs, index);

function scan() {
	var Barcode = require('Barcode');
	if (OS_ANDROID) {
		Barcode.ScanBarcode(function(result) {
			//alert(result);
			var productWin = Alloy.createController("productInfo", {
				barcode : result
			}).getView();
			Alloy.Globals.NavGroup.openWindow(productWin);
		});
	} else if (OS_IOS) {
		Barcode.IOSScanBarcode(function(result) {
			//alert(result);
			var productWin = Alloy.createController("productInfo", {
				barcode : result
			}).getView();
			Alloy.Globals.NavGroup.openWindow(productWin);
		});
	}
}
