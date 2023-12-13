package com.graphomics.spring.jwt.mongodb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

 
    // @KafkaListener(topics = "workflow", groupId = "group-id")
    // public void consumeMessage(String message) {
    //     // Process the received message
    //     System.out.println("Received message: " + message);
    // }
}
