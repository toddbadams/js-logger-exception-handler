(function () {
    'use strict';

    angular.module('demo.config', [
    ])
    .constant('ipgConfig', {
        apiBasePath: 'http://localhost:8065/api'
    });
})();