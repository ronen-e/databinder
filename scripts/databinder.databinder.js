'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataBinder = function () {
	function DataBinder(viewModel) {
		_classCallCheck(this, DataBinder);

		this.view = document;
		this.viewModel = viewModel;
		this.pubSub = $(viewModel);
		this.dataAttr = 'bind-' + viewModel.objectId;
		this.viewSelector = '[data-' + this.dataAttr + ']'; // bindings in the form: data-bind-<objectId>='{"key": "value"}'
	}

	_createClass(DataBinder, [{
		key: 'applyBindings',
		value: function applyBindings() {

			// listen to view events
			applyViewBindings(this, this.viewModel, this.view);

			// listen to view model events
			applyViewModelBindings(this, this.viewModel);

			// apply initial state
			applyInitialState(this, this.viewModel);
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

function applyViewBindings(dataBinder, viewModel, view) {
	var viewSelector = dataBinder.viewSelector,
	    dataAttr = dataBinder.dataAttr;

	$(view).on(viewEventTypes, viewSelector, function domEvent(event) {
		if (!dataBinder.domEvent) {
			dataBinder.domEvent = domEvent;
		}

		var $el = $(this);
		var bindings = data(this, dataAttr);
		var objectId = viewModel.objectId;

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

function applyViewModelBindings(dataBinder, viewModel) {
	var pubSub = dataBinder.pubSub,
	    viewSelector = dataBinder.viewSelector,
	    dataAttr = dataBinder.dataAttr;
	var objectId = viewModel.objectId;

	// listen to view change  events

	pubSub.on(objectId + ':view:' + CHANGE, function viewChange(event, key, val) {
		viewModel.update(key, val);
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

function applyInitialState(dataBinder, viewModel) {
	var viewSelector = dataBinder.viewSelector,
	    dataAttr = dataBinder.dataAttr;

	$(viewSelector).each(function (i, el) {
		_.forOwn(data(el, dataAttr), function (key) {
			var val = viewModel.get(key);

			if (!_.isUndefined(val)) {
				dataBinder.trigger(viewModel.objectId + ':model:' + CHANGE, [key, val]);
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