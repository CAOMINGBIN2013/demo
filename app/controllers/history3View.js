var args = arguments[0] || {};
var user = require("User");
init();

function init() {
	fillTable();
}

function fillTable() {
	var data = user.getHistories(0);
	if (!data)
		return;
		
	data=_.last(data,3);

	for (var i = 0; i < data.length; i++) {
		
		var item = data[i];
		/*
		var label = Ti.UI.createLabel({
					text:item.title,
					color:'#888787',
					height:'40dp',
					left:"10dp",
					right:"10dp"
				});*/
		
		var row= Ti.UI.createImageView({	
			borderColor:'#888787',
			borderWidth:'1dp',
			height:"80dp",
			width:"80dp",
			left:'10dp',
			image:item.image
		});
		//row.add(label);
		row.data = item;
		$.cHistory.add(row);
	}

}

$.cHistory.addEventListener("click", function(e) {
	if (e.source.data) {
		var win = Alloy.createController("productInfo", {
			barcode : e.source.data.code
		}).getView();
		Alloy.Globals.NavGroup.openWindow(win);
	}
});

