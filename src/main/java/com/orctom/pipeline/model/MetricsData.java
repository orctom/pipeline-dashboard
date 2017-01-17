package com.orctom.pipeline.model;

import com.google.common.base.Splitter;

import java.util.*;

public class MetricsData {

  private static Map<String, Application> applications = new HashMap<>();

  private static Set<Connection> connections = new HashSet<>();

  public static void addApplication(String applicationName, String roles) {
    Set<String> roleSet = new HashSet<>(Splitter.on(",").omitEmptyStrings().trimResults().splitToList(roles));
    Application application = applications.putIfAbsent(applicationName, new Application(applicationName, roleSet));
    if (null != application) {
      application.getRoles().addAll(roleSet);
    }
  }

  public static Collection<Application> getApplications() {
    return applications.values();
  }

  public static boolean addConnection(String source, String target) {
    return connections.add(new Connection(source, target));
  }

  public static void remoteConnection(String source, String target) {
    connections.remove(new Connection(source, target));
  }
}
