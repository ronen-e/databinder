'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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