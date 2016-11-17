import DataBinder from './databinder.databinder';

class ViewModel extends DataBinder {

    constructor(objectId) {
        super(objectId)
        this.state = Object.create(null);
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
            this.trigger(this.objectId + ':model:change', [key, val]);
        }
        return val;
    }
}

// add Array functionality e.g ViewModel.push('key', item1, item2) 
['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'slice', 'unshift'].forEach(method => {
    Object.defineProperty(ViewModel.prototype, method, {
        value: function(key, ...args) {
            var val = this.get(key).slice();
            Array.prototype[method].apply(val, args);
            return this.update(key, val);
        }
    });
});

export default ViewModel;
