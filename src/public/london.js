angular.module('thPayments').controller('paymentsLondonCtrl', [
  '$scope',
  '$http',
  '$window',
  function($scope, $http, $window) {

    $scope.total = 0;
    $scope.customValue = 0;
    $scope.selectedItems = [];
    $scope.buttonLoading = false;

    $scope.items = [{
      id: 'flexMembership',
      value: 45000,
      description: 'Flex Membership'
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
    }];

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
    }

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
        console.log(i);
        if (i === 1) {
          description = e.description;
        } else {
          description = description + ' + ' + e.description;
        }
      });
      return description;
    }

    var handler = StripeCheckout.configure({
      key: $window.stripeKey,
      image: 'https://s3.amazonaws.com/stripe-uploads/acct_15Vj9dAHdLhZwm0Imerchant-icon-1432491852411-logo_white_square.png',
      locale: 'auto',
      token: function(token) {
        $scope.buttonLoading = true;
        var data = {
          token: token.id,
          amount: $scope.total,
          email: token.email,
          fullName: $scope.fullName,
          company: $scope.company,
          description: generateDescription()
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
        description: generateDescription(),
        currency: 'gbp',
        amount: $scope.total
      });
    }
  }
]);
