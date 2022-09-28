package com.example.restapi.repository;

import com.example.restapi.model.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {

    @Modifying
    @Query("update Article a set a.visitCnt = a.visitCnt + 1 where a.id = :articleId")
    int updateVisitCnt(int articleId);

}