angular.module('thPayments').controller('paymentsMadridCtrl', [
  '$scope', '$http', '$window', 'Utils',
  function($scope, $http, $window, Utils) {

    $scope.total = 0;
    $scope.customValue = 0;
    $scope.selectedItems = [{
      id: 'custom',
      description: '',
      value: 0
    }];
    $scope.buttonLoading = false;

    $scope.toggleItem = function(index) {
      return Utils.toggleItem($scope, index);
    }
    $scope.updateCustom = function() {
      return Utils.updateCustom($scope);
    }

    $scope.items = [{
      id: 'daypassNonMemberMadrid',
      value: 3630,
      description: 'Day Pass for Non-Member'
    }, {
      id: 'daypassMemberGuestMadrid',
      value: 2178,
      description: 'Day Pass for Member\'s guest'
    },{
      id: 'custom',
      description: '',
      value: 0
    }];

    var handler = StripeCheckout.configure({
      key: $window.stripeKey,
      image: 'https://s3.amazonaws.com/stripe-uploads/acct_15Vj9dAHdLhZwm0Imerchant-icon-1432491852411-logo_white_square.png',
      locale: 'auto',
      token: function(token) {
        $scope.buttonLoading = true;
        var data = {
          location: 'madrid',
          token: token.id,
          amount: $scope.total,
          email: token.email,
          fullName: $scope.fullName,
          company: $scope.company,
          description: Utils.generateDescription($scope.selectedItems)
        };

        $http({
          method: 'POST',
          url: '/charge_stripe',
          headers: {
            'Content-type': 'application/json'
          },
          data: JSON.stringify(data)
        }).then(function successCallback(response) {
          console.log(response);
          if (response.data.status === 'succeeded') {
            angular.element($('.payment-view')).addClass('hidden');
            angular.element($('.thanks-view')).removeClass('hidden');
          } else {
            $scope.error = response.data;
          }
        }).catch(function errorCallback(response) {
          $scope.error = response.data;
        }).finally(function() {
          $scope.buttonLoading = false;
        });
      }
    });

    $scope.pay = function() {
      handler.open({
        name: 'TechHub',
        description: Utils.generateDescription($scope.selectedItems),
        currency: 'eur',
        amount: $scope.total
      });
    }
  }
]);
