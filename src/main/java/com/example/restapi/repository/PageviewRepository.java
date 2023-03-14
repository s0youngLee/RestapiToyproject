package com.example.restapi.repository;

import com.example.restapi.model.entity.PageviewCount;
import com.example.restapi.model.network.response.PageviewCountResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface PageviewRepository extends JpaRepository<PageviewCount, String> {
    List<PageviewCount> findByPageUrl(String pageUrl);
    List<PageviewCount> findAllByDate(Date date);
}
