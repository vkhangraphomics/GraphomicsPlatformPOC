package com.graphomics.spring.jwt.mongodb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.graphomics.spring.jwt.mongodb.models.Workflow;

public interface WorkflowRepository extends MongoRepository<Workflow, String> {
    
}


