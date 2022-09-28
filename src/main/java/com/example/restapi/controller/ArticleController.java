package com.example.restapi.controller;

import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.ArticleApiRequest;
import com.example.restapi.model.network.response.ArticleApiResponse;
import com.example.restapi.model.network.response.ArticleListApiResponse;
import com.example.restapi.service.ArticleApiLogicService;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.List;

@RestController
@RequestMapping("/board")
public class ArticleController extends CrudController<ArticleApiRequest, ArticleApiResponse> {

    private final ArticleApiLogicService articleApiLogicService;


    public ArticleController(@Lazy ArticleApiLogicService articleApiLogicService) {
        this.articleApiLogicService = articleApiLogicService;
    }


    @PostConstruct
    public void init(){
        this.baseService = articleApiLogicService;
    }

//    게시글 목록
    @GetMapping("")
    public Header<List<ArticleListApiResponse>> getArticleList() {
        return Header.OK(articleApiLogicService.getList());
    }

}
