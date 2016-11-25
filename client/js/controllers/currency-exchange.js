'use strict';
/**
 *  CurrencyExchangeController controller creation
 */
angular
  .module('app')
  .controller('CurrencyExchangeController', CurrencyExchangeController);

/**
 *  CurrencyExchangeController controller creation
 */
angular
  .module('app')
  .controller('NewsController', NewsController);

/**
 *  CurrencyExchangeController controller creation
 */
angular
  .module('app')
  .controller('DialogController', DialogController);

/**
 * [$inject description]
 * Dependency injection for CurrencyExchangeController
 * @type {Array}
 */
CurrencyExchangeController.$inject = ['$scope', 'TransactionLog', '$interval', '$state'];

/**
 * [$inject description]
 * Dependency injection for NewsController
 * @type {Array}
 */
NewsController.$inject = ['$scope', 'TransactionLog', 'newsFeedService', '$mdDialog'];

/**
 * [$inject description]
 * Dependency injection for DialogController
 * @type {Array}
 */
DialogController.$inject = ['$scope', 'popupFeed', '$mdDialog'];

/**
 * [CurrencyExchangeController description]
 * @param {[service]} $scope         [description]
 * @param {[service]} TransactionLog [description]
 * @param {[service]} $interval      [description]
 * @param {[service]} $state         [description]
 */
function CurrencyExchangeController($scope, TransactionLog, $interval, $state) {

  $scope.amount = 0;
  $scope.currencyDetail = [{"currencies":"USD / JPY","biddingValue":0,"askingValue":0},{"currencies":"AUD / JPY","biddingValue":0,"askingValue":0},{"currencies":"EUR / GAD","biddingValue":0,"askingValue":0},{"currencies":"USD / CNY","biddingValue":0,"askingValue":0},{"currencies":"CAD / CNY","biddingValue":0,"askingValue":0},{"currencies":"GBP / USD","biddingValue":0,"askingValue":0}];
  $scope.grid = [];
  $scope.selected = [];

  /**
   * [query description]
   * holds the value for the grid pagination
   * @type {Object}
   */
  $scope.query = {
    order: 'order',
    limit: 5,
    page: 1
  };

  /**
   * The below line update the currency value in the view twice every seconds.
   */
  $interval(updateCurrencyDetail, 500);

  /**
   * [recordTransaction description]
   * Saves the current transcation
   * @param  {[object]} event           [event object]
   * @param  {[object]} item            [recor on which transaction done]
   * @param  {[String]} transactionType [type of transaction]
   * @return {[type]}                 [description]
   */
  $scope.recordTransaction = function(event, item, transactionType) {
    TransactionLog.create({
        "date": new Date(),
        "currencies": item.currencies,
        "order": transactionType == 'ask' ? "Sell" : "Buy",
        "amount": $scope.amount || 0,
        "price": transactionType == 'ask' ? item.askingValue : item.biddingValue,
      })
      .$promise
      .then(function(response) {
        $log.info("Transaction successfully done and saved :: ", response);
        $scope.getGridData();
      }, function(error) {
        $log.error("error while saving the transaction record  :: " + error);
      });
  }

  /**
   * [getGridData description]
   * Gets the Transaction history data for the  grid.
   * @return {[type]} [description]
   */
  $scope.getGridData = function() {
    TransactionLog
      .find()
      .$promise
      .then(function(data){
        $scope.grid = {
          data : data,
          count: data.length
        };
      }, function(error){
        $log.error("error while fetching grid Data :: " + error);
      })
  }

  /**
   * [updateCurrencyDetail description]
   * This method is invoked twice a second. It updates the currency value.
   * @return {[type]} [description]
   */
  function updateCurrencyDetail() {
    $scope.currencyDetail.map(function(record) {
      record.biddingValue = (getRandom(0.2, 0.9) * 5).toFixed(4);
      record.askingValue = (record.biddingValue / getRandom(0.7, 0.9)).toFixed(4);
    });
  }

  /**
   * [getRandom description]
   * Generates a random number between the given range.
   * @param  {[number]} min [description]
   * @param  {[number]} max [description]
   * @return {[number]}     [description]
   */
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
}

/**
 * [NewsController description]
 * @param {[Service]} $scope          [description]
 * @param {[Service]} TransactionLog  [description]
 * @param {[Service]} newsFeedService [description]
 * @param {[Service]} $mdDialog       [description]
 */
function NewsController ($scope, TransactionLog, newsFeedService, $mdDialog) {
  $scope.getNewsFeed = function() {
    newsFeedService
      .getNewsFeed()
      .then(function(response){
        $scope.newsFeed = response;
      }, function(error){
        $log.error("error while fetching rss feeds :: ", error);
      });
  }

  /**
   * [popupModal description]
   * @param  {[Object]} ev   [description]
   * @param  {[Object]} feed [description]
   * @return {[type]}      [description]
   */
  $scope.popupModal = function(ev, feed) {
    $mdDialog.show({
      locals:{
        popupFeed: feed
      },
     controller: DialogController,
     templateUrl: 'views/popup-modal.html',
     parent: angular.element(document.body),
     targetEvent: ev,
     clickOutsideToClose:true,
     fullscreen: false
   })
   .then(function(answer) {
     $log.info("Pop up was closed .");
   }, function() {
     $log.info('You cancelled the dialog.');
   });
  }
}

/**
 * [DialogController description]
 * Pop up  for the rss feed.
 * @param {[Service]} $scope    [description]
 * @param {[Object]} popupFeed [description]
 * @param {[Service]} $mdDialog [description]
 */
function DialogController($scope, popupFeed, $mdDialog) {
  $scope.currentFeed = popupFeed;

  /**
   * [cancel description]
   * Hides the md Dialog modal.
   * @return {[type]} [description]
   */
  $scope.cancel = function(){
    $mdDialog.hide();
  }
}
