myApp.controller('NavController', function($location,$scope) {

  console.log($scope.$location);
  console.log($location);

  $scope.$location = $location;

});