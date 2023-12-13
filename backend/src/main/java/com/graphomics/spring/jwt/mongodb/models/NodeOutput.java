package com.graphomics.spring.jwt.mongodb.models;

public class NodeOutput {
    private final Object data;

    public NodeOutput(Object data) {
        this.data = data;
    }

    public Object getData() {
        return data;
    }
}
