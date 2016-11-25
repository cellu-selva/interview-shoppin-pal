angular
  .module('app', [
    'ui.router',
    'lbServices',
    'ngMaterial',
    'md.data.table'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('currency-exchange', {
        url: '/',
        templateUrl: 'views/currency-exchange.html',
        controller: 'CurrencyExchangeController'
      })
      .state('news', {
        url: '/news',
        templateUrl: 'views/news.html',
        controller: 'NewsController'
      });
    $urlRouterProvider.otherwise('/');
  }]);
