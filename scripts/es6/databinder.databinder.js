class DataBinder {
	constructor(viewModel) {
		this.view = document;
		this.viewModel = viewModel;
		this.pubSub = $(viewModel);
		this.dataAttr = `bind-${viewModel.objectId}`;
		this.viewSelector = `[data-${this.dataAttr}]`;  // bindings in the form: data-bind-<objectId>='{"key": "value"}'
	}
	
	applyBindings() {

		// listen to view events
		applyViewBindings(this, this.viewModel, this.view);

		// listen to view model events
		applyViewModelBindings(this, this.viewModel);

		// apply initial state
		applyInitialState(this, this.viewModel);
	}

	trigger(eventName, args, originalEvent) {
		var event = originalEvent ? $.Event(eventName, { originalEvent }) : eventName;
		this.pubSub.trigger(event, args);
	}

	removeEventListeners() {
		var { view, viewSelector, domEvent, pubSub } = this;
		$(view).off(viewEventTypes, viewSelector, domEvent);
		pubSub.off();
	}	
}

function applyViewBindings(dataBinder, viewModel, view) {
	var { viewSelector, dataAttr } = dataBinder;
	$(view).on(viewEventTypes, viewSelector, function domEvent(event) {
		if (!dataBinder.domEvent) {
			dataBinder.domEvent = domEvent;
		}

		var $el = $(this);
		var bindings = data(this, dataAttr);
		var { objectId } = viewModel;

		// exit if element or target has no bindings
		if (!bindings) {
			return;
		}

		_.forOwn(bindings, (key, binding) => {
			var module = _.get(DataBinder.bindings, `view.${binding}`);
			if (module && module.eventType === event.type) {
				module.action({
					$el,
					dataBinder,
					event,
					eventName: `${objectId}:view:${event.type}`,
					key
				});
			}
		});
	});
}

function applyViewModelBindings(dataBinder, viewModel) {
	var { pubSub, viewSelector, dataAttr } = dataBinder;
	var { objectId } = viewModel;
	
	// listen to view change  events
	pubSub.on(objectId + ':view:' + CHANGE, function viewChange(event, key, val) {
		viewModel.update(key, val);
	});

	// listen to model change events
	pubSub.on(objectId + ':model:' + CHANGE, function modelChange(event, key, val) {
		$(viewSelector).each(function updateDOM(i, el) {
			_.forOwn(data(el, dataAttr), function(bindKey, binding) {
				var module = _.get(DataBinder.bindings, 'model.' + binding);
				if (module && key === bindKey) {
					module.action({
						$el: $(el),
						key,
						val
					});
				}
			});
		});
	});
}

function applyInitialState(dataBinder, viewModel) {
	var { viewSelector, dataAttr } = dataBinder;
	$(viewSelector).each((i, el) => {
		_.forOwn(data(el, dataAttr), (key) => {
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
DataBinder.assign = (bindings) => Object.assign(DataBinder.bindings, bindings);
DataBinder.assign(defaultBindings);

window.DataBinder = DataBinder;
