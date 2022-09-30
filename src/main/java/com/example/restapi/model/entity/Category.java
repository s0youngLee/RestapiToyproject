package com.example.restapi.model.entity;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Builder;
import lombok.experimental.Accessors;

@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Accessors(chain = true)
public class Category {
    @Id
    private Integer id;
    private String name;
    @OneToMany(mappedBy = "category")
    private List<Article> articleList;


    public Category() {

    }

    public Category(Integer id, String name, List<Article> articleList) {
        this.id = id;
        this.name = name;
        this.articleList = articleList;
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

    public List<Article> getArticleList() { return articleList;}
    public void setArticleList(List<Article> articleList) {this.articleList = articleList;}

}
