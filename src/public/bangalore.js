angular.module('thPayments').controller('paymentsBangaloreCtrl', [
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
      value: 345000,
      description: 'Flex Membership'
    }, {
      id: 'flexPlusMembership',
      value: 575000,
      description: 'Flex Plus Membership'
    }, {
      id: 'residentMembership',
      value: 862500,
      description: 'Resident Membership'
    }];

    $scope.pay = function() {
      var options = {
        'key': $window.razorKey,
        'amount': $scope.total, // 2000 paise = INR 20
        'name': 'TechHub Bangalore',
        'description': Utils.generateDescription($scope.selectedItems),
        'image': 'https://s3.amazonaws.com/stripe-uploads/acct_15Vj9dAHdLhZwm0Imerchant-icon-1432491852411-logo_white_square.png',
        handler: function(response) {
          $scope.buttonLoading = true;
          var data = {
            location: 'bangalore',
            id: response.razorpay_payment_id,
            amount: $scope.total,
            description: Utils.generateDescription($scope.selectedItems)
          };

          $http({
            method: 'POST',
            url: '/charge_razorpay',
            headers: {
              'Content-type': 'application/json'
            },
            data: JSON.stringify(data)
          }).then(function(res) {
            console.log(res.data);
            if (res.data.captured) {
              angular.element($('.payment-view')).addClass('hidden');
              angular.element($('.thanks-view')).removeClass('hidden');
            } else {
              $scope.error = res.data.error_description;
            }
          }).catch(function(response) {
            $scope.error = response.data;
          }).finally(function() {
            $scope.buttonLoading = false;
          });

        },
        'notes': {
          'fullName': $scope.fullName,
          'company': $scope.company
        },
        'theme': {
          'color': '#f9b233'
        },
        'modal': {
          ondismiss: function() {
            $scope.buttonLoading = false;
          }
        }
      };
      var rzp1 = new Razorpay(options);
      rzp1.open();
    }
  }
]);
