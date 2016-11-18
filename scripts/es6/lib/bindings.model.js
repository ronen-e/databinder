import Binding from './binding';

var model = {
	value: Binding(({ el, val }) => {
		el.value = val;
	}),
	html: Binding(({ el, val }) => {
		el.innerHTML = val;
	}),
	text: Binding(({ el, val }) => {
		el.textContent = val;
	}),
	checked: Binding(({ el, val }) => {
		el.checked = val;
	}),
	show: Binding(({ $el, val }) => {
		$el.toggle(val);
	}),
	disabled: Binding(({ el, val }) => {
		el.disabled = val;
	})
};

export default model;
