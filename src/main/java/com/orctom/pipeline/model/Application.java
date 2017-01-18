package com.orctom.pipeline.model;

import com.google.common.base.Strings;

public class Application {

  private String name;
  private String roles;

  public Application(String name, String roles) {
    this.name = name;
    this.roles = roles;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getRoles() {
    return roles;
  }

  public void setRoles(String roles) {
    this.roles = roles;
  }

  void addRoles(String roles) {
    if (Strings.isNullOrEmpty(roles)) {
      return;
    }

    if (Strings.isNullOrEmpty(this.roles)) {
      this.roles = roles;
    } else {
      this.roles += "," + roles;
    }
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
