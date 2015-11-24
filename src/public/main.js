angular.module('thPayments', [])
  .controller('thanksCtrl', [
    '$scope',
    '$window',
    function($scope, $window) {
      $scope.reset = function() {
        $window.location.reload();
      }
    }
  ]);
