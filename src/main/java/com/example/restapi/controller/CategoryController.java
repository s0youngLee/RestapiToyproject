package com.example.restapi.controller;

import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.CategoryApiRequest;
import com.example.restapi.model.network.response.ArticleListApiResponse;
import com.example.restapi.model.network.response.CategoryApiResponse;
import com.example.restapi.service.CategoryApiLogicService;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/category")
public class CategoryController extends CrudController<CategoryApiRequest, CategoryApiResponse>{

    private final CategoryApiLogicService categoryApiLogicService;

    public CategoryController(@Lazy CategoryApiLogicService categoryApiLogicService) {
        this.categoryApiLogicService = categoryApiLogicService;
    }

    @PostConstruct
    public void init(){
        this.baseService = categoryApiLogicService;
    }

//   카테고리별 목록 ( /category/board/{category_id} ) GET
    @GetMapping("/board/{categoryId}")
    public Header<List<ArticleListApiResponse>> getCategoryArticle(@PathVariable int categoryId){
        return Header.OK(categoryApiLogicService.getArticleListByCategory(categoryId));
    }

//    카테고리 목록 ( /category ) GET
    @GetMapping("")
    public Header<List<CategoryApiResponse>> getCategoryList(){
        return Header.OK(categoryApiLogicService.getList());
    }

}