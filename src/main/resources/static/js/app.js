var connect = function() {
  var socket = new SockJS('/metrics-websocket');
  var stompClient = Stomp.over(socket);
  stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/metrics', function(metrics) {
      console.log("message: " + metrics);
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
        stroke: "red",
        length: 11,
        id: "ARROW"
      }],
      ["Label", {
        location: 0.1,
        id: "label",
        stroke: "red",
        cssClass: "aLabel"
      }]
    ],
    Container: "canvas"
  });

  var basicType = {
    connector: "StateMachine",
    paintStyle: {
      stroke: "red",
      strokeWidth: 4
    },
    hoverPaintStyle: {
      stroke: "blue"
    },
    overlays: [
      "Arrow"
    ]
  };
  instance.registerConnectionType("basic", basicType);

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
    // the definition of source endpoints (the small blue ones)
    sourceEndpoint = {
      endpoint: "Dot",
      paintStyle: {
        stroke: "#7AB02C",
        fill: "transparent",
        radius: 7,
        strokeWidth: 1
      },
      isSource: true,
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
      overlays: [
        ["Label", {
          location: [0.5, 1.5],
          label: "Drag",
          cssClass: "endpointSourceLabel",
          visible: false
        }]
      ]
    },
    // the definition of target endpoints (will appear when the user drags a connection)
    targetEndpoint = {
      endpoint: "Dot",
      paintStyle: {
        fill: "#7AB02C",
        radius: 7
      },
      hoverPaintStyle: endpointHoverStyle,
      maxConnections: -1,
      dropOptions: {
        hoverClass: "hover",
        activeClass: "active"
      },
      isTarget: true,
      overlays: [
        ["Label", {
          location: [0.5, -0.5],
          label: "Drop",
          cssClass: "endpointTargetLabel",
          visible: false
        }]
      ]
    },
    init = function(connection) {
      connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
    };

  var _addEndpoints = function(toId, sourceAnchors, targetAnchors) {
    for (var i = 0; i < sourceAnchors.length; i++) {
      var sourceUUID = toId + sourceAnchors[i];
      instance.addEndpoint("flowchart" + toId, sourceEndpoint, {
        anchor: sourceAnchors[i],
        uuid: sourceUUID
      });
    }
    for (var j = 0; j < targetAnchors.length; j++) {
      var targetUUID = toId + targetAnchors[j];
      instance.addEndpoint("flowchart" + toId, targetEndpoint, {
        anchor: targetAnchors[j],
        uuid: targetUUID
      });
    }
  };

  // suspend drawing and initialise.
  instance.batch(function() {
    _addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
    _addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
    _addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
    _addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);

    // listen for new connections; initialise them the same way we initialise the connections at startup.
    instance.bind("connection", function(connInfo, originalEvent) {
      init(connInfo.connection);
    });

    instance.connect({
      uuids: ["Window2BottomCenter", "Window3TopCenter"],
      editable: false
    });
    instance.connect({
      uuids: ["Window2LeftMiddle", "Window4LeftMiddle"],
      editable: false
    });
    instance.connect({
      uuids: ["Window4TopCenter", "Window4RightMiddle"],
      editable: false
    });
    instance.connect({
      uuids: ["Window3RightMiddle", "Window2RightMiddle"],
      editable: false
    });
    instance.connect({
      uuids: ["Window4BottomCenter", "Window1TopCenter"],
      editable: false
    });
    instance.connect({
      uuids: ["Window3BottomCenter", "Window1BottomCenter"],
      editable: false
    });
    //connect();
  });
});
