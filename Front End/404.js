var app = angular.module('app', ['ngMaterial', 'ngMessages']).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').backgroundPalette('grey').dark();
});
const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

app.controller('404Controller', function ($scope, $http){
    if (sessionStorage.getItem("user")) {
        $scope.user = JSON.parse(sessionStorage.getItem("user"))[0];
        console.log($scope.user)
    }
});


