package com.orctom.pipeline.actor;

import com.orctom.pipeline.annotation.Actor;
import com.orctom.pipeline.model.PipelineMetrics;
import com.orctom.pipeline.precedure.AbstractMetricsCollector;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.annotation.Resource;

@Actor("metrics-collector")
class MetricsCollector extends AbstractMetricsCollector {
  
  @Resource
  private SimpMessagingTemplate template;

  @Override
  public void onMessage(PipelineMetrics metric) {
    template.convertAndSend("/topic/metrics", metric);
  }
}