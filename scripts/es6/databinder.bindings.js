(function(){
	const { CHANGE, CLICK } = DataBinder.Events;
		
	function Binding(action, eventType) {
		return { action, eventType };
	}

	var defaultBindings = {};
	defaultBindings.view = {
		value: Binding(function({ dataBinder, eventName, key, el, event }) {
			dataBinder.trigger(eventName, [key, el.value], event);
		}, CHANGE),
		
		html: Binding(function({ dataBinder, eventName, key, el, event }) {
			dataBinder.trigger(eventName, [key, el.innerHTML], event);
		}, CHANGE),
		
		text: Binding(function({ dataBinder, eventName, key, el, event }) {
			dataBinder.trigger(eventName, [key, el.textContent], event);
		}, CHANGE),
		
		checked: Binding(function({ dataBinder, eventName, key, el, event }) {
			dataBinder.trigger(eventName, [key, el.checked], event);
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
		value: Binding(function({ el, val }) {
			el.value = val;
		}),
		html: Binding(function({ el, val }) {
			el.innerHTML = val;
		}),
		text: Binding(function({ el, val }) {
			el.textContent = val;
		}),
		checked: Binding(function({ el, val }) {
			el.checked = val;
		}),
		show: Binding(function({ $el, val }) {
			$el.toggle(val);
		}),
		disabled: Binding(function({ el, val }) {
			el.disabled = val;
		})
	};

	DataBinder.assign(defaultBindings);	
})();
