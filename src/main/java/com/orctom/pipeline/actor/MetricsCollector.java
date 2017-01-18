package com.orctom.pipeline.actor;

import akka.actor.ActorRef;
import com.orctom.pipeline.annotation.Actor;
import com.orctom.pipeline.model.MemberInfo;
import com.orctom.pipeline.model.MetricsData;
import com.orctom.pipeline.model.PipelineMetrics;
import com.orctom.pipeline.precedure.AbstractMetricsCollector;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.annotation.Resource;

@Actor(role = "metrics-collector")
class MetricsCollector extends AbstractMetricsCollector {
  
  @Resource
  private SimpMessagingTemplate template;

  @Override
  public void onMessage(PipelineMetrics metric) {
    System.out.println(metric);
    template.convertAndSend("/topic/metrics", metric);
  }

  @Override
  protected void memberAdded(ActorRef actor, MemberInfo memberInfo) {
    MetricsData.addApplication(memberInfo.getApplicationName(), memberInfo.getRoles());
  }

  @Override
  protected void memberRemoved(ActorRef actorRef) {
    super.memberRemoved(actorRef);
  }
}