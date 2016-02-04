(function () {
    'use strict';

    // Place response models here
    var
        first = 'John',
        last = 'Smith',
        dob = '1990-08-24';


    angular.module('demo.data', [])
		.factory('dataService', dataService);

    /**
     * The data service
     */
    dataService.$inject = ['$q'];
    function dataService($q) {


         function asPromise(data) {
            var deferred = $q.defer();
            deferred.resolve(data);
            return deferred.promise;
        }


        function getPerson(id) {
            return asPromise(new Person({
                id: id,
                first: first,
                last: last,
                dob: dob
            }));
        }

        function updatePerson(id, person) {
            return asPromise(new Person(person));
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

        function PersonException(message, person) {
            this.message = message;
            this.name = 'PersonException';
            this.data = person;
        }

        return p;
    })();
})();