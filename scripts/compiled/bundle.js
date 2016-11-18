'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    function Binding(action, eventType) {
        return { action: action, eventType: eventType };
    }

    var CHANGE = 'change';
    var CLICK = 'click';
    var viewEventTypes = [CHANGE, CLICK].join(' ');

    var view = {
        value: Binding(function (_ref) {
            var dataBinder = _ref.dataBinder,
                eventName = _ref.eventName,
                key = _ref.key,
                el = _ref.el,
                event = _ref.event;

            dataBinder.trigger(eventName, [key, el.value], event);
        }, CHANGE),

        html: Binding(function (_ref2) {
            var dataBinder = _ref2.dataBinder,
                eventName = _ref2.eventName,
                key = _ref2.key,
                el = _ref2.el,
                event = _ref2.event;

            dataBinder.trigger(eventName, [key, el.innerHTML], event);
        }, CHANGE),

        text: Binding(function (_ref3) {
            var dataBinder = _ref3.dataBinder,
                eventName = _ref3.eventName,
                key = _ref3.key,
                el = _ref3.el,
                event = _ref3.event;

            dataBinder.trigger(eventName, [key, el.textContent], event);
        }, CHANGE),

        checked: Binding(function (_ref4) {
            var dataBinder = _ref4.dataBinder,
                eventName = _ref4.eventName,
                key = _ref4.key,
                el = _ref4.el,
                event = _ref4.event;

            dataBinder.trigger(eventName, [key, el.checked], event);
        }, CHANGE),

        fn: Binding(function (_ref5) {
            var dataBinder = _ref5.dataBinder,
                key = _ref5.key,
                event = _ref5.event;

            dataBinder.trigger(key, null, event);
        }, CHANGE),

        click: Binding(function (_ref6) {
            var dataBinder = _ref6.dataBinder,
                key = _ref6.key,
                event = _ref6.event;

            dataBinder.trigger(key, null, event);
        }, CLICK)
    };

    var model = {
        value: Binding(function (_ref7) {
            var el = _ref7.el,
                val = _ref7.val;

            el.value = val;
        }),
        html: Binding(function (_ref8) {
            var el = _ref8.el,
                val = _ref8.val;

            el.innerHTML = val;
        }),
        text: Binding(function (_ref9) {
            var el = _ref9.el,
                val = _ref9.val;

            el.textContent = val;
        }),
        checked: Binding(function (_ref10) {
            var el = _ref10.el,
                val = _ref10.val;

            el.checked = val;
        }),
        show: Binding(function (_ref11) {
            var $el = _ref11.$el,
                val = _ref11.val;

            $el.toggle(val);
        }),
        disabled: Binding(function (_ref12) {
            var el = _ref12.el,
                val = _ref12.val;

            el.disabled = val;
        })
    };

    var Bindings = { view: view, model: model };

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

    DataBinder.Bindings = Bindings;
    DataBinder.assign = function (bindings) {
        return Object.assign(DataBinder.Bindings, bindings);
    };

    function applyViewBindings(dataBinder, view) {
        var viewSelector = dataBinder.viewSelector,
            dataAttr = dataBinder.dataAttr;

        $(view).on(viewEventTypes, viewSelector, function domEvent(event) {
            if (!dataBinder.domEvent) {
                dataBinder.domEvent = domEvent;
            }

            var el = this;
            var $el = $(el);
            var bindings = data(el, dataAttr);
            var objectId = dataBinder.objectId;

            // exit if element or target has no bindings

            if (!bindings) {
                return;
            }

            _.forOwn(bindings, function (key, binding) {
                var module = _.get(DataBinder.Bindings, 'view.' + binding);
                if (module && module.eventType === event.type) {
                    module.action({
                        el: el,
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
                    var module = _.get(DataBinder.Bindings, 'model.' + binding);
                    if (module && key === bindKey) {
                        module.action({
                            el: el,
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

    var ViewModel = function (_DataBinder) {
        _inherits(ViewModel, _DataBinder);

        function ViewModel(objectId) {
            _classCallCheck(this, ViewModel);

            var _this = _possibleConstructorReturn(this, (ViewModel.__proto__ || Object.getPrototypeOf(ViewModel)).call(this, objectId));

            _this.state = Object.create(null);
            return _this;
        }

        _createClass(ViewModel, [{
            key: 'get',
            value: function get(key) {
                return _.get(this.state, key);
            }
        }, {
            key: 'set',
            value: function set(key, val) {
                return _.set(this.state, key, val);
            }
        }, {
            key: 'update',
            value: function update(key, val) {
                if (this.get(key) !== val) {
                    this.set(key, val);
                    this.trigger(this.objectId + ':model:change', [key, val]);
                }
                return val;
            }
        }]);

        return ViewModel;
    }(DataBinder);

    // add Array functionality e.g ViewModel.push('key', item1, item2) 


    ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'slice', 'unshift'].forEach(function (method) {
        Object.defineProperty(ViewModel.prototype, method, {
            value: function value(key) {
                var val = this.get(key).slice();

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                Array.prototype[method].apply(val, args);
                return this.update(key, val);
            }
        });
    });

    window.ViewModel = ViewModel;
})();
//# sourceMappingURL=bundle.js.map
