var connect = function() {
  var socket = new SockJS('/metrics-websocket');
  var stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/metrics', function (metrics) {
      console.log("message: " + metrics);
      console.dir(metrics);
    });
    stompClient.send("/app/metrics");
  });
};

$(function () {
  connect();
});