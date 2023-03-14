package com.example.restapi.model.entity;

import lombok.Builder;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.sql.Date;

@Entity
@Table(name = "pageview_count")
public class PageviewCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "page_url")
    private String pageUrl;

    @Column(name = "count")
    private Integer count;

    @Column(name = "page_name")
    private String pageName;

    @Column(name = "date")
    private Date date;

    public PageviewCount(String url, String name) {
        this.pageUrl = url;
        this.pageName = name;
        this.count = 1;
        this.date = new Date(System.currentTimeMillis());
    }

    public PageviewCount() {

    }

    public Date getDate() {
        return this.date;
    }

    public String getPageName() {
        return this.pageName;
    }

    public Integer getCount() {
        return this.count;
    }

    public void update(){
        this.count += 1;
    }
}
