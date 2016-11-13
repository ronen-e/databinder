'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataBinder = function () {
	function DataBinder(objectId) {
		_classCallCheck(this, DataBinder);

		this.objectId = objectId;
		this.view = document;
		this.pubSub = $(this);
		this.dataAttr = 'bind-' + objectId;
		this.viewSelector = '[data-' + this.dataAttr + ']'; // bindings in the form: data-bind-<objectId>='{"key": "value"}'
	}

	_createClass(DataBinder, [{
		key: 'applyBindings',
		value: function applyBindings() {

			// listen to view events
			applyViewBindings(this, this.view);

			// listen to view model events
			applyViewModelBindings(this);

			// apply initial state
			applyInitialState(this);
		}
	}, {
		key: 'trigger',
		value: function trigger(eventName, args, originalEvent) {
			var event = originalEvent ? $.Event(eventName, { originalEvent: originalEvent }) : eventName;
			this.pubSub.trigger(event, args);
		}
	}, {
		key: 'removeEventListeners',
		value: function removeEventListeners() {
			var view = this.view,
			    viewSelector = this.viewSelector,
			    domEvent = this.domEvent,
			    pubSub = this.pubSub;

			$(view).off(viewEventTypes, viewSelector, domEvent);
			pubSub.off();
		}
	}]);

	return DataBinder;
}();

function applyViewBindings(dataBinder, view) {
	var viewSelector = dataBinder.viewSelector,
	    dataAttr = dataBinder.dataAttr;

	$(view).on(viewEventTypes, viewSelector, function domEvent(event) {
		if (!dataBinder.domEvent) {
			dataBinder.domEvent = domEvent;
		}

		var $el = $(this);
		var bindings = data(this, dataAttr);
		var objectId = dataBinder.objectId;

		// exit if element or target has no bindings

		if (!bindings) {
			return;
		}

		_.forOwn(bindings, function (key, binding) {
			var module = _.get(DataBinder.bindings, 'view.' + binding);
			if (module && module.eventType === event.type) {
				module.action({
					$el: $el,
					dataBinder: dataBinder,
					event: event,
					eventName: objectId + ':view:' + event.type,
					key: key
				});
			}
		});
	});
}

function applyViewModelBindings(dataBinder) {
	var pubSub = dataBinder.pubSub,
	    viewSelector = dataBinder.viewSelector,
	    dataAttr = dataBinder.dataAttr,
	    objectId = dataBinder.objectId;

	// listen to view change  events

	pubSub.on(objectId + ':view:' + CHANGE, function viewChange(event, key, val) {
		dataBinder.update(key, val);
	});

	// listen to model change events
	pubSub.on(objectId + ':model:' + CHANGE, function modelChange(event, key, val) {
		$(viewSelector).each(function updateDOM(i, el) {
			_.forOwn(data(el, dataAttr), function (bindKey, binding) {
				var module = _.get(DataBinder.bindings, 'model.' + binding);
				if (module && key === bindKey) {
					module.action({
						$el: $(el),
						key: key,
						val: val
					});
				}
			});
		});
	});
}

function applyInitialState(dataBinder) {
	var viewSelector = dataBinder.viewSelector,
	    dataAttr = dataBinder.dataAttr,
	    objectId = dataBinder.objectId;

	$(viewSelector).each(function (i, el) {
		_.forOwn(data(el, dataAttr), function (key) {
			var val = dataBinder.get(key);

			if (!_.isUndefined(val)) {
				dataBinder.trigger(objectId + ':model:' + CHANGE, [key, val]);
			}
		});
	});
}

function data(el, dataAttr) {
	return $(el).data(dataAttr);
}

DataBinder.bindings = Object.create(null);
DataBinder.assign = function (bindings) {
	return Object.assign(DataBinder.bindings, bindings);
};
DataBinder.assign(defaultBindings);

window.DataBinder = DataBinder;