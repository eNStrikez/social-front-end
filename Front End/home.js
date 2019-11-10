var app = angular.module('app', ['ngMaterial', 'ngMessages']).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').backgroundPalette('grey').dark();
});
const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

app.controller('homeController', function ($scope, $http){
    $scope.ready = false;

    if (!sessionStorage.getItem("user")) {
        window.location.replace('login.html');
    } else {
        $scope.user = JSON.parse(sessionStorage.getItem("user"))[0];
        console.log($scope.user)
    }

    if ($scope.user.following.length == 0) {
        $scope.ready = true;
    }

    $scope.posts = [];
    let count = 0;

    for (let p = 0; p < $scope.user.following.length; p++){
        $http.post('https://nap1g17-cw1.azurewebsites.net/api/QueryPosts', JSON.stringify({"tag": $scope.user.following[p]}), config).then((res, status) => {
            for (let i = 0; i < res.data.length; i++){
                $scope.posts.push(res.data[i]);
            }
            count++;

            if(count == $scope.user.following.length) {
                $scope.ready = true;
            }
        },(res, status) => {
            console.log("No posts found for " + $scope.user.following[p]);
            count++;
            if(count == $scope.user.following.length) {
                $scope.ready = true;
            }
        });
    }

    $scope.follow = (followed) => {
        $scope.ready = false;
        let add = !$scope.user.following.includes(followed);
        $http.post('https://nap1g17-cw1.azurewebsites.net/api/UpdateFollow', JSON.stringify({"follower": $scope.user.id, "followed": followed, "add": add}), config).then((res, status) => {
            console.log("Updated new follow relationship");
            if (add) {
                $scope.user.following.push(followed); 
            } else {
                $scope.user.following.splice($scope.user.following.indexOf(followed), 1);
            }
            sessionStorage.setItem("user", JSON.stringify([$scope.user]));
            $scope.ready = true;
        },(res, status) => {
            console.log("Error following/unfollowing user");
            $scope.ready = true;
        });
    }
});

app.filter('searchFor', function(){
	
	return function(arr, name){
        if (arr)
            arr.sort((a,b) => b._ts - a._ts);

		if(!name){
			return arr;
		} else if (name.length < 3){
			return arr;
		}
		
		var result = [];

		name = name.toLowerCase();

		angular.forEach(arr, function(item){
			if(('#' + item.tag.toLowerCase()).indexOf(name) !== -1 || item.name.toLowerCase().indexOf(name) !== -1 || item.content.toLowerCase().indexOf(name) !== -1 || item.tags.includes(name)){
				result.push(item);
			}
		});

		return result;
	};

});
