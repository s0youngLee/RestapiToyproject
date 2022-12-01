package com.example.restapi.repository;

import com.example.restapi.model.entity.PageviewCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PageviewRepository extends JpaRepository<PageviewCount, Integer> {
}
