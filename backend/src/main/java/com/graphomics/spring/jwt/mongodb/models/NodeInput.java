package com.graphomics.spring.jwt.mongodb.models;

public class NodeInput {
    private final Object data;

    public NodeInput(Object data) {
        this.data = data;
    }

    public Object getData() {
        return data;
    }
}