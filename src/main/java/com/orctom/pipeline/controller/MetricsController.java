package com.orctom.pipeline.controller;

import com.orctom.laputa.model.Metric;
import com.orctom.pipeline.model.Application;
import com.orctom.pipeline.model.MetricsData;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class MetricsController {

  @MessageMapping("/metrics")
  @SendTo("/topic/metrics")
  public Metric metrics() {

    List<String> names = MetricsData.getApplications()
        .stream()
        .map(Application::getName)
        .collect(Collectors.toList());

    for (String name : names) {
      System.out.println(name);
    }
    return new Metric("key", 10, 1.0F);
  }
}
