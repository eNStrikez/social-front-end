var app = angular.module('app', ['ngMaterial', 'ngMessages']).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').backgroundPalette('grey').dark();
});
const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

app.controller('postController', function ($scope, $mdDialog, $http){
    $scope.ready = false;
    $scope.tags = [];

    // Gets user info or redirects to login if not available
    if (!sessionStorage.getItem("user")) {
        window.location.replace('login.html');
    } else {
        $scope.user = JSON.parse(sessionStorage.getItem("user"))[0];
        console.log($scope.user)
    }

    $scope.ready = true;

    // Failure dialogue
    let failedPost = function() {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Failed to post')
            .textContent('There was an error creating the post, please try again')
            .ariaLabel('Failed post')
            .ok('OK')
        );
    };

    // Success dialogue
    let successfulPost = function() {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Successfully posted')
            .textContent('Post has been successfully created')
            .ariaLabel('Successfully posted')
            .ok('OK')
        );
    };

    // Adds a new post using the form
    $scope.post = () => {
        $scope.ready = false;
        $http.post('https://nap1g17-cw1.azurewebsites.net/api/InsertPost', JSON.stringify(
                {
                    "tag":$scope.user.id, 
                    "name":$scope.user.name, 
                    "icon":$scope.user.icon, 
                    "content":$scope.post.content, 
                    "media":$scope.post.media, 
                    "tags":$scope.tags
                }
            ), config).then((res, status) => {
            successfulPost();
            $scope.ready = true;
        }, (res, status) => {
            $scope.ready = true;
            failedPost();
        });
    }    
});
