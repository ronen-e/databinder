function Binding(action, eventType) {
	return {
		action,
		eventType
	}
}

const defaultBindings = {};
defaultBindings.view = {
	value: Binding(function({ dataBinder, eventName, key, $el, event }) {
		dataBinder.trigger(eventName, [key, $el.val()], event);
	}, CHANGE),
	
	html: Binding(function({ dataBinder, eventName, key, $el, event }) {
		dataBinder.trigger(eventName, [key, $el.html()], event);
	}, CHANGE),
	
	text: Binding(function({ dataBinder, eventName, key, $el, event }) {
		dataBinder.trigger(eventName, [key, $el.text()], event);
	}, CHANGE),
	
	checked: Binding(function({ dataBinder, eventName, key, $el, event }) {
		dataBinder.trigger(eventName, [key, $el.prop('checked')], event);
	}, CHANGE),
	
	fn: Binding(function({ dataBinder, eventName, key, event }) {
		var eventName = key;
		dataBinder.trigger(eventName, null, event);
	}, CHANGE),
	
	click: Binding(function({ dataBinder, eventName, key, event }) {
		var eventName = key;
		dataBinder.trigger(eventName, null, event);
	}, CLICK)
};

defaultBindings.model = {
	value: Binding(function({ $el, val }) {
		$el.val(val);
	}),
	html: Binding(function({ $el, val }) {
		$el.html(val);
	}),
	text: Binding(function({ $el, val }) {
		$el.text(val);
	}),
	checked: Binding(function({ $el, val }) {
		$el.prop('checked', val);
	}),
	show: Binding(function({ $el, val }) {
		$el.toggle(val);
	}),
	disabled: Binding(function({ $el, val }) {
		$el.prop('disabled', val);
	})
};
