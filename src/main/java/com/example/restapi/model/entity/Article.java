package com.example.restapi.model.entity;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Builder;
import lombok.experimental.Accessors;

@Entity
@Builder
@EntityListeners(AuditingEntityListener.class)
@Accessors(chain = true)
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private Integer visitCnt;
    private LocalDateTime finalEditDate;
    @ManyToOne
    @JoinColumn(name="created_id")
    private UserInfo user;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "article", cascade = CascadeType.REMOVE)
    private List<Comment> comment;

    @OneToMany(mappedBy = "article", cascade = CascadeType.REMOVE)
    private List<Filedata> files;

    public Article() {

    }

    public Article(Integer id, String title, String content, LocalDateTime createdAt,
        Integer visitCnt,
        LocalDateTime finalEditDate, UserInfo user, Category category, List<Comment> comment, List<Filedata> files) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.visitCnt = visitCnt;
        this.finalEditDate = finalEditDate;
        this.user = user;
        this.category = category;
        this.comment = comment;
        this.files = files;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public LocalDateTime getFinalEditDate() {
        return finalEditDate;
    }

    public void setFinalEditDate(LocalDateTime finalEditDate) {
        this.finalEditDate = finalEditDate;
    }

    public List<Filedata> getFiles() {
        return files;
    }

    public void setFiles(List<Filedata> files) {
        this.files = files;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getVisitCnt() {
        return visitCnt;
    }

    public void setVisitCnt(Integer visitCnt) {
        this.visitCnt = visitCnt;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Comment> getComment() {
        return comment;
    }

    public void setComment(List<Comment> comment) {
        this.comment = comment;
    }
}
