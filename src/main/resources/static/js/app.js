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
},
// .. and this is the hover style.
connectorHoverStyle = {
  strokeWidth: 3,
  stroke: "#216477",
  outlineWidth: 5,
  outlineStroke: "white"
},
endpointHoverStyle = {
  fill: "#216477",
  stroke: "#216477"
},

endpointOptions = {
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

var connect = function() {
  var socket = new SockJS('/metrics-websocket');
  var stompClient = Stomp.over(socket);
  stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/metrics', function(metrics) {
      console.dir(metrics);
    });
    stompClient.send("/app/metrics");
  });
};

jsPlumb.ready(function() {
  var instance = jsPlumb.getInstance({
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
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


  instance.batch(function() {

  });

  //connect();

});
