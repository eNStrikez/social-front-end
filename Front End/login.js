var app = angular.module('app', ['ngMaterial', 'ngMessages']).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').backgroundPalette('grey').dark();
});

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

app.controller('loginController', function ($scope, $mdDialog, $http){
    if (sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", null);
    }
    $scope.loading = false;
    $scope.user = {
        name: null,
        id: null,
        tag: null,
        password: null,
        email: null,
        icon: null
    };

    // Sets up success and failure dialogues
    let failedLogin = function() {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Failed to login')
            .textContent('The login failed, check your credentials and try again')
            .ariaLabel('Failed login')
            .ok('OK')
        );
    };

    let failedCreation = function() {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Failed to create account')
            .textContent('The desired username has been taken, please try another')
            .ariaLabel('Failed creation')
            .ok('OK')
        );
    };

    // Authenticates user
    $scope.login = () => {
        $scope.loading = true;
        $http.post('https://nap1g17-cw1.azurewebsites.net/api/AuthenticateProfile', JSON.stringify({"tag":$scope.user.tag,"password":$scope.user.password}), config).then((res, status) => {
            console.log(res.data[0]);
            sessionStorage.setItem("user", JSON.stringify(res.data));
            window.location.replace('home.html');
        }, (res, status) => {
            $scope.loading = false;
            failedLogin();
        });
    }

    // Adds a new user
    $scope.createAccount = () => {
        $scope.loading = true;
        if (!$scope.user.icon) {
            $scope.user.icon = "https://cdn2.iconfinder.com/data/icons/business-management-52/96/Artboard_20-512.png";
        }
        console.log($scope.user.tag);
        $http.post('https://nap1g17-cw1.azurewebsites.net/api/InsertProfile', JSON.stringify({"tag":$scope.user.tag,"password":$scope.user.password, "name":$scope.user.name, "email":$scope.user.email, "icon":$scope.user.icon}), config).then((res, status) => {
            $scope.user.following = [];
            $scope.user.followers = [];
            $scope.user.id = $scope.user.tag;
            sessionStorage.setItem("user", JSON.stringify([$scope.user]));
            window.location.replace('home.html');
        }, (res, status) => {
            $scope.loading = false;
            failedCreation();
        });
    }
});
