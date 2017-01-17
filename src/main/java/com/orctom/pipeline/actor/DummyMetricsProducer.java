package com.orctom.pipeline.actor;

import akka.actor.ActorRef;
import akka.actor.UntypedActor;
import com.orctom.laputa.model.Metric;
import com.orctom.pipeline.ActorFactory;
import com.orctom.pipeline.annotation.Actor;
import com.orctom.pipeline.model.PipelineMetrics;
import org.apache.commons.lang3.RandomStringUtils;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Actor("dummyProducer")
public class DummyMetricsProducer extends UntypedActor {

  private ActorRef metricCollector = ActorFactory.actorOf(MetricsCollector.class);

  @Override
  public void preStart() throws Exception {
    super.preStart();
//    startSendingThread();
  }

  private void startSendingThread() {
    ExecutorService es = Executors.newSingleThreadExecutor();
    es.submit(() -> {
      while (!Thread.currentThread().isInterrupted()) {
        try {
          Metric metrics = new Metric("key", RandomStringUtils.randomAlphabetic(5));
          metricCollector.tell(
              new PipelineMetrics("Metrics Center", "dummy-actor", metrics),
              getSelf()
          );
          TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
      }
    });
  }

  @Override
  public void onReceive(Object message) throws Throwable {

  }
}
