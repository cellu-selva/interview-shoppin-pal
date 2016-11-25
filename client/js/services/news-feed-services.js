'use strict';
/**
 *  newsFeedService creation.
 */
angular
  .module('app')
  .service('newsFeedService', newsFeedService);

/**
 * [$inject description]
 * newsFeedService dependency injection.
 * @type {Array}
 */
  newsFeedService.$inject = ['$q', '$http'];

  /**
   * [newsFeedService description]
   * newsFeedService service
   * @param  {[Service]} $q    [description]
   * @param  {[Service]} $http [description]
   * @return {[type]}       [description]
   */
  function newsFeedService($q, $http) {
    return {
      getNewsFeed: function () {
         var deferred = $q.defer();
        $.ajax({
          url      : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('http://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms'),
          dataType : 'json',
          success  : function (data) {
            if (data.responseData.feed && data.responseData.feed.entries) {
               deferred.resolve(data.responseData.feed.entries);
            }
          }
        });
        return deferred.promise;
      }
    }

  }
