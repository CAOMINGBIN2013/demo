exports.getUserById = function(id) {
	return Ti.App.Properties.getObject("user" + id, null);
};
exports.getCurrentUser = function() {
	var id = Ti.App.Properties.getInt("currentuser", 0);
	return exports.getUserById(id);
};
exports.setUser = function(user) {
	Ti.App.Properties.setObject("user" + user.id, user);
};
exports.setCurrentUser = function(id) {
	Ti.App.Properties.setInt("currentuser", id);
};
exports.logout = function() {
	exports.setCurrentUser(0);
};

exports.addHistory = function(obj, type) {
	var list = Ti.App.Properties.getList("list" + type, []);
	if (!_.find(list, function(i) {
		return i.id == obj.id;
	})) {
		list.push(obj);
		Ti.App.Properties.setList("list" + type, list);
	};

};
exports.getHistories = function(type) {
	return Ti.App.Properties.getList("list" + type, null);
};
