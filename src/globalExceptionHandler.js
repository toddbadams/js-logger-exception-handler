(function() {
    'use strict';

    angular.module('ipg.globalExceptionHandler', ['ipg.logging'])
        .factory('$exceptionHandler', exceptionHandler);

    exceptionHandler.$inject = ['loggingService', '$document'];

    function exceptionHandler(loggingService, $document) {
        var logger = loggingService.logger('global exception handler');
        return function(ex, cause) {
            if (cause) {
                ex.message += ' (caused by "' + cause + '")';
            }
            logger.error('ERROR', null, ex, true);
            if (ex.url) {
                var f = 12;
                window.location = window.location.origin + window.location.pathname + '#' + ex.url;
            }
            
        };
    }
})();