angular.module('shpCrt.controllers', [])

.controller('CartCtrl', function($ionicPlatform,$cordovaSQLite,$location,$scope,cart) {

        $ionicPlatform.ready(function(){
          if (window.cordova) {
            cart.setDb($cordovaSQLite.openDB({name : "AQD.cartDB", location : 0}));  
          } else {
            cart.setDb(window.openDatabase("AQD.cartDB", '1', 'cartDb', 1024 * 1024 * 100));
          }
          cart.initDb().then(function(){
              cart.getCart().then(function(data){
                $scope.cart=data;  
              },function(error){
                $scope.cart=[];
              });
            },function(){
                console.log("Error");
          });
          
        });

      $scope.shrtCutItem=''
      $scope.picked = function(item) {
        cart.picked(item.id,item.picked);
      };
      $scope.refresh = function() {
        cart.getCart().then(function(data){
              $scope.cart=data;  
            },function(error){
            $scope.cart=[];
          });
      };

      $scope.add = function() {
        if ($scope.shrtCutItem === '') {
            $location.path('/add');
        } else {
          cart.insert($scope.shrtCutItem);
          $scope.shrtCutItem = '';
          $scope.refresh();
        }
      };
})
.controller('addItemCtrl', function($scope,cart){
  
});


