package com.orctom.pipeline.controller;

import com.orctom.laputa.model.Metric;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MetricsController {

  @MessageMapping("/metrics")
  @SendTo("/topic/metrics")
  public Metric metrics() {
    return new Metric("key", 10, 1.0F);
  }
}
