package com.example.restapi.controller;

import com.example.restapi.model.entity.PageviewCount;
import com.example.restapi.model.network.request.PageviewCountRequest;
import com.example.restapi.model.network.response.PageviewCountResponseDto;
import com.example.restapi.service.PageviewService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/pageview")
public class PageviewController {
    private final PageviewService pageviewService;

    public PageviewController(PageviewService pageviewService) {
        this.pageviewService = pageviewService;
    }

    @PostMapping("")
    public ResponseEntity<PageviewCountResponseDto> updatePageview(@RequestBody PageviewCountRequest request){
        return pageviewService.updatePageview(request);
    }

    @GetMapping("")
    public ResponseEntity<List<PageviewCountResponseDto>> todayCount(){
        return pageviewService.getCountByDate();
    }
}
