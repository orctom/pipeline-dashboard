package com.orctom.pipeline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
@Import(WebSocketConfig.class)
public class PipelineConsoleApplication extends WebMvcConfigurerAdapter {

  public static void main(String[] args) {
    SpringApplication.run(PipelineConsoleApplication.class, args);
  }
}
