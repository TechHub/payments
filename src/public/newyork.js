angular.module('thPayments').controller('paymentsNewYorkCtrl', [
  '$scope',
  '$http',
  '$window',
  'Utils',
  function($scope, $http, $window, Utils) {
    $scope.total = 0;
    $scope.customValue = 0;
    $scope.selectedItems = [
      {
        id: 'custom',
        description: '',
        value: 0
      }
    ];
    $scope.buttonLoading = false;

    $scope.toggleItem = function(index) {
      return Utils.toggleItem($scope, index);
    };
    $scope.updateCustom = function() {
      return Utils.updateCustom($scope);
    };

    $scope.items = [
      {
        id: 'flexMembershipMonthly',
        value: 20672,
        description: 'Flex Membership Monthly'
      },
      {
        id: 'flexMembership',
        value: 217600,
        description: 'Flex Membership Yearly'
      },
      {
        id: 'postRegistrationMonthly',
        value: 8160,
        description: 'Address add-on (monthly)'
      },
      {
        id: 'postRegistration',
        value: 81600,
        description: 'Address add-on (yearly)'
      },
      {
        id: 'residentMonthly',
        value: 59840,
        description: 'Resident Monthly'
      },
      {
        id: 'dayPassNonMember',
        value: 3808,
        description: 'Daily pass (non-member)'
      },
      {
        id: 'residentMonthly',
        value: 2702,
        description: 'Daily pass (members guest)'
      }
    ];

    var handler = StripeCheckout.configure({
      key: $window.stripeKey,
      image:
        'https://s3.amazonaws.com/stripe-uploads/acct_15Vj9dAHdLhZwm0Imerchant-icon-1432491852411-logo_white_square.png',
      locale: 'auto',
      token: function(token) {
        $scope.buttonLoading = true;
        var data = {
          location: 'nyc',
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
        })
          .then(function successCallback(response) {
            console.log(response);
            if (response.data.status === 'succeeded') {
              angular.element($('.payment-view')).addClass('hidden');
              angular.element($('.thanks-view')).removeClass('hidden');
            } else {
              $scope.error = response.data;
            }
          })
          .catch(function errorCallback(response) {
            $scope.error = response.data;
          })
          .finally(function() {
            $scope.buttonLoading = false;
          });
      }
    });

    $scope.pay = function() {
      handler.open({
        name: 'TechHub',
        description: Utils.generateDescription($scope.selectedItems),
        currency: 'usd',
        amount: $scope.total
      });
    };
  }
]);
