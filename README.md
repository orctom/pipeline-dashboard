## pipeline-dashboard

### Command Line
```
java -jar \
    -Dcluster=dummy \
    -Dakka.remote.netty.tcp.port=19000 \
    -Dakka.cluster.seed.zookeeper.url=localhost:2181 \
    target/pipeline-dashboard-1.0-SNAPSHOT.jar
 ```

### Docker
```
docker run \
    -d \
    --name pipeline-dashboard \
    -e cluster=dummy \
    -e akka.remote.netty.tcp.port=19000 \
    -e akka.cluster.seed.zookeeper.url=10.10.1.200:2181 \
    -p 19000:19000
    orctom/pipeline-dasboard
```
