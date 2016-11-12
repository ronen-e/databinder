class ViewModel {

	constructor(objectId) {
		this.objectId = objectId;
		this.state = Object.create(null);
		this.dataBinder = new DataBinder(this);
	}
	
	applyBindings() {
		this.dataBinder.applyBindings();
	}

	get(key) {
		return _.get(this.state, key);
	}

	set(key, val) {
		return _.set(this.state, key, val);
	}

	update(key, val) {
		if (this.get(key) !== val) {
			this.set(key, val);
			this.dataBinder.trigger(this.objectId + ':model:change', [key, val]);
		}
		return val;
	}
}

// add Array functionality e.g ViewModel.push('key', item1, item2) 
['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'slice', 'unshift'].forEach((method) => {
	ViewModel.prototype[method] = function(key, ...args) {
		var val = this.get(key).slice();
		Array.prototype[method].apply(val, args);

		return this.update(key, val);
	};
});

window.ViewModel = ViewModel;
