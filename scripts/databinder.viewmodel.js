'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewModel = function () {
	function ViewModel(objectId) {
		_classCallCheck(this, ViewModel);

		this.objectId = objectId;
		this.state = Object.create(null);
		this.dataBinder = new DataBinder(this);
	}

	_createClass(ViewModel, [{
		key: 'applyBindings',
		value: function applyBindings() {
			this.dataBinder.applyBindings();
		}
	}, {
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
				this.dataBinder.trigger(this.objectId + ':model:change', [key, val]);
			}
			return val;
		}
	}]);

	return ViewModel;
}();

// add Array functionality e.g ViewModel.push('key', item1, item2) 


['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'slice', 'unshift'].forEach(function (method) {
	ViewModel.prototype[method] = function (key) {
		var val = this.get(key).slice();

		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}

		Array.prototype[method].apply(val, args);

		return this.update(key, val);
	};
});

window.ViewModel = ViewModel;