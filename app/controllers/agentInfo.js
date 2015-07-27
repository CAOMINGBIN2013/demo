var args = arguments[0] || {};
var http = require("http");
var user = require("User");
var agent = args.agent;

init();

function init() {
	$.navBar.showBack(function() {
		Alloy.Globals.NavGroup.closeWindow($.mainWindow);
	});
	$.navBar.setTitle("检测机构信息");
	if (agent) {

		http.request({
			url : GetAgentById,
			format : "JSON",
			type : "POST",
			data : {
				'qsupplier.id' : agent.id
			},
			success : function(data) {
				var image = Alloy.Globals.formatFileUrl(data.fileList_, 'MY');
				user.addHistory({
					id : agent.id,
					image : image || "/images/gs_logo.png",
					title : agent.name,
					line1 : agent.commetnts
				}, 1);

				$.image.image = image;
				$.lblAgentName.text = agent.name;
				$.lblAgentDescription.text = agent.commetnts;
			}
		});
	}
}

$.resultTb.addEventListener("click", function(e) {
	if (e.row) {
		if (e.index == 0) {
			http.request({
				url : SearchAgentNengli,
				format : "JSON",
				type : "POST",
				data : {
					'qsupplier.id' : agent.id
				},
				success : function(data) {
					if (_.isArray(data) && data.length > 0) {
						Alloy.Globals.NavGroup.openWindow(Alloy.createController("paperList", {
							files : data,
							title:"能力表"
						}).getView());
					} else {
						alert('没有相关记录。');
					}
				}
			});
		} else {
			http.post(SearchZizhiById, {
				"qsupplier.id" : agent.id
			}, function(data) {
				Ti.API.info(data);
				var afiles=[];
				_.each(data,function(c){
					var cate=c.aptitudename;
					_.each(c.qfileList_,function(f){
						f.filename=cate+"  "+f.filename;
						afiles.push(f);
					});
					
				});
				Ti.API.info(afiles);
				Ti.API.info(agent.id);
				if (afiles && afiles.length > 0) {
					Alloy.Globals.NavGroup.openWindow(Alloy.createController("paperList", {
						files : afiles,
						title:"资质证书"
					}).getView());
				} else {
					alert('没有相关记录。');
				}
			});
		}
	}
});
