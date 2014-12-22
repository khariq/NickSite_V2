var app = angular.module("site", []);

app.factory('DataService', function($http, $q) {		
	
	var selectedItem = null;

	function DataService() {
		var self = this;
		self.dataJson = null;
		
		self.getDataJson = function() {
			var deferred = $q.defer();
			if (self.dataJson !== null) {
				deferred.resolve(self.dataJson);
			} else {
				$http.get('data.json')
					.success(function(data) {
						self.dataJson = data;
						deferred.resolve(data);
					})
					.error(function(response) { 
						deferred.reject(response);
					});
			}
			return deferred.promise;
		}
	}

	return new DataService();
		
});


var mainController = app.controller('mainController', function($scope, $location, DataService) {

	$scope.selectedItem = null;
	$scope.isActive = function(viewLocation) {
		return $scope.selectedItem === viewLocation;
	}

	$scope.changeCarousel = function(selectedItem) {
		
		$scope.selectedItem = selectedItem;

		DataService.getDataJson().then(
			function(data) {
				$scope.slides = 
								Enumerable.From(data.photos)
											.Where(function(x) { return x.category === selectedItem } )
											.Select(function(x) { return x.slides })
											.ToArray()[0];
			},
			function(response) {

			}
		);
	}

	DataService.getDataJson().then(
			function(data) {

				$scope.photos = data.photos;

			},
			function(response) {}
		);

	$scope.slides = [];
	
});
