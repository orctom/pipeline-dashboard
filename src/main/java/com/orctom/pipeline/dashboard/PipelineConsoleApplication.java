package com.orctom.pipeline.dashboard;

import com.orctom.pipeline.Pipeline;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
@Import(WebSocketConfig.class)
public class PipelineConsoleApplication extends WebMvcConfigurerAdapter {

  private static final Logger LOGGER = LoggerFactory.getLogger(PipelineConsoleApplication.class);

  public static void main(String[] args) {

    ApplicationContext applicationContext = SpringApplication.run(PipelineConsoleApplication.class, args);

    try {
      Pipeline.getInstance()
          .withApplicationName("collector")
          .withApplicationContext(applicationContext)
          .run(PipelineConsoleApplication.class);
    } catch (Exception e) {
      LOGGER.error(e.getMessage(), e);
      SpringApplication.exit(applicationContext);
    }
  }
}
