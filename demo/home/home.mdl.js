(function () {
    'use strict';

    angular.module('demo.home', ['ui.router'])
        .config(moduleConfig);

    /**
     * Person controller route configuration
     */
    moduleConfig.$inject = ['$stateProvider'];
    function moduleConfig($stateProvider, config) {
        $stateProvider.state('home', {
            url: '/home',
            template: '<p>Ye Olde home Page</p>'
        });
    }
})();