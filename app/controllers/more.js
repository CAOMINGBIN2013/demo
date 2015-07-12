$.share.getView().addEventListener("click", function() {
	var socialWidget = Alloy.createWidget('com.alcoapps.socialshare');
	socialWidget.share({
		status : '商品买的好，就扫质量宝',
		image : "/appicon.png",
		androidDialogTitle : '分享质量宝'
	});
});

$.about.getView().addEventListener("click",function(){
	var about=Alloy.createController("about",{
		title:"关于我们",
		url:"/etc/about.html"
	}).getView();
	Alloy.Globals.NavGroup.openWindow(about);
});

$.mianze.getView().addEventListener("click",function(){
	var about=Alloy.createController("about",{
		title:"免责条款",
		url:"/etc/mianze.html"
	}).getView();
	Alloy.Globals.NavGroup.openWindow(about);
});

$.hezuo.getView().addEventListener("click",function(){
	var about=Alloy.createController("hezuo").getView();
	Alloy.Globals.NavGroup.openWindow(about);
});