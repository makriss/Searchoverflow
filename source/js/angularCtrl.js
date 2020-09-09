app = angular.module('stackModule', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller('apiCtrl', ['$scope', 'restApi', 'processFilters', '$timeout', function(scope, restApi, processFilters, $timeout) {

    window.scope = scope;
    scope.filters = {};
    scope.questionsListing = null;
    scope.button = { text: "Search", loading: false };
    scope.pagination = {
        currentPage: 1,
        maxSize: 5,
        bigTotalItems: 175,
        bigCurrentPage: 1,
        itemsPerPage: 5
    }

    scope.toggleFiltersDisplay = function(event) {
        let elm = $("#filters-box");
        if (elm.is(":hidden"))
            elm.slideDown();
        else
            elm.slideUp();
    }

    scope.callApi = function() {
        scope.button = { text: "Fetching...", loading: true };
        let filters = JSON.parse(JSON.stringify(scope.filters));
        processFilters.format(filters);
        let promise = restApi.stackApi(filters);

        startTransition();

        promise.then(function(data) {
            scope.button = { text: "Search", loading: false };
            console.log(data.data);

            scope.questionsListing = data.data.items;
            scope.pagination.totalItems = data.data.items.length;

            scope.setPage(1);
            scope.getPageListing(1);


        }, function(data) {
            scope.button = { text: "Search", loading: false };
            console.error(data);
        })
    }

    function startTransition() {
        let elm = $("#filters-box");
        if (!elm.is(":hidden"))
            elm.slideUp();

        let box = $("div#search-box");
        if (!box.hasClass("height-auto")) {
            box.addClass("height-reduce");
            $timeout(() => {
                box.addClass("height-auto");
                box.removeClass("height-reduce");
            }, 1000)
        }
    }

    scope.getPageListing = function(page) {
        console.log(page);
        page = page || scope.pagination.currentPage;
        let pagedData = scope.questionsListing.slice(
            (page - 1) * scope.pagination.itemsPerPage,
            page * scope.pagination.itemsPerPage
        );
        scope.questions = pagedData;
    }

    scope.setPage = function(pageNo) {
        scope.pagination.currentPage = pageNo;
    };

    scope.pageChanged = function() {
        console.log(scope.pagination.currentPage);
    };




}])

app.factory('processFilters', function() {
    function formatFilters(filters) {
        for (let f in filters) {
            if (f.includes('date')) {
                filters[f] = new Date(filters[f]).getTime() / 1000;
            } else if (f == "tagged" || f == "nottagged") {
                // add check for a semicolon delimited list
            }
        }

    }

    function resetFilters(filters) {
        filters = { "order": "desc", "sort": "creation" };
    }

    return {
        format: formatFilters,
        resetFilters: resetFilters
    }

})