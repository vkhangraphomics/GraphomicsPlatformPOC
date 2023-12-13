package com.graphomics.spring.jwt.mongodb.service;
import java.util.List;
import com.graphomics.spring.jwt.mongodb.models.Node;
import com.graphomics.spring.jwt.mongodb.models.NodeInput;
import com.graphomics.spring.jwt.mongodb.models.NodeOutput;

public class WorkflowProcessor {
    private final List<Node> nodes;
private List<String> nodeNames;
    public WorkflowProcessor(List<Node> nodes) {
        this.nodes = nodes;
    }

    public NodeOutput runWorkflow(Object initialData) {
        NodeInput input = new NodeInput(initialData);
        NodeOutput output = null;

        for (Node node : nodes) {
            output = node.execute(input);
            input = new NodeInput(output.getData());
        }

        return output;
    }

       public void WorkflowProcessors(List<String> nodeNames) {
        this.nodeNames = nodeNames;
    }

    // public NodeOutput runWorkfloww(Object initialData) {
    //     NodeInput input = new NodeInput(initialData);
    //     NodeOutput output = null;

    //     for (String node : nodeNames) {
    //         output = node.execute(input);
    //         input = new NodeInput(output.getData());
    //     }

    //     return output;
    // }


}