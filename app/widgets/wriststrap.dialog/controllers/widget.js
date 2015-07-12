var animation = require('alloy/animation');
var args = arguments[0] || {};

// Required
var content = args.content;

// Optional
var animate = args.animate || false;
var fade = args.fade || false;
var contentHeight = args.contentHeight || Ti.Platform.displayCaps.platformHeight;

var hiddenHeight = '-' + contentHeight + 'dp';

$.container.height = Ti.Platform.displayCaps.platformHeight - 20;
$.container.add(content);

// Animated dialog
if (animate && !fade) {
    $.container.top = hiddenHeight;
    $.widget.addEventListener("open", function() {
        if (OS_ANDROID)
            $.widget.activity.actionBar.hide();
        animateOpen();
    });
}

// Fade dialog
if (fade && !animate) {
    $.container.opacity = 0;
    $.widget.addEventListener("open", function() {
        fadeInOpen();
    });
}

$.widget.open({
    animated : false
});

// animatedOpen and fadeInOpen are called automatically when the widgets open()
// function is called

function animateOpen() {
    setTimeout(function() {
        $.container.animate(Ti.UI.createAnimation({
            top : "40%",
            duration : 300
        }));
    }, 50);
}

function fadeInOpen() {
    setTimeout(function() {
        animation.fadeIn($.container, 300);
    }, 50);
}

// Parent controller must call the corresponding animateClose or fadeOutClose.

function animateClose() {
    var animateClosing = Ti.UI.createAnimation({
        top : hiddenHeight,
        duration : 300
    });
    animateClosing.addEventListener("complete", function() {
        $.widget.close();
    });
    var animateHide = Ti.UI.createAnimation({
        opacity : 0,
        duration : 300
    });
    $.container.animate(animateClosing);
    $.widget.animate(animateHide);
}

$.widget.animateClose = animateClose;

function fadeOutclose() {
    animation.fadeOut($.container, 300, function() {
        $.widget.close();
    });
}

$.widget.fadeOutclose = fadeOutclose;
