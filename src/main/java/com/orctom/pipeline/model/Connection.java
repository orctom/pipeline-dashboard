package com.orctom.pipeline.model;

public class Connection {

  private String source;
  private String target;

  public Connection(String source, String target) {
    this.source = source;
    this.target = target;
  }

  public String getSource() {
    return source;
  }

  public void setSource(String source) {
    this.source = source;
  }

  public String getTarget() {
    return target;
  }

  public void setTarget(String target) {
    this.target = target;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Connection that = (Connection) o;

    if (source != null ? !source.equals(that.source) : that.source != null) return false;
    return target != null ? target.equals(that.target) : that.target == null;
  }

  @Override
  public int hashCode() {
    int result = source != null ? source.hashCode() : 0;
    result = 31 * result + (target != null ? target.hashCode() : 0);
    return result;
  }

  @Override
  public String toString() {
    return "Connection{" +
        "source='" + source + '\'' +
        ", target='" + target + '\'' +
        '}';
  }
}
