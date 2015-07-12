var args = arguments[0] || {};
var http = require("http");

init();


function init() {
	$.navBar.showBack(function() {
		Alloy.Globals.NavGroup.closeWindow($.mainWindow);
	});	
	if(args.news){
		var news=args.news;
		//alert(news);
		//alert(news.newstitle);
		$.lblTitle.text=news.newstitle||news.exposurtitle;
		
		news.updatedTime&&($.lblDate.text=Alloy.Globals.formatDate(news.updatedTime));
		$.lblContent.html=news.newscontent||news.exposurcontent;
		$.lblSource.text="";
	}
}
