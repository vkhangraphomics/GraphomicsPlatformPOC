package com.graphomics.spring.jwt.mongodb.models;

public class Node {
    public String type;
    public String name; 
    //Override based on need
    public NodeOutput execute(NodeInput input){
        return null;
    }
}