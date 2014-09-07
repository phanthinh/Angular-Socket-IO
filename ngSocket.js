angular.module('ngSocket', []).factory('$socket', ['$rootScope', function ($rootScope) {
    if (typeof socket === 'undefined') {
      var socket = io.connect();
    }
    var angularCallback = function (callback) {
      return function () {
        if (callback) {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        }
      };
    };

    var addListener = function (name, scope, callback) {
		if (arguments.length === 2) {
			scope = null;
			callback = (typeof arguments[1] == "undefined") ? arguments[1] : null;
		}

		socket.addListener(name, angularCallback(callback));

		if (scope !== null) {
			scope.$on('$destroy', function () {
				removeListener(name, callback);
			});
		}
    };

    var addListenerOnce = function (name, callback) {
		socket.once(name, angularCallback(callback));
    };

    var removeListener = function (name, callback) {
		socket.removeListener(name, angularCallback(callback));
    };

    var removeAllListeners = function (name) {
		socket.removeAllListeners(name);
    };

    var emit = function (name, data, callback) {
		socket.emit(name, data, angularCallback(callback));
    };

    return {
		addListener: addListener,
		on: addListener,
		once: addListenerOnce,
		removeListener: removeListener,
		removeAllListeners: removeAllListeners,
		emit: emit
    };
}]);
