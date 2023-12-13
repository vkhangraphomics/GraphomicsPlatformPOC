package com.graphomics.spring.jwt.mongodb.security.services;

import javax.annotation.PreDestroy;
import org.neo4j.driver.Driver;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Neo4jDriverManager implements DisposableBean {

    @Autowired
    private Driver driver;

    @Override
    public void destroy() throws Exception {
        if (driver != null) {
            driver.close();
        }
    }
}
