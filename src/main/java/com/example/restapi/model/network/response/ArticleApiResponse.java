package com.example.restapi.model.network.response;

import com.example.restapi.model.entity.Category;
import lombok.Builder;

import java.util.List;

@Builder
public class ArticleApiResponse {
    private Integer id;
    private String title;
    private String content;
    private String createdId;
    private String createdAt;
    private String categoryName;
    private Integer categoryId;
    private Integer visitCnt;
    private List<CommentApiResponse> comment;

    private Category category;




    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreatedId() {
        return createdId;
    }

    public void setCreatedId(String createdId) {
        this.createdId = createdId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getVisitCnt() {
        return visitCnt;
    }

    public void setVisitCnt(Integer visitCnt) {
        this.visitCnt = visitCnt;
    }

    public List<CommentApiResponse> getComment() {
        return comment;
    }

    public void setComment(List<CommentApiResponse> comment) {
        this.comment = comment;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }
}
