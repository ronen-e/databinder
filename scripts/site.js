/**
 *  Note about jQuery triggering events on an object.
 *  example: triggering event: "log"
 *  if the object has a method "log" => it will be called without any arguments
 *  if the object has a method "onlog" => it will be called with the jQuery event object and any passed arguments
 */

var vm = new ViewModel('f');
vm.applyBindings();
