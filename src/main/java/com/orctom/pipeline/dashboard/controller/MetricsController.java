package com.orctom.pipeline.dashboard.controller;

import com.orctom.pipeline.dashboard.model.Message;
import com.orctom.pipeline.dashboard.model.MetricsData;
import com.orctom.pipeline.dashboard.model.Type;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
public class MetricsController {

  @MessageMapping("/metrics")
  @SendTo("/topic/metrics")
  public List<Message> metrics() {
    List<Message> endpoints = new ArrayList<>();
    MetricsData.getApplications().stream().map(application -> new Message(
        Type.ENDPOINT,
        application.getName(),
        application.getRoles()
    )).forEach(endpoints::add);
    endpoints.addAll(MetricsData.getMeters());
    endpoints.addAll(MetricsData.getConnections());
    return endpoints;
  }
}
