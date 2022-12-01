package com.example.restapi.model.entity;

import lombok.Builder;

import javax.persistence.*;

@Entity
@Table(name = "pageview_count")
public class PageviewCount {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "page_url")
    private String pageUrl;

    @Column(name = "count")
    private Integer count;

    @Column(name = "page_name")
    private String pageName;

    public PageviewCount(String url, String name) {
        this.pageUrl = url;
        this.pageName = name;
        this.count = 0;
    }

    public PageviewCount() {

    }

    public String getPageName() {
        return pageName;
    }

    public Integer getCount() {
        return count;
    }

    public void update(){
        this.count += 1;
    }
}
