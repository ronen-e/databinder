import Binding from './binding';
import {CHANGE, CLICK} from './events';

// describes how events are triggered on the databinder after changes to the DOM
// a binding matches a single DOM event (currently click and change are supported).
var view = {
	value: Binding(({ dataBinder, eventName, key, el, event }) => {
		dataBinder.trigger(eventName, [key, el.value], event);
	}, CHANGE),
	
	html: Binding(({ dataBinder, eventName, key, el, event }) => {
		dataBinder.trigger(eventName, [key, el.innerHTML], event);
	}, CHANGE),
	
	text: Binding(({ dataBinder, eventName, key, el, event }) => {
		dataBinder.trigger(eventName, [key, el.textContent], event);
	}, CHANGE),
	
	checked: Binding(({ dataBinder, eventName, key, el, event }) => {
		dataBinder.trigger(eventName, [key, el.checked], event);
	}, CHANGE),

	fn: Binding(({ dataBinder, key, event }) => {
		dataBinder.trigger(key, [], event);
	}, CHANGE),

	click: Binding(({ dataBinder, key, event }) => {
		dataBinder.trigger(key, [], event);
	}, CLICK)
};

export default view;
