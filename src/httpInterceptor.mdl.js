(function () {
    'use strict';

    var UNAUTHORIZED_STATE = 'unauthorized',
        FATAL_STATE = 'fatal',
        TEMPLATE_FOLDER = 'src/templates';

    angular.module('ipg.httpErrorInterceptor', ['ui.router', 'timer'])
        .config(moduleConfig)
        .controller('unauthorized', Unauthorized)
        .controller('fatal', Fatal)
		.factory('httpErrorInterceptor', Interceptor);

    /**
     * Module configuration
     */
    moduleConfig.$inject = ['$stateProvider'];
    function moduleConfig($stateProvider) {
        $stateProvider
                  .state(UNAUTHORIZED_STATE, {
                      url: '/unauthorized',
                      templateUrl: TEMPLATE_FOLDER + 'unauthorized.html',
                      controller: Unauthorized,
                      controllerAs: 'vm'
            });
        $stateProvider
                  .state(FATAL_STATE, {
                      url: '/badthingshappen',
                      templateUrl: TEMPLATE_FOLDER + 'fatalerror.html',
                      controller: Fatal,
                      controllerAs: 'vm'
                  });
    }

    /**
     * The HTTP Error Interception Service
     */
    Interceptor.$inject = ['$state'];
    function Interceptor($state) {

        var publicApi = {
            responseError: responseError
        };

        function responseError(response) {
            switch (response.status) {
                case 400:
                    return error400(response);
                case 401:
                    return error401(response);
                case 403:
                    return error403(response);
                case 404:
                    return error404(response);
                default:
                    return error500(response);
            }
        }

        // Bad Request - This may or may not be fatal, leave it
        //  to the calling function to decide
        function error400(response) {
            return response;
        }

        // Unauthorized - FATAL ERROR, goto unauthorized route
        function error401(response) {
            $state.go(UNAUTHORIZED_STATE);
        }

        // Forbidden - FATAL ERROR, goto FatalError route
        //    We should never get here in production, this is developer bug.
        function error403(response) {
            // todo:  get previous state by placing it as a param on this state
            $state.go(FATAL_STATE);
        }

        // Not Found - FATAL ERROR, goto FatalError route
        //    We should never get here in production, this is developer bug.
        function error404(response) {
            // todo:  get previous state by placing it as a param on this state
            $state.go(FATAL_STATE);
        }

        // Server Error - FATAL ERROR, goto FatalError route
        //    We should never get here in production, this is developer bug.
        function error500(response) {
            // todo:  get previous state by placing it as a param on this state
            $state.go(FATAL_STATE);
        }

        return publicApi;
    }

    /**
     * Unauthorized user 
     */
    Unauthorized.$inject = ['$state'];
    function Unauthorized($state) {
        var vm = this;
        
        function finished() {
            $state.go('login');
        }

        (function() {
            vm.finished = finished;
        })();
    }


    /**
     * Fatal Error user 
     */
    Fatal.$inject = ['$state'];
    function Fatal() {
        var vm = this;

        function finished() {
            // todo: store time of fatal error into local storage
            // todo:  if error continues, go to another page "Nope can't continue" then logout
            // todo:  get previous state by placing it as a param on this state
            $state.go('login');
        }

        (function () {
            vm.finished = finished;
        })();
    }
})();