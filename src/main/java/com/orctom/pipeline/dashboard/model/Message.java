package com.orctom.pipeline.dashboard.model;

public class Message {

  private long timestamp;
  private Type type;
  private String key;
  private String field;
  private String value;

  public Message(Type type, String key, String value) {
    this(System.currentTimeMillis(), type, key, null, value);
  }

  public Message(long timestamp, Type type, String key, String value) {
    this(timestamp, type, key, null, value);
  }

  public Message(long timestamp, Type type, String key, String field, String value) {
    this.timestamp = timestamp;
    this.type = type;
    this.key = key;
    this.field = field;
    this.value = value;
  }

  public long getTimestamp() {
    return timestamp;
  }

  public Type getType() {
    return type;
  }

  public String getKey() {
    return key;
  }

  public String getField() {
    return field;
  }

  public String getValue() {
    return value;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Message message = (Message) o;

    if (!key.equals(message.key)) return false;
    return field != null ? field.equals(message.field) : message.field == null;
  }

  @Override
  public int hashCode() {
    int result = key.hashCode();
    result = 31 * result + (field != null ? field.hashCode() : 0);
    return result;
  }

  @Override
  public String toString() {
    return "Message{" +
        "timestamp=" + timestamp +
        ", type=" + type +
        ", key='" + key + '\'' +
        ", field='" + field + '\'' +
        ", value='" + value + '\'' +
        '}';
  }
}
