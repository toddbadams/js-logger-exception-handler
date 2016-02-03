(function () {
    'use strict';

    angular.module('ipg.logging', ['ng'])
        .config(config)
        .constant('loggingDebugEnabled', true)
		.factory('loggingService', loggingService);

    /**
     * Module configuration
     */
    config.$inject = ['$logProvider', 'loggingDebugEnabled'];
    function config($logProvider, loggingDebugEnabled) {
        $logProvider.debugEnabled(loggingDebugEnabled);
    }

    /**
     * The logging service
     */
    loggingService.$inject = ['$log', 'loggingDebugEnabled'];
    function loggingService($log, debugEnabled) {

        function log(method, message, data, source, isFatal) {
            if (debugEnabled) {
                // log to angular
                $log[method]({
                    message: message,
                    data: data,
                    source: source
                });
            } else {
                // todo: Post to backend
                
            }
        }

        function logger(source) {
            return {
                debug: function (message, data) {
                    return log('debug', message, data, source);
                },
                error: function (message, data, isFatal) {
                    return log('error', message, data, source, isFatal);
                }
            };
        }

        return {
            logger: logger
        }
    }
})();