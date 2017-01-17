package com.orctom.pipeline.model;

import java.util.HashSet;
import java.util.Set;

public class Application {

  private String name;
  private Set<String> roles = new HashSet<>();

  public Application(String name, Set<String> roles) {
    this.name = name;
    this.roles = roles;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(Set<String> roles) {
    this.roles = roles;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Application that = (Application) o;

    return name.equals(that.name);
  }

  @Override
  public int hashCode() {
    return name.hashCode();
  }

  @Override
  public String toString() {
    return "Application{" +
        "name='" + name + '\'' +
        ", roles=" + roles +
        '}';
  }
}
