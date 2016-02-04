(function () {
    'use strict';

    angular.module('demo.person.directive', [])
        .directive('person', PersonDirective);

    PersonDirective.$inject = ['loggingService'];
    function PersonDirective(loggingService) {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            templateUrl: 'directives/person.html',
            link: link
        };

        function link(scope, element, attr) {
            var vm = scope,
                logger = loggingService.logger('person Directive $Id ' + vm.$id),
                personCopy;

            // validate and update model on change
            //   This example is a bit contrived, but imagine third party control here
            function update() {
                try {
                    // implements model change event
                    vm.ngModel.onChange();
                    // create a copy of the model for rollback if required
                    personCopy = vm.ngModel.copy();
                    logger.debug('updating', vm.ngModel);
                } catch (ex) {
                    // throw non-fatal error
                    logger.error('updating', vm.ngModel, ex, false);
                    // rollback
                    vm.ngModel = personCopy;
                    logger.debug('rolling back', vm.ngModel);
                }
            }

            // directive activation
            (function () {
                vm.update = update;
                personCopy = vm.ngModel.copy();
                logger.debug('activated', vm);
            })();
        }
    }
})();