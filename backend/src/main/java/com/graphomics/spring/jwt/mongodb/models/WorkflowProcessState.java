package com.graphomics.spring.jwt.mongodb.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "workflow_process_state")
public class WorkflowProcessState {
    @Id
    private String id;
private String workflowName;
private String executionState;
private String endTime;
private String startTime;

 public String getWorkflowName() {
        return workflowName;
    }

    public void setWorkflowName(String workfme) {
        this.workflowName = workflowName;
    }

    // Getter and Setter methods for executionState
    public String getExecutionState() {
        return executionState;
    }

    public void setExecutionState(String executionState) {
        this.executionState = executionState;
    }

    
    // Getter and Setter methods for executionTime
    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }
   public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
    // Getters and setters

}
