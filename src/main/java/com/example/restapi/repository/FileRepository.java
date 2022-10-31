package com.example.restapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restapi.model.entity.Files;

@Repository
public interface FileRepository extends JpaRepository<Files, Integer> {
}
