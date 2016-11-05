(function($, _) {

    function ViewModel(objectId) {
        this.objectId = objectId;
        this.state = Object.create(null);
        this.dataBinder = new DataBinder(this);
    }

    _.assign(ViewModel.prototype, {
        applyBindings: function applyBindings() {
            this.dataBinder.applyBindings();
        },

        get: function get(key) {
            return _.get(this.state, key);
        },

        set: function set(key, val) {
            return _.set(this.state, key, val);
        },

        update: function update(key, val) {
            if (this.get(key) !== val) {
                this.set(key, val);
                this.dataBinder.trigger(this.objectId + ':model:change', [key, val]);
            }
            return val;
        }
    });

    // add Array functionality e.g ViewModel.push('key', item1, item2) 
    ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'slice', 'unshift'].forEach(function(method) {
        ViewModel.prototype[method] = function(key) {
            var val = this.get(key).slice();
            var args = Array.prototype.slice.call(arguments, 1);
            Array.prototype[method].apply(val, args);

            return this.update(key, val);
        };
    });

    window.ViewModel = ViewModel;

})(jQuery, _);