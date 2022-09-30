package com.example.restapi.controller;

import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.ArticleRequest;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.ArticleResponseDto;
import com.example.restapi.service.ArticleApiLogicService;

@RestController
@RequestMapping("/board")
public class ArticleController extends AbstractCrudMethod<ArticleRequest, ArticleResponseDto> {
    private final ArticleApiLogicService articleApiLogicService;
    public ArticleController(@Lazy ArticleApiLogicService articleApiLogicService) {
        this.articleApiLogicService = articleApiLogicService;
    }

    @PostConstruct
    public void init(){
        this.baseService = articleApiLogicService;
    }

    @GetMapping("")
    public Header<List<ArticleListResponseDto>> getArticleList() {
        return Header.OK(articleApiLogicService.getList());
    }

    @GetMapping("/category/{categoryId}")
    public Header<List<ArticleListResponseDto>> getArticlesByCategory(@PathVariable int categoryId){
        return Header.OK(articleApiLogicService.getArticleListByCategory(categoryId));
    }

}
