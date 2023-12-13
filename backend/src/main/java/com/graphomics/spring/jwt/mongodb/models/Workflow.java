package com.graphomics.spring.jwt.mongodb.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.google.gson.JsonArray;

@Document(collection = "workflow")
public class Workflow {
    @Id
    private String id;

    private String workflowName; // Store the JSON as a string
    private String nodes;                

    // Getters and setters
    public String getId() {
        return id;
    }

    public String getWorkflowName() {
        return workflowName;
    }

    public void setWorkflowName(String workflowName) {
        this.workflowName = workflowName;
    }

      public String getNodes() {
        return nodes;
    }

    public void setNodes(String nodes) {
        this.nodes = nodes;
    }

    public void setJson(String string) {
    }
}
