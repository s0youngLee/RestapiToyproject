package com.example.restapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.restapi.model.entity.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {
    List<Article> findAllByCategoryId(Integer id);
    @Modifying
    @Query("update Article a set a.visitCnt = a.visitCnt + 1 where a.id = :articleId")
    void updateVisitCnt(int articleId);

}