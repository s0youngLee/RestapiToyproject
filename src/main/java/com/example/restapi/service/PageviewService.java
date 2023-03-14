package com.example.restapi.service;

import com.example.restapi.model.entity.PageviewCount;
import com.example.restapi.model.network.request.PageviewCountRequest;
import com.example.restapi.model.network.response.PageviewCountResponseDto;
import com.example.restapi.repository.PageviewRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Log4j2
@Service
public class PageviewService {
    private final PageviewRepository pageviewRepository;

    public PageviewService(PageviewRepository pageviewRepository) {
        this.pageviewRepository = pageviewRepository;
    }



    public ResponseEntity<PageviewCountResponseDto> updatePageview(PageviewCountRequest request) {
        List<PageviewCount> pageList = pageviewRepository.findByPageUrl(request.getPageUrl());
        try{
            int cnt = 0;
            for(PageviewCount page : pageList){
                String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date(System.currentTimeMillis()));
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date today = new Date(dateFormat.parse(date).getTime());

                if(today.compareTo(page.getDate()) == 0){
                    page.update();
                    pageviewRepository.save(page);



                    log.info("Page info : {} , {}, {}", page.getPageName(), page.getCount(), page.getDate());
                }else{
                    cnt ++;
                }
            }
            if(cnt == pageList.size()){
                pageviewRepository.save(new PageviewCount(request.getPageUrl(), request.getPageName()));
                log.info("New page info registered. Page info : {} , {}", request.getPageUrl(), request.getPageName());
            }
        }catch (NullPointerException e){
            log.error("Null pointer exception : page lit not found");
        } catch (ParseException e) {
            log.error("ParseException");
            throw new RuntimeException(e);
        }
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
