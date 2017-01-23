FROM orctom/java:8u65-jre
VOLUME /tmp
ADD pipeline-dashboard-1.0-SNAPSHOT.jar /app.jar
ENV JAVA_OPTS=""
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]