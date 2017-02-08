package com.orctom.pipeline.dashboard.actor;

import akka.actor.ActorRef;
import com.google.common.base.CharMatcher;
import com.orctom.pipeline.annotation.Actor;
import com.orctom.pipeline.dashboard.model.Message;
import com.orctom.pipeline.dashboard.model.MetricsData;
import com.orctom.pipeline.dashboard.model.Type;
import com.orctom.pipeline.model.MemberInfo;
import com.orctom.pipeline.model.PipelineMetrics;
import com.orctom.pipeline.precedure.AbstractMetricsCollector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.annotation.Resource;

import java.util.regex.Pattern;

import static com.orctom.pipeline.Constants.*;

@Actor(role = "metrics-collector")
class MetricsCollector extends AbstractMetricsCollector {

  private static final Logger LOGGER = LoggerFactory.getLogger(MetricsCollector.class);

  private static final Pattern NON_CHAR_PATTERN = Pattern.compile("[^0-9a-zA-Z_-]");

  @Resource
  private SimpMessagingTemplate template;

  @Override
  public void onMessage(PipelineMetrics metric) {
    LOGGER.debug(metric.toString());
    String metricType = metric.getKey();
    if ("routee".equals(metricType)) {
      Message message = new Message(
          metric.getTimestamp(),
          Type.CONNECTION,
          metric.getRole(),
          normalize(metric.getApplicationName()),
          CharMatcher.anyOf("[]").trimFrom(metric.getGauge())
      );
      send(message);
      MetricsData.addConnection(message);

    } else if (MEMBER_EVENT_UP.equals(metricType)) {
      send(new Message(
          metric.getTimestamp(),
          Type.METER,
          metric.getApplicationName(),
          MEMBER_EVENT_UP,
          metric.getRole()
      ));

    } else if (MEMBER_EVENT_DOWN.equals(metricType)) {
      send(new Message(
          metric.getTimestamp(),
          Type.METER,
          metric.getApplicationName(),
          MEMBER_EVENT_DOWN,
          metric.getRole()
      ));

    } else if (METER_INBOX.equals(metricType) || METER_PROCESSED.equals(metricType) || METER_SENT.equals(metricType)) {
      String normalizedApplicationName = normalize(metric.getApplicationName());
      Message message = new Message(
          metric.getTimestamp(),
          Type.METER,
          normalizedApplicationName + "-" + metric.getRole(),
          metricType,
          metric.getValue() + " (" + metric.getRate() + "/s)"
      );
      send(message);
      MetricsData.setMeter(message);

    } else {
      LOGGER.info("{}-{}, {}: {}", metric.getApplicationName(), metric.getRole(), metricType, metric.getValue());
    }
  }

  private String getUniqueRoleId(PipelineMetrics metric) {
    return normalize(metric.getApplicationName()) + "-" + metric.getRole();
  }

  private String normalize(String name) {
    return NON_CHAR_PATTERN.matcher(name).replaceAll("_");
  }

  private void send(Message message) {
    template.convertAndSend("/topic/metrics", message);
  }

  @Override
  protected void memberAdded(ActorRef actorRef, MemberInfo memberInfo) {
    MetricsData.addApplication(actorRef, memberInfo.getApplicationName(), memberInfo.getRoles());
  }

  @Override
  protected void memberRemoved(ActorRef actorRef) {
    MetricsData.remoteApplication(actorRef);
  }
}