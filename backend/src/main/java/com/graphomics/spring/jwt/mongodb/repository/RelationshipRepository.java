package com.graphomics.spring.jwt.mongodb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.graphomics.spring.jwt.mongodb.models.Relationship;

public interface RelationshipRepository extends MongoRepository<Relationship, String> {
    // Optional<Role> findByName(ERole name);
}
