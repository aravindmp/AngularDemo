_spBodyOnLoadFunctionNames.push("callAngularBootstrap");
(function () {
    "use strict";
    var homeapp = angular.module('Seq-SafetyTip-app', []);
    homeapp.controller("LatestSafetyTipController", LatestSafetyTipController);
    function LatestSafetyTipController($scope ,$http,$q) {

        function getItems(webRelativeUrl) {
            var deferred = $q.defer();            
                $http({
                    method: "GET",
                    url: "http://sp2016/sites/seqtest" + "/" + webRelativeUrl,
                    headers: { 'Accept': 'application/json;odata=verbose' }
                }).success(function (data) {
                    //$log.log("Data service - Got Web list items")
                    deferred.resolve(data.d.results);
                }).error(function (data, status) {
                    deferred.reject(data);
                });      

            return deferred.promise;
        }
        getItems("_api/web/lists/getByTitle('Latest Safety Tip')/items?$select=SeqwaterSafetyTipContent,SeqwaterSafetyTipURL")
                   .then(getSafetyTipSuccess, getSafetyTipError);
        function getSafetyTipSuccess(data) {
            $scope.SafetyTip = [];
            angular.forEach(data, function (item, index) {            
                $scope.SafetyTip.push(item);            
            });
        }
        function getSafetyTipError(reason) {
            console.log(JSON.stringify(reason));
        }
    }
    var homeapp1 = angular.module("Seq-favlinks-app", [])
    homeapp1.controller("FavLinksController", FavLinksController);
    function FavLinksController($scope, $http, $q) {
        function getItems(webRelativeUrl) {
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: "http://sp2016/sites/seqtest" + "/" + webRelativeUrl,
                headers: { 'Accept': 'application/json;odata=verbose' }
            }).success(function (data) {
                //$log.log("Data service - Got Web list items")
                deferred.resolve(data.d.results);
            }).error(function (data, status) {
                deferred.reject(data);
            });

            return deferred.promise;
        }
        getItems("_api/web/lists/getByTitle('tt1')/items?$select=URL")
                   .then(getFavouriteLinksSuccess, getFavouriteLinksError);
        function getFavouriteLinksSuccess(data) {
            $scope.favLinks = [];
            angular.forEach(data, function (item, index) {
                $scope.favLinks.push(item);
            });
        }
        function getFavouriteLinksError(reason) {
            console.log(JSON.stringify(reason));
        }
    }

})();




function callAngularBootstrap() {
    //var angSafetyTipApp = document.getElementById("homecontainer");
    //angular.bootstrap(angSafetyTipApp, ["homepage-angularapp"]);
    var angSafetyTipApp = document.getElementById("Seq-SafetyTip");
    angular.bootstrap(angSafetyTipApp, ['Seq-SafetyTip-app']);
    var angFavLinksApp = document.getElementById("Seq-favlinks");
    angular.bootstrap(angFavLinksApp, ['Seq-favlinks-app']);
}
