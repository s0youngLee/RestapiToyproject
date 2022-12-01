package com.example.restapi.model.network.request;

import lombok.Builder;

@Builder
public class PageviewCountRequest {
    private String pageUrl;
    private String pageName;

    public String getPageUrl() {
        return pageUrl;
    }

    public String getPageName() {
        return pageName;
    }
}
