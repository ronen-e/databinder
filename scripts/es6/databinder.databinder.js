import Bindings from './databinder.bindings';
import { CHANGE, CLICK, viewEventTypes } from './lib/events';
import data from './lib/data';

export default class DataBinder {
    constructor(objectId) {
        this.objectId = objectId;
        this.view = document;
        this.pubSub = $(this);
        this.dataAttr = `bind-${objectId}`;
        this.viewSelector = `[data-${this.dataAttr}]`; // bindings in the form: data-bind-<objectId>='{"key": "value"}'
    }

    applyBindings() {

        // listen to view events
        applyViewBindings(this, this.view);

        // listen to view model events
        applyViewModelBindings(this);

        // apply initial state
        applyInitialState(this);
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

DataBinder.Bindings = Bindings;
DataBinder.assign = (bindings) => Object.assign(DataBinder.Bindings, bindings);
DataBinder.get = (path) => _.get(DataBinder.Bindings, path);

function applyViewBindings(dataBinder, view) {
    var { viewSelector, dataAttr } = dataBinder;
    $(view).on(viewEventTypes, viewSelector, function domEvent(event) {
        if (!dataBinder.domEvent) {
            dataBinder.domEvent = domEvent;
        }

        var el = this;
        var $el = $(el);
        var dataBindings = data(el, dataAttr);

        // exit if element or target has no bindings
        if (!dataBindings) {
            return;
        }

        _.forOwn(dataBindings, (key, binding) => {
            var module = DataBinder.get('view.' + binding);
            if (module && module.eventType === event.type) {
                module.action({
                    el,
                    $el,
                    dataBinder,
                    event,
                    eventName: `${dataBinder.objectId}:view:${event.type}`,
                    key
                });
            }
        });
    });
}

function applyViewModelBindings(viewModel) {
    var { pubSub, viewSelector, dataAttr, objectId } = viewModel;

    // listen to view change events and trigger update
    pubSub.on(`${objectId}:view:${CHANGE}`, function viewChange(event, key, val) {
        viewModel.update(key, val);
    });

    // listen to model change events
    pubSub.on(`${objectId}:model:${CHANGE}`, function modelChange(event, key, val) {

		// apply bindings to DOM
		$(viewSelector).each(function updateDOM(i, el) {
			let dataBindings = data(el, dataAttr);
            _.forOwn(dataBindings, function(bindKey, bindName) {
				if (key !== bindKey) {
					return;
				}
				// get binding module and call module action if binding key matches
                var module = DataBinder.get('model.' + bindName);
                if (module) {
                    module.action({
                        el,
                        $el: $(el),
                        key,
                        val
                    });
                }
            });
        });
    });
}

function applyInitialState(viewModel) {
    var { viewSelector, dataAttr, objectId } = viewModel;
    $(viewSelector).each((i, el) => {
		let dataBindings = data(el, dataAttr);
		
		// iterate over bindings and trigger change on the view model
        _.forOwn(dataBindings, (key) => {
            var val = viewModel.get(key);

            if (!_.isUndefined(val)) {
                viewModel.trigger(`${objectId}:model:${CHANGE}`, [key, val]);
            }
        });
    });
}