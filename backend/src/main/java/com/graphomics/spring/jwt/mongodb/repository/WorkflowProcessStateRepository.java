package com.graphomics.spring.jwt.mongodb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.graphomics.spring.jwt.mongodb.models.WorkflowProcessState;

public interface WorkflowProcessStateRepository  extends MongoRepository<WorkflowProcessState, String> {
    
}


