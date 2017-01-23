package com.orctom.pipeline.dashboard.model;

import akka.actor.ActorRef;
import com.google.common.base.Splitter;

import java.util.*;

public class MetricsData {

  private static Map<ActorRef, Application> applications = new LinkedHashMap<>();
  private static Map<String, Message> roleConnections = new HashMap<>();
  private static Map<String, Message> roleMeters = new HashMap<>();
  private static Set<Message> connections = new HashSet<>();
  private static Set<Message> meters = new LinkedHashSet<>();

  public static void addApplication(ActorRef actorRef, String applicationName, String roles) {
    Application application = applications.putIfAbsent(actorRef, new Application(applicationName, roles));
    if (null != application) {
      application.addRoles(roles);
    }
  }

  public static void remoteApplication(ActorRef actorRef) {
    Application application = applications.remove(actorRef);
    if (null != application) {
       Splitter.on(",").trimResults().split(application.getRoles()).forEach(role -> {
         connections.remove(roleConnections.remove(role));
         meters.remove(roleMeters.remove(role));
       });
    }
  }

  public static Collection<Application> getApplications() {
    return applications.values();
  }

  public static void setMeter(Message message) {
    meters.add(message);
    roleMeters.put(message.getKey(), message);
  }

  public static Set<Message> getMeters() {
    return meters;
  }

  public static void addConnection(Message message) {
    connections.add(message);
    roleConnections.put(message.getKey(), message);
  }

  public static Set<Message> getConnections() {
    return connections;
  }
}
