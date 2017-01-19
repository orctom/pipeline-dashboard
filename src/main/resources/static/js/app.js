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
    alwaysRespectStubs: false
  }],
  connectorStyle: connectorPaintStyle,
  hoverPaintStyle: endpointHoverStyle,
  connectorHoverStyle: connectorHoverStyle,
  dragOptions: {},
  maxConnections: -1,
  dropOptions: {
    hoverClass: "hover",
    activeClass: "active"
  }
};

jsPlumb.ready(function() {
  var instance = jsPlumb.getInstance({
    DragOptions: {
      cursor: 'pointer',
      zIndex: 2000
    },
    ConnectionOverlays: [
      ["Arrow", {
        location: 0.3,
        visible: true,
        foldback: 0.7,
        fill: "blue",
        width: 11,
        stroke: "blue",
        length: 11
      }],
      ["Label", {
        location: 0.5,
        id: "label",
        stroke: "blue",
        cssClass: "aLabel"
      }],
      ["Arrow", {
        location: 0.7,
        visible: true,
        foldback: 0.7, 
        fill: "blue",
        width: 11,
        stroke: "blue",
        length: 11
      }],
    ],
    Container: "canvas"
  });

  instance.registerConnectionType("basic", basicType);

  var getRoleId = function(role) {
    return "actor-" + role;
  };

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
        if ("up" == field) {
          processEndpoint(key, value);
        } else if ("down" == field) {
          deleteEndpoint(key, value);
        } else {
          processMeter(key, field, value);
        }
        break;
      }
    }
  };

  var processEndpoint = function(applicationName, roles) {
    var endpoints = applications[applicationName];
    if (endpoints) {
      return;
    }
    endpoints = applications[applicationName] = {};
    var $group = $("#template-application").clone().prop("id", applicationName);
    $group.find(".title").text(applicationName);
    $group.appendTo("#canvas");

    _.each(roles.split(","), function(role) {
      var id = getRoleId(role);
      if (endpoints[id]) {
        return;
      }
      endpoints[id] = role;
      $endpoint = $("#template-role").clone().prop("id", id);
      $endpoint.find(".role").text(role);
      $endpoint.appendTo($group);
    });

    instance.draggable($group);
  };

  var processConnection = function(source, target) {
    if (_.isEmpty(meters)) {
      return;
    }
    instance.connect({source: getRoleId(source), target: getRoleId(target)});
  };

  var processMeter = function(role, meter, value) {
    var id = getRoleId(role);
    if ("sent" == meter) {
      var conns = connections[id];
      if (conns) {
        _.each(_.values(conns), function(connection) {
          updateLabel(connection, value);
        });
      }
    } else {
      var meter_key = id + "-" + meter;
      if (meters[meter_key]) {
        $("#" + id + " ." + meter).text(value);
      } else {
        var $meter = $("#template-meter").clone().removeAttr("id");
        $meter.find(".badge").text(value).addClass(meter);
        $meter.find(".meter").text(meter);
        $meter.appendTo("#" + id + " > .list-group");
        meters[meter_key] = meter_key;
      }
    }
  };

  var deleteEndpoint = function(applicationName, roles) {
    // clean groups
    $("#" + applicationName).remove();
    delete applications[applicationName];

    // clean connections
    for (var sourceRole in connections) {
      var conns = connections[sourceRole];
      _.each(roles.split(","), function(role) {
        if (sourceRole == role) {
          _.each(_.values(conns), function(connections) {
            instance.detach(connection);
          });
          delete connections[sourceRole];
        } else {
          for (var targetRole in conns) {
            var connection = conns[targetRole];
            if (targetRole == role) {
              instance.detach(connection);
              delete conns[targetRole];
            }
          }
        }
      });
    }

    // clean meters

  };

  var applications = {};
  var connections = {};
  var meters = {};
  instance.bind("connection", function (connInfo, originalEvent) {
    var sourceId = connInfo.sourceId;
    var targetId = connInfo.targetId;
    var connection = connInfo.connection;
    var conns = connections[sourceId];
    if (conns) {
      conns[targetId] = connection;
    } else {
      connections[sourceId] = {targetId: connection};
    }
  });

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
