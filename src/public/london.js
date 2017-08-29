angular.module('thPayments').controller('paymentsLondonCtrl', [
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
      id: 'flexMembership',
      value: 51000,
      description: 'Flex Membership'
    }, {
      id: 'intern',
      value: 9000,
      description: 'Intern 1month'
    }, {
      id: 'postRegistration',
      value: 44400,
      description: 'Post registration service'
    }, {
      id: 'dailyPass',
      value: 3000,
      description: 'Daily Pass'
    }, {
      id: 'dailyPassGuest',
      value: 1800,
      description: 'Daily Pass for Member\'s guest'
    }, {
      id: 'residentMonthly',
      value: 33000,
      description: 'Resident Monthly'
    }, {
      id: 'residentMonthlyDeposit',
      value: 66000,
      description: 'Resident Monthly + Deposit'
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
          location: 'london',
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
        currency: 'gbp',
        amount: $scope.total
      });
    }
  }
]);
