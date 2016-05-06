angular.module('thPayments', [])
  .controller('thanksCtrl', [
    '$scope',
    '$window',
    function($scope, $window) {
      $scope.reset = function() {
        $window.location.reload();
      }
    }
  ])
  .factory('Utils', function() {
    var updateTotal = function($scope) {
      $scope.total = 0;
      $scope.selectedItems.forEach(function(e) {
        $scope.total += e.value;
      });
    };
    return {
      generateDescription: function(elements) {
        var items = [];
        elements.forEach(function(e) {
          if (e.description !== '') {
            items.push(e.description);
          }
        });
        items = items.join(' + ');
        return items;
      },
      updateCustom: function($scope) {
        // custom is always the first element
        $scope.selectedItems[0].description = $scope.customDescription;
        $scope.selectedItems[0].value = $scope.customValue * 100;
        updateTotal($scope);
      },
      toggleItem: function($scope, index) {
        var idToCheck = $scope.items[index].id;
        var present = false;
        $scope.selectedItems.forEach(function(e, i) {
          if (e.id === idToCheck) {
            // it's already present, remove it
            $scope.selectedItems.splice(i, 1);
            present = true;
            $scope.total -= e.value;
          }
        });
        if (!present) {
          $scope.selectedItems.push($scope.items[index]);
          $scope.total += $scope.items[index].value;
        }
      }
    }
  });
