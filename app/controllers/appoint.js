var args = arguments[0] || {};
var http = require("http");

$.navBar.showBack(function() {
	Alloy.Globals.NavGroup.closeWindow($.mainWindow);
});


$.btnAppoint.addEventListener("click",function(){
	var phone=$.appointPhone.value;
	var address=$.appointZone.value;
	if(!phone||!address){
		alert('请输入你的手机号码和详细地址。');
		return;
	}
	Alloy.Globals.Loading.show();
		http.request({
			url : AppointUrl,
			format : "JSON",
			type : "POST",
			data : {
				"orderForm.phone" : phone,
				"orderForm.address":address,
				"orderForm.servicetype":args.service,
				"orderForm.des":"APP预约"
			},
			success : function(data) {
				Alloy.Globals.Loading.hide();
				$.cAppoint.moveNext();
			},
			failure : function(error) {
				alert("网络错误，请重试。");
				Alloy.Globals.Loading.hide();
			}
		});
	
});

$.btnBack.addEventListener("click",function() {
	Alloy.Globals.NavGroup.closeWindow($.mainWindow);
});