(function() {

    var CHANGE = 'change';
    var CLICK = 'click';

    function Binding(action, eventType) {
        return {
            action: action,
            eventType: eventType
        }
    }

    var view = {
        value: Binding(function(p) {
            p.dataBinder.trigger(p.eventName, [p.key, p.$el.val()], p.event);
        }, CHANGE),
        html: Binding(function(p) {
            p.dataBinder.trigger(p.eventName, [p.key, p.$el.html()], p.event);
        }, CHANGE),
        text: Binding(function(p) {
            p.dataBinder.trigger(p.eventName, [p.key, p.$el.text()], p.event);
        }, CHANGE),
        checked: Binding(function(p) {
            p.dataBinder.trigger(p.eventName, [p.key, p.$el.prop('checked')], p.event);
        }, CHANGE),
        fn: Binding(function(p) {
			var eventName = p.key;
            p.dataBinder.trigger(eventName, null, p.event);
        }, CHANGE),
        click: Binding(function(p) {
			var eventName = p.key;
            p.dataBinder.trigger(eventName, null, p.event);
        }, CLICK)
    };

    var model = {
        value: Binding(function(p) {
            p.$el.val(p.val);
        }),
        html: Binding(function(p) {
            p.$el.html(p.val);
        }),
        text: Binding(function(p) {
            p.$el.text(p.val);
        }),
        checked: Binding(function(p) {
            p.$el.prop('checked', p.val);
        }),
        show: Binding(function(p) {
            p.$el.toggle(p.val);
        }),
        disabled: Binding(function(p) {
            p.$el.prop('disabled', p.val);
        })
    };

    DataBinder.assign({
        view: view,
        model: model
    });

})();