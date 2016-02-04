(function () {
    'use strict';

    angular.module('demo', [
        'demo.person.controller'
        //'s.person.directive' //,
     //   'ipg.logging',
     //   'ipg.httpErrorInterceptor'
    ])
    .value('ipgConfig', {
        apiBasePath: 'http://localhost:8065/api'
    })
    .run(function($state) {
        window.state = $state;
           // $state.go('person');
        });

})();