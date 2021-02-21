angular.module("wovyn_sensor_profile", []).controller("MainCtrl", [
    "$scope",
    "$http",
    function ($scope, $http) {
        $scope.eci = "ckk95j1it00317su4ftug7i38";

        $scope.getTemperatureThreshold = function () {
            var gURL = "http://192.168.1.114:3000/sky/cloud/" + $scope.eci + "/sensor_profile/get_temperature_threshold";
            $http.get(gURL).then(function (response) {
                console.log(response);
                var threshold = parseInt(response.data)
                $scope.temperatureThreshold = threshold;
            })
        }

        $scope.getToNumber = function () {
            var gURL = "http://192.168.1.114:3000/sky/cloud/" + $scope.eci + "/sensor_profile/get_to_number";
            $http.get(gURL).then(function (response) {
                console.log(response);
                var number = parseInt(response.data);
                $scope.toNumber = response.data;
            })
        }

        $scope.getSensorLocation = function () {
            var gURL = "http://192.168.1.114:3000/sky/cloud/" + $scope.eci + "/sensor_profile/get_sensor_location";
            $http.get(gURL).then(function (response) {
                console.log(response);
                var location = response.data.substring(1, response.data.lastIndexOf("\""));
                $scope.sensorLocation = location;
            })
        }

        $scope.getSensorName = function () {
            var gURL = "http://192.168.1.114:3000/sky/cloud/" + $scope.eci + "/sensor_profile/get_sensor_name";
            $http.get(gURL).then(function (response) {
                console.log(response);
                var name = response.data.substring(1, response.data.lastIndexOf("\""));
                $scope.sensorName = name;
            })
        }

        $scope.updateProfile = function () {
            var pURL = "http://192.168.1.114:3000/sky/event/" + $scope.eci + "/updateProfile/sensor/profile_updated";
            var query = "?";
            if ($scope.sensorLocation) {
                query = query + "location=" + encodeURI($scope.sensorLocation) + "&";
            }
            if ($scope.sensorName) {
                query = query + "sensor_name=" + encodeURI($scope.sensorName) + "&";
            }
            if ($scope.temperatureThreshold) {
                query = query + "temperature_threshold=" + encodeURI($scope.temperatureThreshold) + "&";
            }
            if ($scope.toNumber) {
                query = query + "to_number=" + encodeURI($scope.toNumber) + "&";
            }
            query = query.substring(0, query.length-1);
            console.log(pURL + query);
            $http.post(pURL + query).then(function(response){
                $scope.retrieveProfile();
            })
        }

        $scope.retrieveProfile = function () {
            $scope.getTemperatureThreshold();
            $scope.getToNumber();
            $scope.getSensorLocation();
            $scope.getSensorName();
        }

        $scope.retrieveProfile();

    },
]);