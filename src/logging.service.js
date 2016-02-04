(function () {
    'use strict';

    angular.module('ipg.logging', [])
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

        function error(message, data, source, exception, isFatal) {
            if (debugEnabled) {
                // log to angular
                $log.error({
                    message: message,
                    data: data,
                    source: source,
                    excpetion: exception,
                    isFatal: isFatal
                });
            } else {
                // todo: Post to backend

            }
        }

        function debug( message, data, source) {
            if (debugEnabled) {
                // log to angular
                $log.debug({
                    message: message,
                    data: data,
                    source: source
                });
            }
        }

        function logger(source) {
            return {
                debug: function (message, data) {
                    return debug(message, data, source);
                },
                error: function (message, data, exception, isFatal) {
                    return error(message, data, source, exception, isFatal);
                }
            };
        }

        return {
            logger: logger
        }
    }
})();