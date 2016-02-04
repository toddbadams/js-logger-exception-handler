(function () {
    'use strict';

    // Place response models here
    var
        first = 'John',
        last = 'Smith',
        dob = '1990-08-24';


    angular.module('demo.person.data', ['ngMockE2E', 'ipg.logging', 'ipg.httpErrorInterceptor', 'demo.config'])
		.factory('dataService', dataService)
    .run(backEndMock);


    backEndMock.$inject = ['$httpBackend', 'loggingService'];
    function backEndMock($httpBackend, loggingService) {
        var logger = loggingService.logger('person Controller');

        // pass through in app files
        $httpBackend.whenGET('person/templates/person.html').passThrough();
        $httpBackend.whenGET('person/templates/person-edit.html').passThrough();
        $httpBackend.whenGET('/src/templates/unauthorized.html').passThrough();
        $httpBackend.whenGET('/src/templates/fatalerror.html').passThrough();

        $httpBackend.whenGET('http://localhost:56429/api/person/1')
                    .respond(function (method, url, data, headers) {
                        logger.debug('HTTP Response', {
                            method: method,
                            url: url,
                            data: data,
                            headers: headers
                        });
                        return [500, {
                            id: 1,
                            first: first,
                            last: last,
                            dob: dob
                        }, {}];
                    });
        $httpBackend.whenPUT('http://localhost:56429/api/person/1')
                    .respond(function (method, url, data, headers) {
                        logger.debug('HTTP Response', {
                            method: method,
                            url: url,
                            data: data,
                            headers: headers
                        });
                        return [400, {
                            id: data.id,
                            first: data.first,
                            last: data.last,
                            dob: data.dob
                        }, {}];
                    });
    }

    /**
     * The data service
     */
    dataService.$inject = ['$q', '$http', 'loggingService'];
    function dataService($q, $http, loggingService) {
        var logger = loggingService.logger('person data service');

        function getPerson(id) {
            return $http({
                    method: 'GET',
                    url: 'http://localhost:56429/api/person/1'
                }).
                then(function(result) {
                    var p = new Person(result.data);
                    logger.debug('getPerson id=' + id, p);
                    return p;
                });
        }

        function updatePerson(id, person) {
            return $http({
                method: 'PUT',
                url: 'http://api.samples.com/person/' + id,
                data: person.toPutModel()
            }).
                then(function (result) {
                    var p = new Person(result.data);
                    logger.debug('updatePerson id=' + id, p);
                    return p;
                });
        }

        function createPerson(data) {
            return new Person(data);
        }


        return {
            getPerson: getPerson,
            updatePerson: updatePerson,
            createPerson: createPerson
        }
    }

    var Person = (function () {
        var p = function (data) {
            this.first = data.first;
            this.last = data.last;
            this.dob = new Date(data.dob);
            this.day = this.dob.getDay();
            this.month = this.dob.getMonth();
            this.year = this.dob.getFullYear();
            this.onChange();
            return this;
        }
        p.prototype.age = function (date) {
            var ageDifMs = date - this.dob;
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        p.prototype.onChange = function () {
            this.full = this.first + ' ' + this.last;
            this.dob = new Date(this.year, this.month, this.day);
            if (isNaN(this.dob)) {
                throw new PersonException('Invalid Date of Birth', this);
            }
            this.currentAge = this.age(new Date());
        }
        p.prototype.toPutModel = function () {
            return {
                first: this.first,
                last: this.last,
                dob: this.dob.toString()
            }
        }
        p.prototype.copy = function () {
            return new Person({
                first: this.first,
                last: this.last,
                dob: !isNaN(this.dob) ? this.dob.toString() : null
            });
        }

        function PersonException(message, person) {
            this.message = message;
            this.name = 'PersonException';
            this.data = person;
        }
        PersonException.prototype = new Error();
        PersonException.prototype.constructor = PersonException;

        return p;
    })();
})();