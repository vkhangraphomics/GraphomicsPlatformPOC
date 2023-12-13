package com.graphomics.spring.jwt.mongodb.models;

import java.util.List;

public class FileItem {
    private String name;
    private String type; // "folder" or "file"
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public List<FileItem> getChildren() {
        return children;
    }
    public void setChildren(List<FileItem> children) {
        this.children = children;
    }
    private List<FileItem> children;

    // Constructor, getters, and setters
}