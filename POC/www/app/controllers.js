(function () {
    "use strict";

    angular.module("myapp.controllers", [])

    .controller("appCtrl", ["$scope", function ($scope) {
    }])
    .controller("homeCtrl", ["$scope", "$state", "$http", "$ionicPopup","$ionicLoading", function ($scope, $state, $http, $ionicPopup,$ionicLoading) {
        
        $scope.refresh = function () {
            //refresh binding
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.data = {
            lot: ''
        };
        $scope.Submit = function () {
            $ionicLoading.show({template: "Processing..."});
            $http.get('http://10.252.201.52/apitest/test/ValidateLot?container=' + $scope.data.lot).then(function (res) {
                console.log(res);
                if (res.data.IsSuccess !== undefined) {
                    $scope.data.result = res.data.Message;
                    $scope.data.style = 'Success';
                }
                else if (res.data.ExceptionData !== undefined) {
                    $scope.data.result = res.data.ExceptionData.Description;
                    $scope.data.style = 'Fail';
                }
                else {
                    $scope.data.result = "Connection Error!";
                    $scope.data.style = 'Error';
                }
                $ionicLoading.hide();
                $ionicPopup.alert({ title: $scope.data.style, template: $scope.data.result });
            }, function (err) {
                $scope.data.result = "Connection Error!";
                $scope.data.style = 'Error';
                console.log(err);
                $ionicLoading.hide();
            });
        };
    }])
    .controller("stockerTxnCtrl", ["$scope", "$state", "$http", "$ionicPopup","$ionicLoading", function ($scope, $state, $http, $ionicPopup,$ionicLoading) {
        $scope.refresh = function () {
            //refresh binding
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.data = {
            lot: ''
        };
        $scope.Submit = function () {
            var reqData = {
                Container: $scope.data.lot,
                Stocker: $scope.data.stocker,
                Comments: $scope.data.Comments,
                TxnType: $scope.stockerInBt === 'button-positive'?'IN':'OUT'
            };
            $ionicLoading.show({template: "Processing..."});
            $http.get('http://10.252.201.52/apitest/test/StockerTxn?input=' + JSON.stringify(reqData)).then(function (res) {
                console.log(res);
                if (res.data.IsSuccess !== undefined) {
                    $scope.data.result = res.data.Message;
                    $scope.data.style = 'Success';
                }
                else if (res.data.ExceptionData !== undefined) {
                    $scope.data.result = res.data.ExceptionData.Description;
                    $scope.data.style = 'Fail';
                }
                else {
                    $scope.data.result = "Connection Error!";
                    $scope.data.style = 'Error';
                }
                $ionicPopup.alert({ title: $scope.data.style, template: $scope.data.result });
                $ionicLoading.hide();
            }, function (err) {
                $scope.data.result = "Connection Error!";
                $scope.data.style = 'Error';
                console.log(err);
                $ionicLoading.hide();
            });
        };

        $scope.stockerInBt = 'button-positive';
        $scope.stockerOutBt = 'button-light';
        $scope.stockerIn = function () {
            $scope.stockerInBt = 'button-positive';
            $scope.stockerOutBt = 'button-light';
        };
        $scope.stockerOut = function () {
            $scope.stockerInBt = 'button-light';
            $scope.stockerOutBt = 'button-positive';
        };
    }])
    .controller("lotDetailCtrl", ["$scope", "$state", "$http", "$ionicPopup", "$ionicLoading", function ($scope, $state, $http, $ionicPopup, $ionicLoading) {
        $scope.refresh = function () {
            //refresh binding
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.data = {
            lot: ''
        };
        $scope.Submit = function () {
            $ionicLoading.show({ template: "Processing..." });
            $http.get('http://10.252.201.52/apitest/test/GetLotDetails?container=' + $scope.data.lot).then(function (res) {
                console.log(res);
                if (res.data.ExceptionData !== undefined) {
                    $scope.data.result = res.data.ExceptionData.Description;
                    $scope.data.style = 'Fail';
                    $ionicPopup.alert({ title: $scope.data.style, template: $scope.data.result });
                }
                else {
                    $scope.data.result = res.data;
                    $scope.data.style = 'Success';
                }
                
                $ionicLoading.hide();
            }, function (err) {
                $scope.data.result = "Connection Error!";
                $scope.data.style = 'Error';
                console.log(err);
                $ionicLoading.hide();
            })
        };
    }])
    .controller("loginCtrl", ["$scope", "$state", "$http", "$ionicPopup", "$ionicLoading", function ($scope, $state, $http, $ionicPopup, $ionicLoading) {

        $scope.refresh = function () {
            //refresh binding
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.data = {
            lot: ''
        };
        $scope.Submit = function () {
            $ionicLoading.show({ template: "Processing..." });
            var reqData = {
                Username: $scope.data.username,
                password: $scope.data.password,
            };
            $http.get('http://10.252.201.52/apitest/test/Login?input=' + JSON.stringify(reqData)).then(function (res) {
                console.log(res);
                if (res.data.IsSuccess !== undefined) {
                    $scope.data.result = res.data.Message;
                    $scope.data.style = 'Success';
                    $state.go('app.home');
                }
                else if (res.data.ExceptionData !== undefined) {
                    $scope.data.result = res.data.ExceptionData.Description;
                    $scope.data.style = 'Fail';
                }
                else {
                    $scope.data.result = "Connection Error!";
                    $scope.data.style = 'Error';
                }
                $ionicLoading.hide();
                $ionicPopup.alert({ title: $scope.data.style, template: $scope.data.result });
            }, function (err) {
                $scope.data.result = "Connection Error!";
                $scope.data.style = 'Error';
                console.log(err);
                $ionicLoading.hide();
            });
        };
    }])
    .controller("errorCtrl", ["$scope", "myappService", function ($scope, myappService) {
        //public properties that define the error message and if an error is present
        $scope.error = "";
        $scope.activeError = false;

        //function to dismiss an active error
        $scope.dismissError = function () {
            $scope.activeError = false;
        };

        //broadcast event to catch an error and display it in the error section
        $scope.$on("error", function (evt, val) {
            //set the error message and mark activeError to true
            $scope.error = val;
            $scope.activeError = true;

            //stop any waiting indicators (including scroll refreshes)
            myappService.wait(false);
            $scope.$broadcast("scroll.refreshComplete");

            //manually apply given the way this might bubble up async
            $scope.$apply();
        });
    }]);
})();