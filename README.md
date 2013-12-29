angularPrime
============

Integration of PrimeUI into AngularJS


> This documentation is under construction


Wiki
--------
[see here](https://github.com/primeui-extensions/angularPrime/wiki)


Roadmap
--------

__Version 0.6__

+ Custom content for items of puiDropdown, puiListbox and puiPicklist widgets
+ Tag versions of the directives with binding attribute for the configuration (first step in mimic PrimeFaces syntax)
+ PrimeUI 1.1 code alignment
+ Allow selection of widgets in download
+ Basic documentation of widgets
+ ...

See also [issue list](https://github.com/primeui-extensions/angularPrime/issues?milestone=2)

__Version 0.7__

+ Support for all attributes of PrimeFaces
+ PrimeUI xx code alignment
+ Detailed documentation of widgets
+ ...

Getting started
------------------

### css
 Add the following stylesheets to you html.

```html
 	<link rel="stylesheet" href="css/libs/angularPrime-0.5/angularPrime-0.5.css">
	<link rel="stylesheet" href="css/jquery-ui.css" />
``` 

### javascript files
 AngularPrime is build on top of JQuery and JQuery UI. So the required files are:

```html
 	<script src="js/libs/primeUI/jquery.js"></script>
 	<script src="js/libs/primeUI/jquery-ui.js"></script>

 	<script src="js/libs/angular/angular.js"></script>
	<script src="js/libs/angularPrime-0.5/angularPrime-0.5.js"></script>
``` 

### AngularJS module usage
  AngularPrime is an AngularJS module, so you need it as dependency for your application.

```javascript
 	var demo = angular.module('demo', ['angular.prime']);
``` 

### AngularPrime Directives
  AngularPrime has many directives for his widgets.  See the [demo](http://angularprime.appspot.com) for the basic usage.
  
