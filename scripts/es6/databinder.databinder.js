(function($, _) {
    class DataBinder {
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

    function applyViewBindings(dataBinder, view) {
        var { viewSelector, dataAttr } = dataBinder;
        $(view).on(viewEventTypes, viewSelector, function domEvent(event) {
            if (!dataBinder.domEvent) {
                dataBinder.domEvent = domEvent;
            }

            var el = this;
            var $el = $(el);
            var bindings = data(el, dataAttr);
            var { objectId } = dataBinder;

            // exit if element or target has no bindings
            if (!bindings) {
                return;
            }

            _.forOwn(bindings, (key, binding) => {
                var module = _.get(DataBinder.Bindings, `view.${binding}`);
                if (module && module.eventType === event.type) {
                    module.action({
                        el,
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

    function applyViewModelBindings(dataBinder) {
        var { pubSub, viewSelector, dataAttr, objectId } = dataBinder;

        // listen to view change  events
        pubSub.on(objectId + ':view:' + CHANGE, function viewChange(event, key, val) {
            dataBinder.update(key, val);
        });

        // listen to model change events
        pubSub.on(objectId + ':model:' + CHANGE, function modelChange(event, key, val) {
            $(viewSelector).each(function updateDOM(i, el) {
                _.forOwn(data(el, dataAttr), function(bindKey, binding) {
                    var module = _.get(DataBinder.Bindings, 'model.' + binding);
                    if (module && key === bindKey) {
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

    function applyInitialState(dataBinder) {
        var { viewSelector, dataAttr, objectId } = dataBinder;
        $(viewSelector).each((i, el) => {
            _.forOwn(data(el, dataAttr), (key) => {
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

    DataBinder.Events = {
        CHANGE: 'change',
        CLICK: 'click'
    };
    DataBinder.Bindings = Object.create(null);
    DataBinder.assign = (bindings) => Object.assign(DataBinder.Bindings, bindings);

    // Values
    const { CHANGE, CLICK } = DataBinder.Events;
    var viewEventTypes = [CHANGE, CLICK].join(' ');

    window.DataBinder = DataBinder;
})(jQuery, _);