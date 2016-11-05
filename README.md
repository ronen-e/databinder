# Data Binder

A simple 2 way data binding implementation.

It uses jQuery for its PubSub and DOM manipulation functionality & Lodash as a utilities library.

Prerequisites:

* jQuery
* Lodash

## Usage:
### HTML
```html
<input type="text" data-bind-objectid='{"value":"name"}' />
Name: <span data-bind-objectid='{"text":"name"}'></span>

```
### JS
```js
// create view model instance with id
var vm = new ViewModel('objectid');

// apply bindings
vm.applyBindings();

```


## Notes:
### View: 
This implementation uses the document object as the view object by default.

This means all DOM events which bubble up to the document will be checked for any bindings on the event target.

### ViewModel
The ViewModel instance contains both the application data (via `this.state`) and the pubSub functionality (via `this.databinder.pubSub`).
