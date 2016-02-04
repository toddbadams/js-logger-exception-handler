(function () {
    'use strict';

    angular.module('demo.login', ['ui.router'])
        .config(moduleConfig);

    /**
     * Person controller route configuration
     */
    moduleConfig.$inject = ['$stateProvider'];
    function moduleConfig($stateProvider, config) {
        $stateProvider.state('login', {
            url: '/login',
            template: '<p>Ye Olde Login Page</p>'
        });
    }
})();