var expect = chai.expect;
describe('ViewModel', function() {
    var vm;

    beforeEach(function() {
        jQuery('#test-main').html(
            '<input id="bind-value" placeholder="bind-value" type="text" data-bind-f=\'{"value": "cat"}\' /><br>' +
            '<input id="bind-fn" placeholder="bind-fn" type="text" data-bind-f=\'{"fn": "log"}\' /><br>' +
            '<input id="bind-disabled" placeholder="bind-disabled" type="text" data-bind-f=\'{"disabled": "disabled"}\' /><br>' +
            '<p><button id="bind-click" data-bind-f=\'{"click": "log"}\' >Log</button></p>' +

            '<input id="bind-value1" placeholder="value - HTML" type="text" data-bind-f=\'{"value": "cat1"}\' /><br>' +
            '<p id="bind-html" data-bind-f=\'{"html": "cat1"}\'><i>html</i></p>' +

            '<input id="bind-value2" placeholder="value - TEXT" type="text" data-bind-f=\'{"value": "cat2"}\' /><br>' +
            '<p id="bind-text" data-bind-f=\'{"text": "cat2"}\'><i>text</i></p>' +

            '<p><input id="bind-checked" placeholder="bind-checked" type="checkbox" data-bind-f=\'{"checked": "checked"}\' /></p>' +
            '<p id="bind-show" data-bind-f=\'{"show": "show"}\'>show</p>' +

            '<input id="bind-test" placeholder="Test" type="text" data-bind-f=\'{"test": "test"}\' /><br>'
        );

        try {
            vm.removeEventListeners();
        } catch (e) {}

        vm = new ViewModel('f');
        vm.applyBindings();
    });

    it('should set and get new state', function() {
        vm.set('cat', 'kitty');
        expect(vm.get('cat')).to.equal('kitty');
        expect(vm.state.cat).to.equal('kitty');
    });

    it('should update state (different value)', function() {
        vm.set('cat', 'kitty');

        var spy = sinon.spy(vm, 'set');
        vm.update('cat', 'felix');
        expect(vm.get('cat')).to.equal('felix');
        expect(spy.called).to.be.true;
    });

    it('should not update state (same value)', function() {
        vm.set('cat', 'kitty');

        var spy = sinon.spy(vm, 'set');
        vm.update('cat', 'kitty');
        expect(vm.get('cat')).to.equal('kitty');
        expect(spy.called).to.be.false;
    });

    it('should trigger method with same name as event type (without arguments)', function() {
        vm.log = function log() {};
        var spy = sinon.spy(vm, 'log');
        vm.pubSub.trigger('log', [1, 2]);
        expect(spy.called).to.be.true;
        expect(spy.args[0].length).to.equal(0);
        delete vm.log;
    });

    it('should trigger method with same name as event type with "on" prefix (with arguments)', function() {
        vm.onlog = function log() {};
        var spy = sinon.spy(vm, 'onlog');
        vm.pubSub.trigger('log', [1, 2]);
        expect(spy.called).to.be.true;
        expect(spy.args[0].length).to.equal(3);
        expect(spy.args[0][1]).to.equal(1);
        delete vm.onlog;
    });

    describe('Data Binding', function() {

        it('binding: click - should trigger view-model method on DOM click event', function() {
            vm.onlog = function log() {};
            var spy = sinon.spy(vm, 'onlog');
            jQuery('#bind-click').trigger('click');
            expect(spy.called).to.be.true;
            vm.onlog.restore();
        });

        it('binding: fn - should trigger view-model method on DOM change event', function() {
            vm.onlog = function log() {};
            var spy = sinon.spy(vm, 'onlog');
            jQuery('#bind-fn').trigger('change');
            expect(spy.called).to.be.true;
            vm.onlog.restore();
        });

        it('binding: value - should update state after DOM was changed', function() {
            jQuery('#bind-value').val('kitty1');
            jQuery('#bind-value').trigger('change');

            expect(vm.get('cat')).to.equal('kitty1');
        });

        it('binding: value - should update DOM after state was changed', function() {
            vm.update('cat', 'kitty2')
            expect(jQuery('#bind-value').val()).to.equal('kitty2');
        });

        it('binding: html', function() {
            var el = document.getElementById('bind-html');
            var oldHTML = el.innerHTML;
            jQuery('#bind-value1').val('<b>kitty3</b>').trigger('change');
            expect(oldHTML).to.equal('<i>html</i>');
            expect(el.innerHTML).to.equal('<b>kitty3</b>');
            expect(el.firstChild.nodeName).to.equal('B');
        });

        it('binding: text', function() {
            var el = document.getElementById('bind-text');
            var text = jQuery('#bind-text').text();
            jQuery('#bind-value2').val('<b>kitty4</b>').trigger('change');
            expect(text).to.equal('text');
            expect(jQuery('#bind-text').text()).to.equal('<b>kitty4</b>');
            expect(el.firstChild.nodeName).to.equal('#text');
        });

        it('binding: checked - should toggle checkbox checked state', function() {
            var $el = jQuery('#bind-checked');
            var checked1 = $el.prop('checked');
            $el.prop('checked', true);
            $el.trigger('change');
            var checked2 = vm.get('checked');
            vm.update('checked', false);
            var checked3 = $el.prop('checked');

            expect(checked1).to.be.false;
            expect(checked2).to.be.true;
            expect(checked3).to.be.false;
            expect(vm.get('checked')).to.be.false;
        });

        it('binding: show - should toggle DOM display mode', function() {
            var el = document.getElementById('bind-show');
            var display1 = el.style.display;
            vm.update('show', false);
            var display2 = el.style.display;
            vm.update('show', true);
            var display3 = el.style.display;

            expect(display1).to.not.equal('none');
            expect(display2).to.equal('none');
            expect(display3).to.not.equal('none');
        });

        it('binding: disabled - should toggle input disabled mode', function() {
            var el = document.getElementById('bind-disabled');
            var disabled1 = el.disabled;
            vm.update('disabled', true);
            var disabled2 = el.disabled;
            vm.update('disabled', false);
            var disabled3 = el.disabled;

            expect(disabled1).to.be.false;
            expect(disabled2).to.be.true;
            expect(disabled3).to.be.false;
        });
    });
});