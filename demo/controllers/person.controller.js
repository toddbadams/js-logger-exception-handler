(function () {
    'use strict';

    var TEMPLATE_BASE_URL = 'controllers/';

    angular.module('demo.person.controller', [
            'ui.router',
            'ipg.logging',
            'demo.data',
            's.person.directive'
    ])
        .constant('demo.person.controller.config', {
            route: {
                name: 'person',
                state: {
                    url: '/person',
                    templateUrl: TEMPLATE_BASE_URL + 'person.html',
                    //template: '<p>hi</p>',
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
        return personDataService.getPerson(1);
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