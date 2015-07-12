# me.wslong.tiTabs

## Overview

Was me.wslong.tiTabGroupCrossPlatform, an iOS-like Cross-Platform Tab Group for Titanium

This widget is initially based on the [com.mcongrove.tabs](https://github.com/mcongrove/com.mcongrove.tabs), with more configurable and improved features for iOS, Android and Mobile Web.

For Demo project please check [Demo for me.wslong.tiTabs](http://github.com/Shallong/me.wslong.tiTabGroupCrossPlatform).

The default height for this widget is 60dp, position's bottom is set to 0dp, which are inherited from the based project.

## Screenshots

* iPhone

![iPhone](https://raw.githubusercontent.com/Shallong/me.wslong.tiTabGroupCrossPlatform/master/screenshots/tiTabGroup-iphone6.png)

## Features

* Same layouts for cross-platform
* Configurable default/active icon, tab foreground/background colors switch
* Badge number (in red background with white number) for each tab, min-value is 1, max-value is 99
* Badge dot (in red) for each tab

## Usage

1, Put the widget inside the container

```<Require type="widget" src="me.wslong.tiTabs" id="myTabGroup" />```

2, Init a tab array, `id` must be unique, `title` is the tab title, `icon` for the default icon of the tab, `activeIcon` for the tab when is clicked and focused

```
var tabs = [{
  id : 0,
  title : "One",
  icon : "/1_979797_72x72.png",
  activeIcon : "/1_fa5050_72x72.png"
}, {
  id : 1,
  title : "Two",
  icon : "/2_979797_72x72.png",
  activeIcon : "/2_fa5050_72x72.png"
}, {
  id : 2,
  title : "Three",
  icon : "/3_979797_72x72.png",
  activeIcon : "/3_fa5050_72x72.png"
}, {
  id : 3,
  title : "Four",
  icon : "/4_979797_72x72.png",
  activeIcon : "/4_fa5050_72x72.png"
}];
```

3, Call the `init` method

```
$.myTabGroup.init({
  nodes : tabs,
  backgroundColor : "#ffffff",
  activeBackgroundColor : "#ffffff"
});
```

4, Set the active index, index is the `id` parameter from tab array

```
$.myTabGroup.setIndex(0);
```

## Methods & Parameters

* `init`
	* `nodes`: structure like above
	* `fontColor`: default title label color, #979797 by default
	* `fontActiveColor`: active title label color, #fa5050 by default
	* `fontFamily`: title label customized font family
	* `borderBackgroundColor`: set the top border of the tab group, #000000 by default
	* `backgroundColor`: set the background color of each tab, #ffffff by default
	* `activeBackgroundColor`: set the active background color of each tab, #ffffff by default
	* `tabClickCallback`: customized callback method after tab is clicked, `id` of the tab is passed back
* `setTabBadgeNumber`
	* First parameter is the `id` of the tab
	* Second parameter is the number to show
* `setTabBadgeDot`
	* First parameter is the `id` of the tab
	* Second parameter is the flag, `true` to show, `false` to hide

## Changelogs

* 2.1: "More" tab implementation
* 2.0: Refactor
* 1.2: API & Style adjustments
* 1.1: Initial version with documentation
* 1.0: Initial commit

## License
<pre>
Copyright 2015 Shallong

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
</pre>
