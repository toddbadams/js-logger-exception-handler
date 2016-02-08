(function () {
    'use strict';

    angular.module('ipg.httpErrorInterceptor', ['ui.router', 'timer'])
        .constant('ipg.httpErrorInterceptor.config', {
            unauthorizedRoute: {
                name: 'unauthorized',
                state: {
                    url: '/unauthorized',
                    templateUrl: '/src/templates/unauthorized.html',
                    controller: Unauthorized,
                    controllerAs: 'vm'
                }
            },
            fatalErrordRoute: {
                name: 'fatal',
                state: {
                    url: '/badthingshappen',
                    templateUrl: '/src/templates/fatalerror.html',
                    controller: Fatal,
                    controllerAs: 'vm'
                }
            }
        })
        .config(moduleConfig)
        .controller('unauthorized', Unauthorized)
        .controller('fatal', Fatal)
        .factory('httpErrorInterceptor', Interceptor);


    /**
     * Module configuration
     */
    moduleConfig.$inject = ['$stateProvider', '$httpProvider', 'ipg.httpErrorInterceptor.config'];
    function moduleConfig($stateProvider, $httpProvider, config) {
        $stateProvider.state(config.unauthorizedRoute.name, config.unauthorizedRoute.state);
        $stateProvider.state(config.fatalErrordRoute.name, config.fatalErrordRoute.state);
        $httpProvider.interceptors.push('httpErrorInterceptor');
    }

    /**
     * The HTTP Error Interception Service
     */
    Interceptor.$inject = ['$location', 'ipg.httpErrorInterceptor.config'];
    function Interceptor($location, config) {

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
            throw new httpException(response, config.unauthorizedRoute.state.url);
        }

        // Forbidden - FATAL ERROR, goto FatalError route
        //    We should never get here in production, this is developer bug.
        function error403(response) {
            throw new httpException(response, config.fatalErrordRoute.state.url);
        }

        // Not Found - FATAL ERROR, goto FatalError route
        //    We should never get here in production, this is developer bug.
        function error404(response) {
            throw new httpException(response, config.fatalErrordRoute.state.url);
        }

        // Server Error - FATAL ERROR, goto FatalError route
        //    We should never get here in production, this is developer bug.
        function error500(response) {
            throw new httpException(response, config.fatalErrordRoute.state.url);
        }

        return publicApi;
    }

    var httpException = function (response, url) {
        this.message = response.status + ' ' + response.statusText;
        this.data = response;
        this.url = url;
        this.name = 'httpException';
    }
    httpException.prototype = new Error();
    httpException.prototype.constructor = httpException;

    /**
     * Unauthorized user 
     */
    Unauthorized.$inject = ['$state'];
    function Unauthorized($state) {
        var vm = this;

        function finished() {
            $state.go('login');
        }

        (function () {
            vm.finished = finished;
        })();
    }


    /**
     * Fatal Error user 
     */
    Fatal.$inject = ['$state'];
    function Fatal($state) {
        var vm = this;

        function finished() {
            // todo: store time of fatal error into local storage
            // todo:  if error continues, go to another page "Nope can't continue" then logout
            // todo:  get previous state by placing it as a param on this state
            $state.go('home');
        }

        (function () {
            vm.finished = finished;
        })();
    }
})();