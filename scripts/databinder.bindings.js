'use strict';

function Binding(action, eventType) {
	return {
		action: action,
		eventType: eventType
	};
}

var defaultBindings = {};
defaultBindings.view = {
	value: Binding(function (_ref) {
		var dataBinder = _ref.dataBinder,
		    eventName = _ref.eventName,
		    key = _ref.key,
		    $el = _ref.$el,
		    event = _ref.event;

		dataBinder.trigger(eventName, [key, $el.val()], event);
	}, CHANGE),

	html: Binding(function (_ref2) {
		var dataBinder = _ref2.dataBinder,
		    eventName = _ref2.eventName,
		    key = _ref2.key,
		    $el = _ref2.$el,
		    event = _ref2.event;

		dataBinder.trigger(eventName, [key, $el.html()], event);
	}, CHANGE),

	text: Binding(function (_ref3) {
		var dataBinder = _ref3.dataBinder,
		    eventName = _ref3.eventName,
		    key = _ref3.key,
		    $el = _ref3.$el,
		    event = _ref3.event;

		dataBinder.trigger(eventName, [key, $el.text()], event);
	}, CHANGE),

	checked: Binding(function (_ref4) {
		var dataBinder = _ref4.dataBinder,
		    eventName = _ref4.eventName,
		    key = _ref4.key,
		    $el = _ref4.$el,
		    event = _ref4.event;

		dataBinder.trigger(eventName, [key, $el.prop('checked')], event);
	}, CHANGE),

	fn: Binding(function (_ref5) {
		var dataBinder = _ref5.dataBinder,
		    eventName = _ref5.eventName,
		    key = _ref5.key,
		    event = _ref5.event;

		var eventName = key;
		dataBinder.trigger(eventName, null, event);
	}, CHANGE),

	click: Binding(function (_ref6) {
		var dataBinder = _ref6.dataBinder,
		    eventName = _ref6.eventName,
		    key = _ref6.key,
		    event = _ref6.event;

		var eventName = key;
		dataBinder.trigger(eventName, null, event);
	}, CLICK)
};

defaultBindings.model = {
	value: Binding(function (_ref7) {
		var $el = _ref7.$el,
		    val = _ref7.val;

		$el.val(val);
	}),
	html: Binding(function (_ref8) {
		var $el = _ref8.$el,
		    val = _ref8.val;

		$el.html(val);
	}),
	text: Binding(function (_ref9) {
		var $el = _ref9.$el,
		    val = _ref9.val;

		$el.text(val);
	}),
	checked: Binding(function (_ref10) {
		var $el = _ref10.$el,
		    val = _ref10.val;

		$el.prop('checked', val);
	}),
	show: Binding(function (_ref11) {
		var $el = _ref11.$el,
		    val = _ref11.val;

		$el.toggle(val);
	}),
	disabled: Binding(function (_ref12) {
		var $el = _ref12.$el,
		    val = _ref12.val;

		$el.prop('disabled', val);
	})
};