var app = angular.module('app', ['ngMaterial', 'ngMessages']).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').backgroundPalette('grey').dark();
});

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

app.controller('searchPostsController', function ($scope, $http){
    $scope.ready = false;
    $scope.profileSearch = true;
    $scope.contentSearch = true;
    $scope.tagSearch = true;
    $scope.dateSearch = true;

    if (sessionStorage.getItem("user")) {
        $scope.user = JSON.parse(sessionStorage.getItem("user"))[0];
    }

    $scope.posts = [];

    
    $scope.ready = false;
    $http.post('https://nap1g17-cw1.azurewebsites.net/api/RetrieveAllPosts', config).then((res, status) => {
        for (let i = 0; i < res.data.length; i++){
            $scope.posts.push(res.data[i]);
        }
        $scope.ready = true;
    },(res, status) => {
        console.log("No posts found");
        $scope.ready = true;
    });
    


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
	
	return function(arr, param, profile, content, tags, date){
        if (arr)
            arr.sort((a,b) => b._ts - a._ts);

		if(!param){
			return arr;
		} else if (param.length < 3){
			return arr;
		}
		
	    let result = [];
        let params = param.replace(" ", "").split(",");

        angular.forEach(params, function(name){
    		angular.forEach(arr, function(item){
    			if(profile && (('#' + item.tag.toLowerCase()).indexOf(name.toLowerCase()) !== -1 || item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1)){
    				result.push(item);
    			} else if (content && item.content.toLowerCase().indexOf(name.toLowerCase()) !== -1){
                   result.push(item); 
               } else if (tags && item.tags.includes(name)) {
                   result.push(item);
               } else if (date && item.date == name.toLowerCase()){
                   result.push(item);
               }
    		});
        });

        
        result.sort((a,b) => b._ts - a._ts);
		return result;
	};

});
