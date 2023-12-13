package com.graphomics.spring.jwt.mongodb.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "relationships")
public class Relationship {

    @Id
    private String id;

    // private String ;
    private String relationshipName;

    public void setRelationshipName(String name) {
        this.relationshipName = name;
    }

    public String getRelationshipName() {
        return this.relationshipName;
    }
    // Constructors, getters, setters, etc.
}
