function redirectToMyInfo() {
    window.location.href = window.redirectUrl;
}

(function() {
  function httpGetAsync(theUrl, callback) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
              callback(xmlHttp.responseText);
          }
      };
      xmlHttp.open("GET", theUrl, true); // true for asynchronous
      xmlHttp.send(null);
  }
  function redirectURLSetCallback(responseText) {
      try {
          var body = JSON.parse(responseText);
          var redirectUrl = body.link;
          window.redirectUrl = redirectUrl;
      } catch (e) {
        // empty
      }
  }
  var url_string = window.location.href;
  var url = new URL(url_string);
  var parameter = window.location.search;
  var url = "/home/api/v1/myinfo/redirecturl" + parameter;
  window.onload = httpGetAsync(url, redirectURLSetCallback);
})()
