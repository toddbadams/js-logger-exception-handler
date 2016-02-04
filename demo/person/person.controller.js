(function () {
    'use strict';

    angular.module('demo.person.controller', [
            'ui.router',
            'ipg.logging',
            'demo.person.data',
            'demo.person.directive'
    ])
        .constant('demo.person.controller.config', {
            route: {
                name: 'person',
                state: {
                    url: '/person',
                    templateUrl: 'controllers/person.html',
                    controller: PersonController,
                    controllerAs: "vm",
                    resolve:
                    {
                        data: PersonResolver
                    }
                }
            }
        })
        .config(moduleConfig)
       .factory('demo.person.controller.resolver', PersonResolver)
       .controller('Person', PersonController);

    /**
     * Person controller route configuration
     */
    moduleConfig.$inject = ['$stateProvider', 'demo.person.controller.config'];
    function moduleConfig($stateProvider, config) {
        $stateProvider.state(config.route.name, config.route.state);
    }

    /**
     * Person controller data resolver
     */
    PersonResolver.$inject = ['dataService'];
    function PersonResolver(personDataService) {
        try {
            return personDataService.getPerson(1);
        } catch (ex) {
            // throw fatal error
            logger.error('updating', vm.ngModel, ex, true);
        }
    }

    /**
     * Person controller
     */
    PersonController.$inject = ['loggingService', 'dataService', 'data'];
    function PersonController(loggingService, personDataService, personData) {
        var vm = this,
            logger = loggingService.logger('person Controller');

        function save() {
            vm.isSaving = true;
            personDataService.updatePerson(vm.person)
                .then(postSave);
        }

        function postSave() {
            vm.isSaving = false;
        }

        // controller activation
        (function () {
            vm.save = save;
            vm.isSaving = false;
            vm.person = personData;
            logger.debug('activated', vm.person);
        })();
    }
})();