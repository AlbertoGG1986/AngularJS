(function() {
    var myApp = angular.module("API", ['angularUtils.directives.dirPagination']);

    myApp.controller("MTGController", function($scope, $http, $log, $filter) {
        $scope.vista = true;
        $scope.esconder = true;
        $scope.set = sets[4];
        $scope.selectedItem = sets[4];
        $scope.sets = sets;
        getJson();

        function getJson() {
            $http.get("https://api.scryfall.com/cards/search?q=set%3A" + $scope.set.code)
                .then(function(response) {
                    $scope.cartas1 = response.data.data;
                    $http.get(response.data.next_page).then(function(response) {
                        $scope.cartas2 = response.data.data;
                        $scope.cartas = $scope.cartas1.concat($scope.cartas2);
                        $log.info($scope.cartas);
                        $scope.counted = $scope.cartas.length;
                        $scope.$watch("search", function(query) {
                            $scope.counted = $filter("filter")($scope.cartas, query).length;
                        });
                        $scope.totalItems = $scope.cartas.length;
                        $scope.currentPage = 1;
                    });
                });
        };
        $scope.update = function() {
            $scope.set.code = $scope.selectedItem.code;
            getJson();
        };

        $scope.clear = function() {
            $scope.search = {};
            $scope.orden = 'name';
            $scope.vista = true;
        };

        $scope.reloadRoute = function() {
            location.reload();
        }

    });

    myApp.controller('TabsController', function($scope) {
        $scope.currentTab = 0;
        $scope.setCurrentTab = function(newCurrent) {
            $scope.currentTab = newCurrent;
        };
        $scope.isCurrent = function(aTab) {
            if (aTab == $scope.currentTab)
                return true;
            else
                return false;
        }
    });

    myApp.controller('GalleryController', function($scope) {
        $scope.current = 0;
        $scope.setCurrent = function(newCurrent) {
            $scope.current = newCurrent;
        };
    });

    myApp.directive('gallery', function() {
        return {
            restrict: 'E',
            templateUrl: 'MTGgallery.html'
        }
    });

    var sets = [{
        name: 'Guilds of Ravnica',
        code: 'grn'
    }, {
        name: 'Ravnica Allegiance',
        code: 'rna'
    }, {
        name: 'War of the Spark',
        code: 'war'
    }, {
        name: 'Core Set 2020',
        code: 'm20'
    }, {
        name: 'Throne of Eldraine',
        code: 'eld'
    }, {
        name: 'Theros Beyond Death',
        code: 'thb'
    }];
})();