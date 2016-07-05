angular.module('thPayments').controller('paymentsWarsawCtrl', [
  '$scope', '$http', '$window', 'Utils',
  function($scope, $http, $window, Utils) {

    $scope.buttonLoading = true;
    $scope.total = 0;
    $scope.customValue = 0;
    $scope.selectedItems = [{
      id: 'custom',
      description: '',
      value: 0
    }];

    $scope.items = [{
      id: 'flexMembershipWarsaw',
      value: 2460,
      description: 'Flex Membership'
    }, {
      id: 'residentMembershipWarsaw',
      value: 922.5,
      description: 'Resident Membership'
    }, {
      id: 'dailyNonMemberWarsaw',
      value: 166.05,
      description: 'Day Pass for Non-Member'
    }, {
      id: 'dailyMemberGuestWarsaw',
      value: 98.40,
      description: 'Day Pass for Member\'s Guest'
    }];

    $scope.toggleItem = function(index) {
      return Utils.toggleItem($scope, index);
    }
    $scope.updateCustomWarsaw = function() {
      return Utils.updateCustomWarsaw($scope);
    }

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
          description: Utils.generateDescription($scope.selectedItems)
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
          if (response.data.success) {
            angular.element($('.payment-view')).addClass('hidden');
            angular.element($('.thanks-view')).removeClass('hidden');
          } else {
            $scope.error = response.data.message;
          }
        }).catch(function errorCallback(response) {
          $scope.error = response.data;
        }).finally(function() {
          $scope.buttonLoading = false;
        });
      },
      onReady: function() {
        $scope.buttonLoading = false;
        $scope.$apply();
      }
    });
  }
]);
