var args = arguments[0] || {};
$.image.image="/images/product_small.jpg";
if (args.image) {
	$.image.image = args.image;
}
if (args.title) {
	$.lblTitle.text = args.title;
}

