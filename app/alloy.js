// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
Alloy.Globals.NavGroup = {};
Alloy.Globals.FirstWindow = {};

var WEBAPI_BASE = "http://120.24.250.75";
var FILE_BASE = WEBAPI_BASE + "/files/";
var SearchBarcode_url = WEBAPI_BASE + "/myRepport_getProductByCondition.m?products.productcode=";
var SearchProductByName = WEBAPI_BASE + "/myRepport_getProductByProductName.m?products.productname=";
var LoginUrl = WEBAPI_BASE + "/user_login.m?individual.username=$$&individual.password=$$";
var SearchAll = WEBAPI_BASE + "/myRepport_allQueryByKeyword.m";
var SearchNews = WEBAPI_BASE + "/myRepport_queryNesByCondition.m";
var GetSupplierById = WEBAPI_BASE + "/myRepport_getSupplierInformation.m";
var AppointUrl = WEBAPI_BASE + "/myRepport_placeOrder.m";
var ExposureUrl = WEBAPI_BASE + "/myRepport_fabuByExposure.m";
var GetAgentById = WEBAPI_BASE + "/myRepport_getQsupplierInformation.m";
var SearchAgentByCity = WEBAPI_BASE + "/myRepport_getQsupplierInformationByConditionLike.m";
var SearchAgentByName = WEBAPI_BASE + "/myRepport_getQsupplierInformationByConditionNameLike.m";
var SearchAgentByNengLi = WEBAPI_BASE + "/myRepport_getQsupplierInformationByNengLI.m";
var SearchAgentNengli=WEBAPI_BASE+"/myRepport_getQsupplierJianCheNengLi.m";

Alloy.Globals.Loading = Alloy.createWidget("nl.fokkezb.loading");
//Alloy.Globals.Loading.progress=false;

var toast = Alloy.createWidget('nl.fokkezb.toast', 'global', {
	// defaults
});
Alloy.Globals.toast = toast.show;
// same as toast.info
Alloy.Globals.error = toast.error;
// applies the 'error' theme

Alloy.Globals.bottomTabs = [];

Alloy.Globals.formatString = function(inputstring, formatValues) {
	_.each(formatValues, function(i) {
		inputstring = inputstring.replace("$$", i);
	});
	return inputstring;
};
Alloy.Globals.formatDate = function(inputDate) {
	if (inputDate) {
		return (inputDate.year + 1900) + "-" + (inputDate.month + 1) + "-" + inputDate.date;
	}
	return '';
};
Alloy.Globals.formatFileUrl = function(files, type) {
	if (!type) {
		if (files.length) {
			return FILE_BASE + files[0].fileurl;
		}
	} else {
		var file = _.find(files, function(f) {
			return f.type == type;
		});
		if (file) {
			return FILE_BASE +file.fileurl;
		}
	}
	return '/images/gs_logo.png';
};
