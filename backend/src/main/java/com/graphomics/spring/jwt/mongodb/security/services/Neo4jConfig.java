package com.graphomics.spring.jwt.mongodb.security.services;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Neo4jConfig implements DisposableBean {

    @Value("${spring.neo4j.uri}")
    private String uri;

    @Value("${spring.neo4j.username}")
    private String username;

    @Value("${spring.neo4j.password}")
    private String password;
    private Driver driver;

    @Bean
    public Driver neo4jDriver() {
        this.driver = GraphDatabase.driver(uri, AuthTokens.basic(username, password));
        return this.driver;
    }

    @Override
    public void destroy() {
        if (this.driver != null) {
            this.driver.close();
        }
    }
}
