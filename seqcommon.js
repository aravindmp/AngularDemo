_spBodyOnLoadFunctionNames.push("callAngularBootstrap");
(function () {
    "use strict";
    var serviceModule = angular.module('Common-Services', []);
    serviceModule.factory('sharePointDataService', ['$log', '$q', '$http', '$timeout', function sharepointDataService($log, $q, $http, $timeout) {
        $log.log("Factory: sharepointDataService");
        var service = {
            getItems: getItems
        };
        activate();
        return service;

        var readyFlag = false;
        var webUrl;
        var siteCollectionUrl;
        function activate() {
            $log.log("sharepointDataService activate");
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
                $log.log("SP ready");
                webUrl = SP.PageContextInfo.get_webServerRelativeUrl();
                siteCollectionUrl = SP.PageContextInfo.get_siteServerRelativeUrl();
                readyFlag = true;
            });
        }
        function spVariablesReady(){
            var deferred = $q.defer();
            checkFlagReady();
            return deferred.promise;
            function checkFlagReady() {
                if (readyFlag) {
                    $log.log("SP is ready")
                    deferred.resolve();
                } else {
                    $log.log("SP not ready, waiting timeout")
                    $timeout(checkFlagReady, 100, false);
                }
            }
        }
        function getItems(webRelativeUrl) {
            var deferred = $q.defer();
            spVariablesReady().then(function(){ $http({
                method: "GET",
                url: webUrl + "/" + webRelativeUrl,
                headers: { 'Accept': 'application/json;odata=verbose' }
            }).success(function (data) {
                //$log.log("Data service - Got Web list items")
                deferred.resolve(data.d.results);
            }).error(function (data, status) {
                deferred.reject(data);
            });
        });

            return deferred.promise;
        }       

    }]);

    //Module for SafetTips
    var safetyTipsApp = angular.module('Seq-SafetyTip-Mod', ['Common-Services']);
    safetyTipsApp.controller("LatestSafetyTipController", LatestSafetyTipController);
   // LatestSafetyTipController.$inject=["$scope", "$http", "$q","sharePointDataService"];
    function LatestSafetyTipController($scope, $http, $q,$log,sharePointDataService) {

        sharePointDataService.getItems("_api/web/lists/getByTitle('Latest Safety Tip')/items?$filter=((SeqwaterSafetyTipFeatured eq 1) and (OData__ModerationStatus eq 0))&$orderby=Modified desc&$top=1&$select=SeqwaterSafetyTipContent,SeqwaterSafetyTipURL")
                   .then(getSafetyTipSuccess, getSafetyTipError);
        function getSafetyTipSuccess(data) {
            $scope.SafetyTip = [];
            angular.forEach(data, function (item, index) {            
                $scope.SafetyTip.push(item);            
            });
        }
        function getSafetyTipError(reason) {
            $log.log(JSON.stringify(reason));
        }
    }
    //Module for Favourite Links
    var favLinksApp = angular.module("Seq-FavLinks-Mod", ['Common-Services'])
    favLinksApp.controller("FavLinksController", FavLinksController);
    function FavLinksController($scope, $http, $q, $log, sharePointDataService) {
   
        sharePointDataService.getItems("_api/web/lists/getByTitle('tt1')/items?$select=URL")
                   .then(getFavouriteLinksSuccess, getFavouriteLinksError);
        function getFavouriteLinksSuccess(data) {
            $scope.favLinks = [];
            angular.forEach(data, function (item, index) {
                $scope.favLinks.push(item);
            });
        }
        function getFavouriteLinksError(reason) {
            $log.log(JSON.stringify(reason));
        }
    }

})();




function callAngularBootstrap() {
    //var angSafetyTipApp = document.getElementById("homecontainer");
    //angular.bootstrap(angSafetyTipApp, ["homepage-angularapp"]);
    var angSafetyTipApp = document.getElementById("Seq-SafetyTip");
    angular.bootstrap(angSafetyTipApp, ['Common-Services', 'Seq-SafetyTip-Mod']);
    var angFavLinksApp = document.getElementById("Seq-favlinks");
    angular.bootstrap(angFavLinksApp, ['Common-Services', 'Seq-FavLinks-Mod']);
}
