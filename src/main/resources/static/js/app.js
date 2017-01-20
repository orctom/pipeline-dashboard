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

jsPlumb.ready(function() {
  var instance = jsPlumb.getInstance({
    DragOptions: {
      cursor: 'pointer',
      zIndex: 2000
    },
    ConnectionOverlays: [
      ["Arrow", {
        location: 0.1,
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
      ["Arrow", {
        location: 1,
        visible: true,
        foldback: 0.7, 
        fill: "blue",
        width: 11,
        stroke: "blue",
        length: 11
      }],
    ],
    ReattachConnections: true,
    Endpoints:["Blank","Blank"],
    Connector:"Bezier",
    Anchor: ["Continuous", { faces:[ "left", "right" ] } ],
    Container: "canvas"
  });

  instance.registerConnectionType("basic", basicType);

  var getRoleId = function(role) {
    return "actor-" + role;
  };

  var updateLabel = function(connection, label) {
    connection.getOverlay("label").setLabel(label);
  };

  var updateLayout = function() {
    var $canvas = $("#canvas");
    var canvasWidth = $canvas.outerWidth();
    
    var x = 0, y = 50, xSpan = 250, ySpan = 180;
    $canvas.find(".group-container").each(function() {
      var $group = $(this);
      var groupWidth = $group.outerWidth();
      var top = y + 'px';
      var left = x + 'px';
      $group.css({left:left,top:top});
      
      x += (groupWidth + xSpan);
      if (x + groupWidth >= canvasWidth) {
        y += ($group.outerHeight() + ySpan);
        x = 0;
      }
    });

    instance.repaintEverything();
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
      $endpoint = $("#template-role").clone().prop("id", id);
      $endpoint.find(".role").text(role);
      $endpoint.appendTo($group);

      endpoints[id] = role;
    });

    instance.draggable($group);
    updateLayout();
  };

  var processConnection = function(source, target) {
    if (_.isEmpty(meters)) {
      return;
    }

    var literal = source + "-" + target;
    if (connection_literals[literal]) {
      return;
    }

    instance.connect({
      source: getRoleId(source), 
      target: getRoleId(target)
    });
    connection_literals[literal] = literal;
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
        var roleId = getRoleId(role);
        if (sourceRole == roleId) {
          for (var targetRole in conns) {
            var connection = conns[targetRole];
            if (connection) {
              instance.detach(connection);
            }
          }
          delete connections[sourceRole];
        } else {
          for (var targetRole in conns) {
            var connection = conns[targetRole];
            if (targetRole == roleId) {
              instance.detach(connection);
              delete conns[targetRole];
            }
          }
        }
      });
    }

    // clean meters
    _.each(roles.split(","), function(role) {
      for(var key in meters) {
        if (key.startsWith("actor-" + role + "-")) {
          delete meters[key];
        }
      }
    });
  };

  var applications = {};
  var connections = {};
  var connection_literals = {};
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
