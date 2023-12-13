package com.graphomics.spring.jwt.mongodb.service;

import com.graphomics.spring.jwt.mongodb.models.Relationship;
import com.graphomics.spring.jwt.mongodb.repository.RelationshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RelationshipService {

    @Autowired
    private RelationshipRepository repository;

    public List<Relationship> findAll() {
        return repository.findAll();
    }

    public Optional<Relationship> findById(String id) {
        return repository.findById(id);
    }

    public Relationship save(Relationship relationship) {
        return repository.save(relationship);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
