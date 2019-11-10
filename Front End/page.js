var app = angular.module('app', ['ngMaterial', 'ngMessages']).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').backgroundPalette('grey').dark();
});

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

app.controller('pageController', function ($scope, $http){
    $scope.readyPosts = false;
    $scope.readyFollowing = false;
    $scope.readyFollowers = false;

    let tag = new URL(window.location.href).searchParams.get("id");

    if (sessionStorage.getItem("user")) {
        $scope.user = JSON.parse(sessionStorage.getItem("user"))[0];
        console.log($scope.user);
    } else {
        $scope.user = {
            "id":null
        };
    }

    if (tag != $scope.user.id) {
        $http.post('https://nap1g17-cw1.azurewebsites.net/api/QueryProfile', JSON.stringify({"tag": tag}), config).then((res, status) => {
            $scope.page = res.data[0];
            $scope.posts = [];
            $scope.following = [];
            $scope.followers = [];

            if($scope.page.following.length == 0){
                $scope.readyFollowing = true;
            }

            if($scope.page.followers.length == 0){
                $scope.readyFollowers = true;
            }

            $http.post('https://nap1g17-cw1.azurewebsites.net/api/QueryPosts', JSON.stringify({"tag": tag}), config).then((res, status) => {
                for (let i = 0; i < res.data.length; i++){
                    $scope.posts.push(res.data[i]);
                }
                $scope.readyPosts = true;
            },(res, status) => {
                console.log("No posts found");
                $scope.readyPosts = true;
            });

            for (let p = 0; p < $scope.page.following.length; p++) {
                $http.post('https://nap1g17-cw1.azurewebsites.net/api/QueryProfile', JSON.stringify({"tag": $scope.page.following[p]}), config).then((res, status) => {
                    for (let i = 0; i < res.data.length; i++){
                        $scope.following.push(res.data[i]);
                    }
                    $scope.readyFollowing = true;
                },(res, status) => {
                    console.log("No profile found");
                    $scope.readyFollowing = true;
                });
            }

            for (let p = 0; p < $scope.page.followers.length; p++) {
                $http.post('https://nap1g17-cw1.azurewebsites.net/api/QueryProfile', JSON.stringify({"tag": $scope.page.followers[p]}), config).then((res, status) => {
                    for (let i = 0; i < res.data.length; i++){
                        $scope.followers.push(res.data[i]);
                    }
                    $scope.readyFollowers = true;
                },(res, status) => {
                    console.log("No profile found");
                    $scope.readyFollowers = true;
                });
            }

        },(res, status) => {
            console.log("No profile found");
        });
    } else {
        $scope.posts = [];
        $scope.profiles = [];
        $scope.following = [];
        $scope.followers = [];
        $scope.page = $scope.user;

        if($scope.page.following.length == 0){
            $scope.readyFollowing = true;
        }

        if($scope.page.followers.length == 0){
            $scope.readyFollowers = true;
        }

        $http.post('https://nap1g17-cw1.azurewebsites.net/api/QueryPosts', JSON.stringify({"tag": tag}), config).then((res, status) => {
            for (let i = 0; i < res.data.length; i++){
                $scope.posts.push(res.data[i]);
            }
            $scope.readyPosts = true;
        },(res, status) => {
            console.log("No posts found");
            $scope.readyPosts = true;
        });

        for (let p = 0; p < $scope.page.following.length; p++) {
            $http.post('https://nap1g17-cw1.azurewebsites.net/api/QueryProfile', JSON.stringify({"tag": $scope.page.following[p]}), config).then((res, status) => {
                for (let i = 0; i < res.data.length; i++){
                    $scope.following.push(res.data[i]);
                }
                $scope.readyFollowing = true;
            },(res, status) => {
                console.log("No posts found");
                $scope.readyFollowing = true;
            });
        }

        for (let p = 0; p < $scope.page.followers.length; p++) {
            $http.post('https://nap1g17-cw1.azurewebsites.net/api/QueryProfile', JSON.stringify({"tag": $scope.page.followers[p]}), config).then((res, status) => {
                for (let i = 0; i < res.data.length; i++){
                    $scope.followers.push(res.data[i]);
                }
                $scope.readyFollowers = true;
            },(res, status) => {
                console.log("No posts found");
                $scope.readyFollowers = true;
            });
        }
    }

    $scope.follow = (followed) => {
        $scope.readyPosts = false;
        let add = !$scope.user.following.includes(followed);
        $http.post('https://nap1g17-cw1.azurewebsites.net/api/UpdateFollow', JSON.stringify({"follower": $scope.user.id, "followed": followed, "add": add}), config).then((res, status) => {
            console.log("Updated new follow relationship");
            if (add) {
                $scope.user.following.push(followed); 
                $scope.followers.push($scope.user);
            } else {
                $scope.user.following.splice($scope.user.following.indexOf(followed), 1);
                for(let i = 0; i < $scope.followers.length; i++) {
                    if ($scope.followers[i].id === $scope.user.id) {
                        $scope.followers.splice(i, 1);
                    }
                }
            }
            sessionStorage.setItem("user", JSON.stringify([$scope.user]));
            $scope.readyPosts = true;
        },(res, status) => {
            console.log("Error following/unfollowing user");
            $scope.readyPosts = true;
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

		angular.forEach(arr, function(item){
			if(('#' + item.id.toLowerCase()).indexOf(name.toLowerCase()) !== -1 || item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 || item.content.toLowerCase().indexOf(name.toLowerCase()) !== -1 || item.tags.includes(name)){
				result.push(item);
			}
		});

		return result;
	};

});

app.filter('profileSearchFor', function(){
    
    return function(arr, name){
        if(!name){
            return arr;
        } else if (name.length < 3){
            return arr;
        }
        
        var result = [];

        name = name.toLowerCase();

        angular.forEach(arr, function(item){
            if(('#' + item.id.toLowerCase()).indexOf(name) !== -1 || item.name.toLowerCase().indexOf(name) !== -1){
                result.push(item);
            }
        });

        return result;
    };
});
