var connect = function(onMessage) {
  var socket = new SockJS('/metrics-websocket');
  var stompClient = Stomp.over(socket);
  stompClient.connect({}, function(frame) {
    stompClient.subscribe('/topic/metrics', function(message) {
      onMessage(JSON.parse(message.body));
    });
    stompClient.send("/app/metrics");
  });
};

var basicType = {
  connector: "StateMachine",
  paintStyle: {
    stroke: "blue",
    strokeWidth: 4
  },
  hoverPaintStyle: {
    stroke: "blue"
  },
  overlays: [
    "Arrow"
  ]
};

var connectorPaintStyle = {
  strokeWidth: 2,
  stroke: "#61B7CF",
  joinstyle: "round",
  outlineStroke: "white",
  outlineWidth: 2
};

var connectorHoverStyle = {
  strokeWidth: 3,
  stroke: "#216477",
  outlineWidth: 5,
  outlineStroke: "white"
};
var endpointHoverStyle = {
  fill: "#216477",
  stroke: "#216477"
};

var endpointOptions = {
  endpoint: "Dot",
  paintStyle: {
    stroke: "#7AB02C",
    fill: "transparent",
    radius: 7,
    strokeWidth: 1
  },
  isSource: true,
  isTarget: true,
  connector: ["Flowchart", {
    stub: [40, 60],
    gap: 10,
    cornerRadius: 5,
    alwaysRespectStubs: true
  }],
  connectorStyle: connectorPaintStyle,
  hoverPaintStyle: endpointHoverStyle,
  connectorHoverStyle: connectorHoverStyle,
  dragOptions: {},
  maxConnections: -1,
  dropOptions: {
    hoverClass: "hover",
    activeClass: "active"
  },
  overlays: [
    ["Label", {
      location: [0.5, 1.5],
      label: "Drag",
      cssClass: "endpointSourceLabel",
      visible: true
    }]
  ]
};

jsPlumb.ready(function() {
  var instance = jsPlumb.getInstance({
    DragOptions: {
      cursor: 'pointer',
      zIndex: 2000
    },
    ConnectionOverlays: [
      ["Arrow", {
        location: 1,
        visible: true,
        width: 11,
        stroke: "blue",
        length: 11,
        id: "ARROW"
      }],
      ["Label", {
        location: 0.1,
        id: "label",
        stroke: "blue",
        cssClass: "aLabel"
      }]
    ],
    Container: "canvas"
  });

  instance.registerConnectionType("basic", basicType);
  instance.draggable($(".window"));

  var updateLabel = function(connection, label) {
    connection.getOverlay("label").setLabel(label);
  };

  var addEndpoint = function($endpoint, uuid) {
    instance.addEndpoint($endpoint, endpointOptions, {
      anchor: "Continuous",
      uuid: uuid
    });
  };

  var processMessage = function(message) {
    var type = message.type;
    var key = message.key;
    var field = message.field;
    var value = message.value;
    switch(type) {
      case "ENDPOINT": {
        processEndpoint(key, value);
        break;
      }
      case "CONNECTION": {
        processConnection(key, value);
        break;
      }
      case "METER": {
        processMeter(key, field, value);
        break;
      }
    }
  };

  var processEndpoint = function(key, value) {
    
  };

  var processConnection = function(key, value) {

  };

  var processMeter = function(key, field, value) {

  };

  connect(function(message) {
    if (Array.isArray(message)) {
      for (var i in message) {
        var msg = message[i];
        processMessage(msg);
      }
    } else {
      processMessage(message);
    }
  });
  instance.batch(function() {

  });
});
