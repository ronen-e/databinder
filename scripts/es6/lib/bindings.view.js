import Binding from './binding';
import {CHANGE, CLICK} from './events';

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
		dataBinder.trigger(key, null, event);
	}, CHANGE),

	click: Binding(({ dataBinder, key, event }) => {
		dataBinder.trigger(key, null, event);
	}, CLICK)
};

export default view;
