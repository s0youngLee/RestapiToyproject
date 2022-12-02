package com.example.restapi.service;

import com.example.restapi.model.entity.PageviewCount;
import com.example.restapi.model.network.request.PageviewCountRequest;
import com.example.restapi.model.network.response.PageviewCountResponseDto;
import com.example.restapi.repository.PageviewRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Log4j2
@Service
public class PageviewService {
    private final PageviewRepository pageviewRepository;

    public PageviewService(PageviewRepository pageviewRepository) {
        this.pageviewRepository = pageviewRepository;
    }

    public ResponseEntity<Integer> updatePageview(PageviewCountRequest request) {
        PageviewCount page;
        if(pageviewRepository.findByPageUrl(request.getPageUrl()) != null){
            page = pageviewRepository.findByPageUrl(request.getPageUrl());
            page.update();
        }else{
            page = new PageviewCount(request.getPageUrl(), request.getPageName());
        }
        pageviewRepository.save(page);
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<List<PageviewCountResponseDto>> getCountByDate(){
        Date date = new Date(System.currentTimeMillis());
        List<PageviewCountResponseDto> countList = new ArrayList<>();

        for(PageviewCount page : pageviewRepository.findAllByDate(date)){
            countList.add(PageviewCountResponseDto.builder()
                            .pageName(page.getPageName())
                            .date(page.getDate())
                            .count(page.getCount())
                            .build());
        }
        return ResponseEntity.ok(countList);
    }
}
