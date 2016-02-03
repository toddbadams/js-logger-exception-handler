(function () {
    'use strict';

    angular.module('demo', [
        's.person.controller',
        's.data',
        's.person.directive',
        'demo.backend',
        'ipg.logging',
        'ipg.httpErrorInterceptor'
    ])
    .value('ipgConfig', {
        apiBasePath: 'http://localhost:8065'
    });

})();