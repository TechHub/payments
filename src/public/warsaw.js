angular.module('thPayments')
  .controller('paymentsWarsawCtrl', [
    '$scope',
    '$http',
    '$window',
    function($scope, $http, $window) {
      $scope.buttonLoading = true;
      $scope.items = [{
        id: 'flexMembershipWarsaw',
        value: 2460,
        description: 'Flex Membership'
      }, {
        id: 'residentMembershipWarsaw',
        value: 922.5,
        description: 'Resident Membership'
      }];

      $scope.total = 0;
      $scope.customValue = 0;
      $scope.selectedItems = [];

      $scope.selectedItems.push({
        id: 'custom',
        description: '',
        value: 0
      });

      var updateTotal = function() {
        $scope.total = 0;
        $scope.selectedItems.forEach(function(e) {
          $scope.total += e.value;
        });
      };

      $scope.updateCustom = function() {
        // custom is always the first element
        $scope.selectedItems[0].description = $scope.customDescription;
        $scope.selectedItems[0].value = $scope.customValue * 100;
        updateTotal();
      };

      $scope.toggleItem = function(index) {
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
      };

      var generateDescription = function() {
        var description;
        $scope.selectedItems.forEach(function(e, i) {
          if (i === 1) {
            description = e.description;
          } else {
            description = description + ' + ' + e.description;
          }
        });
        return description;
      };

      $scope.pay = function() {
        $scope.buttonLoading = true;
      };

      $window.braintree.setup($window.braintreeToken, 'dropin', {
        container: 'ui-warsaw',
        onPaymentMethodReceived: function(o) {
          $scope.buttonLoading = true;
          var data = {
            nonce: o.nonce,
            amount: $scope.total,
            email: $scope.email,
            givenName: $scope.givenName,
            surname: $scope.surname,
            company: $scope.company,
            description: generateDescription()
          };
          $http({
            method: 'POST',
            url: '/charge_braintree',
            headers: {
              'Content-type': 'application/json'
            },
            data: JSON.stringify(data)
          }).then(function successCallback(response) {
            console.log(response.data);
            if(response.data.success){
              angular.element($('.payment-view')).addClass('hidden');
              angular.element($('.thanks-view')).removeClass('hidden');
            }
            else {
              $scope.error = response.data.message;
            }
          }).catch(function errorCallback(response) {
            $scope.error = response.data;
          }).finally(function() {
            $scope.buttonLoading = false;
          });
        },
        onReady: function(){
          $scope.buttonLoading = false;
          $scope.$apply();
        }
      });
    }
  ]);
