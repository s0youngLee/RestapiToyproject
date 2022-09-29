package com.example.restapi.model.network.response;

import lombok.Builder;

@Builder
public class CategoryApiResponse {

    private Integer id;

    private String name;

    private Integer articleCnt;

    public Integer getArticleCnt() {
        return articleCnt;
    }

    public void setArticleCnt(Integer articleCnt) {
        this.articleCnt = articleCnt;
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
