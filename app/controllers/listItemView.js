var args = arguments[0] || {};
$.image.image="/images/product_small.jpg";
if (args.image) {
	$.image.image = args.image;
}
if (args.title) {
	$.lblTitle.text = args.title;
}
if (args.line1) {
	$.lblLine1.text = args.line1;
}
if (args.line2) {
	$.lblLine2.text = args.line2;
}
if (args.line3) {
	$.lblLine3.text = args.line3;
}
