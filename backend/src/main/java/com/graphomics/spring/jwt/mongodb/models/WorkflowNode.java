package com.graphomics.spring.jwt.mongodb.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "workflows")
public class WorkflowNode {
    @Id
    private String id;
    private String workflowName;
    private List<WorkflowNode> nodes;

    // Getters and Setters
}
