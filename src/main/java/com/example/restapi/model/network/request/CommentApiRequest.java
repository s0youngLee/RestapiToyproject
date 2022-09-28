package com.example.restapi.model.network.request;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class CommentApiRequest {
    private Integer id;

    private String userId;

    private String content;

    private LocalDateTime createdAt;

    private Integer articleId;

    public Integer getArticleId() {
        return articleId;
    }

    public void setArticleId(Integer articleId) {
        this.articleId = articleId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUserId(String userId){
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
