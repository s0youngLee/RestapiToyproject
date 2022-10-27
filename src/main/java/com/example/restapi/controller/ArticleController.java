package com.example.restapi.controller;

import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Status;
import com.example.restapi.model.network.request.ArticleRequest;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.ArticleResponseDto;
import com.example.restapi.service.ArticleService;

@RestController
@SessionAttributes("user")
@RequestMapping("/board")
public class ArticleController extends AbstractCrudMethod<ArticleRequest, ArticleResponseDto> {
    private final ArticleService articleService;
    public ArticleController(@Lazy ArticleService articleService) {
        this.articleService = articleService;
    }
    @ModelAttribute("user")
    public UserInfo userForm(){
        return new UserInfo();
    }

    @PostConstruct
    public void init(){
        this.baseService = articleService;
    }

    @GetMapping("")
    public Status<List<ArticleListResponseDto>> getArticleList() {
        return Status.OK(articleService.getList());
    }

    @GetMapping("/category/{categoryId}")
    public Status<List<ArticleListResponseDto>> getArticlesByCategory(@PathVariable int categoryId){
        return Status.OK(articleService.getArticleListByCategory(categoryId));
    }

    @GetMapping("/user")
    public List<ArticleListResponseDto> getMyArticles(@SessionAttribute("user") UserInfo user){
        return articleService.getUserArticles(user.getNickName());
    }

    @GetMapping("/search/{keyword}")
    public List<ArticleListResponseDto> getSearchResults(@PathVariable String keyword){
        return articleService.getSearchResults(keyword);
    }

}
