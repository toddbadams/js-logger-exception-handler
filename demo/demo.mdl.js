(function () {
    'use strict';

    angular.module('demo', [
        'demo.person.controller',
        'demo.home',
        'demo.login',
        'ipg.httpErrorInterceptor',
        'ipg.globalExceptionHandler'
    ]);
})();