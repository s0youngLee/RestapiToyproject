package com.example.restapi.controller;

import com.example.restapi.model.entity.PageviewCount;
import com.example.restapi.model.network.request.PageviewCountRequest;
import com.example.restapi.repository.PageviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController("/pageview")
public class PageviewController {
    private final PageviewRepository pageviewRepository;

    public PageviewController(PageviewRepository pageviewRepository) {
        this.pageviewRepository = pageviewRepository;
    }

    @PostMapping("/{url}")
    public ResponseEntity<Integer> updatePageview(@RequestBody PageviewCountRequest request, @PathVariable String url){
        PageviewCount page = new PageviewCount(request.getPageUrl(), request.getPageName());
        page.update();
        pageviewRepository.save(page);
        return ResponseEntity.noContent().build();
    }
}
