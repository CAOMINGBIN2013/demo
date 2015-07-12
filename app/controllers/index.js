$.index.open();
if(!Ti.App.Properties.getBool("guide",false)){
	var guide=Alloy.createController("guide").getView();
	guide.open();
	Ti.App.Properties.setBool("guide",true);
}

Alloy.Globals.NavGroup = $.index;
Alloy.Globals.FirstWindow = $.mainWindow;
$.index.orientationModes = [Ti.UI.PORTRAIT];

//event
function enableTextField(e) {
	e.source && (e.source.editable = true);
}

$.codeTxt.addEventListener("return", function() {
	searchP($.codeTxt.value);
});

$.btnSearch.addEventListener("click",function(){
	searchP($.codeTxt.value);
});

function search(barcode) {
	var productWin = Alloy.createController("productInfo", {
		barcode : barcode
	}).getView();
	Alloy.Globals.NavGroup.openWindow(productWin);
}


function searchP(keyword) {
	var productWin = Alloy.createController("searchResult", {
		keyword : keyword
	}).getView();
	Alloy.Globals.NavGroup.openWindow(productWin);
}

$.searchZhongJie.addEventListener("click",function(){
	var zhongjieWin=Alloy.createController("testAgentService").getView();
	Alloy.Globals.NavGroup.openWindow(zhongjieWin);
});

$.searchJiGou.addEventListener("click",function(){
	var zhongjieWin=Alloy.createController("searchAgent").getView();
	Alloy.Globals.NavGroup.openWindow(zhongjieWin);
});

$.searchStand.addEventListener("click",function(){
	var zhongjieWin=Alloy.createController("searchStandard",{keyword:"检测标准"}).getView();
	Alloy.Globals.NavGroup.openWindow(zhongjieWin);
});

$.searchBaoGuang.addEventListener("click",function(){
	var zhongjieWin=Alloy.createController("searchExposure").getView();
	Alloy.Globals.NavGroup.openWindow(zhongjieWin);
});

$.cZhishi.addEventListener("click",function(){
	var zhongjieWin=Alloy.createController("searchStandard",{keyword:"检测知识"}).getView();
	Alloy.Globals.NavGroup.openWindow(zhongjieWin);
});

$.cZixun.addEventListener("click",function(){
	var zhongjieWin=Alloy.createController("searchStandard",{keyword:"检测资讯"}).getView();
	Alloy.Globals.NavGroup.openWindow(zhongjieWin);
});

$.cIndex.addEventListener("reload",function(){
	if(OS_ANDROID){
		$.ad.resetViews(
			[Ti.UI.createImageView({
				image:"/images/ad/app-b1.jpg",
				height:"180dp",
				width:Ti.UI.FILL
			}),
			Ti.UI.createImageView({
				image:"/images/ad/app-b2.jpg",
				height:"180dp",
				width:Ti.UI.FILL
			}),
			Ti.UI.createImageView({
				image:"/images/ad/app-b3.jpg",
				height:"180dp",
				width:Ti.UI.FILL
			})
			]
		);
	}
});
$.ad.intervalViews();
