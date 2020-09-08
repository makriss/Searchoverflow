app = angular.module('stackModule', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller('apiCtrl', ['$scope', 'restApi', '$log', function(scope, restApi, $log) {
    console.log("Roar");
    window.scope = scope;
    scope.filters = {};
    scope.questionsListing = [];
    scope.currentPage = 1;
    scope.maxSize = 5;
    scope.bigTotalItems = 175;
    scope.bigCurrentPage = 1;
    scope.itemsPerPage = 5;

    scope.toggleFiltersDisplay = function(event) {
        elm = $("#filters-box");
        if (elm.is(":hidden"))
            elm.slideDown();
        else
            elm.slideUp();
    }

    scope.callApi = function(filters) {
        console.log(filters);
        let promise = restApi.stackApi(filters);
        promise.then(function(data) {
            console.log(data.data);
            scope.questionsListing = data.data.items;
            scope.totalItems = data.data.items.length;
            scope.getPageListing();

        }, function(data) {
            console.error(data);
        })
    }

    scope.getPageListing = function(page) {
        page = page || scope.currentPage;
        let pagedData = scope.questionsListing.slice(
            (page - 1) * scope.itemsPerPage,
            page * scope.itemsPerPage
        );
        scope.questions = pagedData;
    }

    scope.setPage = function(pageNo) {
        scope.currentPage = pageNo;
    };

    scope.pageChanged = function() {
        $log.log('Page changed to: ' + scope.currentPage);
        console.log(scope.currentPage);
    };




}])