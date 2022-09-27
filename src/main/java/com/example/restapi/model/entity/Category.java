package com.example.restapi.model.entity;


import lombok.Builder;
import lombok.experimental.Accessors;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;



@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Accessors(chain = true)
public class Category {

    @Id
    private Integer id;

    private String name;

    public Category() {

    }

    public Category(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
