package com.example.inventory.service;


import org.springframework.scheduling.annotation.Scheduled;

import org.springframework.stereotype.Component;
 
@Component
public class InventorySchedular {
 
    private final InventoryService service;
 
    public InventorySchedular(InventoryService service) {
        this.service = service;
    }
 
    @Scheduled(fixedRate = 60000) 
    public void checkTimeout() {
    	
        service.releaseTimeoutStock();
    }
}