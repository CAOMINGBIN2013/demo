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
					id : 1,
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
							files : data
						}).getView());
					} else {
						alert('没有相关记录。');
					}
				}
			});
		} else {
			var afile = _.filter(agent.fileList_, function(f) {
				return f.type != 'MY';
			});
			if (afile && afile.length > 0) {
				Alloy.Globals.NavGroup.openWindow(Alloy.createController("paperList", {
					files : afile
				}));
			} else {
				alert('没有相关记录。');
			}
		}
	}
});
