var args = arguments[0] || {};
var files = args.files;
if (files && files.length) {
	search();
}

$.navBar.showBack(function() {
	Alloy.Globals.NavGroup.closeWindow($.paperList);
});

if(args.title)
$.navBar.setTitle(args.title);

function search() {
	Alloy.Globals.Loading.show();
	var rows = [];
	for (var i = 0; i < files.length; i++) {
		var row = Alloy.createWidget("ti.ux.rowitem", "widget", {
			icon : "fa-file-pdf-o",
			title : (files[i].filename),
			hasChildren : true
		}).getView();
		rows.push(row);
	}
	if (rows.length > 0)
		$.resultTb.setData(rows);
	else {
		rows.push(Alloy.createWidget("ti.ux.rowitem", "widget", {
			title : "没有相关质检报告.",
			hasChildren : false
		}).getView());
		$.resultTb.setData(rows);
	}
	Alloy.Globals.Loading.hide();
}

$.resultTb.addEventListener("click", function(e) {
	if(!files.length)return;
	Alloy.Globals.NavGroup.openWindow(Alloy.createController("paperList2", {
		fileurl : files[e.index].fileurl
	}).getView(), {
		swipeBack : false
	});
});
