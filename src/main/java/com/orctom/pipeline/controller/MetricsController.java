package com.orctom.pipeline.controller;

import com.orctom.pipeline.model.Application;
import com.orctom.pipeline.model.Message;
import com.orctom.pipeline.model.MetricsData;
import com.orctom.pipeline.model.Type;
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
    for (Application application : MetricsData.getApplications()) {
      endpoints.add(new Message(
          Type.ENDPOINT,
          application.getName(),
          application.getRoles()
      ));
    }
    return endpoints;
  }
}
