(function () {
    'use strict';

    var TEMPLATE_BASE_URL = 'directives/';

    angular.module('s.person.directive', [])
        .directive('person', PersonDirective);

    PersonDirective.$inject = ['loggingService'];
    function PersonDirective(loggingService) {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            templateUrl: TEMPLATE_BASE_URL + 'person.html',
            link: link
        };

        function link(scope, element, attr) {
            var vm = scope,
                logger = loggingService.logger('person Directive $Id ' + vm.$id);

            function update() {
                try {
                    vm.ngModel.onChange();
                    logger.debug('updating', vm.ngModel);
                } catch (ex) {
                    logger.error('updating', vm.ngModel, ex, true);
                }
            }

            // controller activation
            (function () {
                vm.update = update;
                logger.debug('activated', vm);
            })();
        }
    }
})();