angular.module("pico_temperature_app", []).controller("MainCtrl", [
  "$scope",
  "$http",
  "$interval",
  function ($scope, $http, $interval) {
    $scope.temperatures = [];
    $scope.temperatureViolations = [];
    $scope.eci = "ckk95j1it00317su4ftug7i38";
    $scope.eid = "web-app"

    $scope.getTemperatures = function () {
      var getTempURL = "http://192.168.1.114:3000/sky/cloud/" + $scope.eci + "/temperature_store/temperatures";
      //console.log(getTempURL);
      return $http.get(getTempURL).then(function (response) {
        var aaData = response.data;
        var localTemps = [];
        if (aaData == "null") {
          return;
        }
        for (var i in aaData) {
          var timestamp = aaData[i].timestamp;
          var date = timestamp.substring(0, timestamp.lastIndexOf("T"));
          var time = timestamp.substring(timestamp.lastIndexOf("T") + 1, timestamp.lastIndexOf("."));

          var temp = {
            "timestamp": date + " " + time,
            "tempF": aaData[i].temperature[0].temperatureF,
            "tempC": aaData[i].temperature[0].temperatureC
          }
          localTemps.push(temp)
        }
        localTemps.sort(compareTime);
        //console.log(localTemps);
        $scope.temperatures = localTemps;
      });
    }

    $scope.getTemperaturesViolations = function () {
      var getTempURL = "http://192.168.1.114:3000/sky/cloud/" + $scope.eci + "/temperature_store/temperature_violations";
      //console.log(getTempURL);
      return $http.get(getTempURL).then(function (response) {
        var aaData = response.data;
        var localTemps = [];
        if (aaData == "null") {
          return;
        }
        for (var i in aaData) {
          var timestamp = aaData[i].timestamp;
          var date = timestamp.substring(0, timestamp.lastIndexOf("T"));
          var time = timestamp.substring(timestamp.lastIndexOf("T") + 1, timestamp.lastIndexOf("."));

          var temp = {
            "timestamp": date + " " + time,
            "tempF": aaData[i].temperature[0].temperatureF,
            "tempC": aaData[i].temperature[0].temperatureC
          }
          localTemps.push(temp)
        }
        localTemps.sort(compareTime);
        //console.log(localTemps);
        $scope.temperatureViolations = localTemps;
      });
    }

    compareTime = function (a, b) {
      // Compare Timestamps and put the latest time first
      var aTime = a.timestamp;
      var bTime = b.timestamp;
      if (aTime < bTime) {
        return 1;
      }
      if (aTime > bTime) {
        return -1;
      }
      return 0;
    }

    $scope.retrieveData = function () {
      $scope.getTemperatures();
      $scope.getTemperaturesViolations();
    }

    $scope.resetTemperatures = function () {
      var resetURL = "http://192.168.1.114:3000/sky/event/" + $scope.eci + "/resetTemperature/wovyn/reading_reset";
      console.log(resetURL);
      $http.post(resetURL).then(function (response) {
        $scope.retrieveData;
      })
    }

    // init page
    $scope.retrieveData();
    $interval($scope.retrieveData, 5000);

    $scope.isInTemperatureViolations = function (temp) {
      var tempV = $scope.temperatureViolations
      for (var i in tempV) {
        if (tempV[i].timestamp == temp.timestamp &&
          tempV[i].tempF == temp.tempF &&
          tempV[i].tempC == temp.tempC) {
          return true;
        }
      }
      return false;
    }
  },
]);