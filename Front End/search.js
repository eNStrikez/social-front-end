var app = angular.module('app', ['ngMaterial', 'ngMessages']).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').backgroundPalette('grey').dark();
});
const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

app.controller('searchController', function ($scope, $http){
    // Obtains user info
	if (sessionStorage.getItem("user")) {
        $scope.user = JSON.parse(sessionStorage.getItem("user"))[0];
        console.log($scope.user)
    }
    
    $scope.profiles = [];
    // Retrieves a list of all profiles
    $http.post('https://nap1g17-cw1.azurewebsites.net/api/RetrieveAllProfiles', config).then((res, status) => {
        console.log(res);
        for (let i = 0; i < res.data.length; i++){
            $scope.profiles.push(res.data[i]);
        }
    },(res, status) => {
        console.log("No profiles found")
    });
});

app.filter('searchFor', function(){
    // Searches the usernames and display names and sorts
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
