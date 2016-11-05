(function($, _) {

    var CHANGE = 'change';
    var CLICK = 'click';
    var viewEventTypes = [CHANGE, CLICK].join(' ');

    function DataBinder(viewModel) {
        this.view = document;
        this.viewModel = viewModel;
        this.pubSub = $(viewModel);
        this.dataAttr = 'bind-' + viewModel.objectId;
        this.viewSelector = '[data-' + this.dataAttr + ']'; // bindings in the form: data-bind-<objectId>='{"key": "value"}'
    }

    DataBinder.bindings = Object.create(null);
    DataBinder.assign = function assign(bindings) {
        _.assign(DataBinder.bindings, bindings);
    }

    _.assign(DataBinder.prototype, {
        applyBindings: function applyBindings() {

            // listen to view events
            applyViewBindings(this, this.viewModel, this.view);

            // listen to view model events
            applyViewModelBindings(this, this.viewModel);

            // apply initial state
            applyInitialState(this, this.viewModel);
        },

        trigger: function trigger(eventName, args, originalEvent) {
            var event = originalEvent ? $.Event(eventName, { originalEvent: originalEvent }) : eventName;
            this.pubSub.trigger(event, args);
        },

        removeEventListeners: function removeEventListeners() {
            $(this.view).off(viewEventTypes, self.viewSelector, self.domEvent);
            this.pubSub.off();
        }
    });

    function applyViewBindings(dataBinder, viewModel, view) {
        $(view).on(viewEventTypes, dataBinder.viewSelector, function domEvent(event) {
            if (!dataBinder.domEvent) {
                dataBinder.domEvent = domEvent;
            }

            var $el = $(this);
            var bindings = data(this, dataBinder.dataAttr);

            // exit if element or target has no bindings
            if (!bindings) {
                return;
            }

            _.forOwn(bindings, function(key, binding) {
                var module = _.get(DataBinder.bindings, 'view.' + binding);
                if (module && module.eventType === event.type) {
                    module.action({
                        $el: $el,
                        dataBinder: dataBinder,
                        event: event,
                        eventName: viewModel.objectId + ':view:' + event.type,
                        key: key
                    });
                }
            });
        });
    }

    function applyViewModelBindings(dataBinder, viewModel) {
        // listen to view change  events
        dataBinder.pubSub.on(viewModel.objectId + ':view:' + CHANGE, function viewChange(event, key, val) {
            viewModel.update(key, val);
        });

        // listen to model change events
        dataBinder.pubSub.on(viewModel.objectId + ':model:' + CHANGE, function modelChange(event, key, val) {
            $(dataBinder.viewSelector).each(function updateDOM(i, el) {
                _.forOwn(data(el, dataBinder.dataAttr), function(bindKey, binding) {
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
        $(dataBinder.viewSelector).each(function(i, el) {
            _.forOwn(data(el, dataBinder.dataAttr), function triggerChange(key) {
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

    window.DataBinder = DataBinder;

})(jQuery, _);