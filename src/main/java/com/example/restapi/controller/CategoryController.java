package com.example.restapi.controller;

import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.CategoryApiRequest;
import com.example.restapi.model.network.response.CategoryApiResponse;
import com.example.restapi.service.CategoryApiLogicService;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

//    카테고리 목록 ( /category ) GET
    @GetMapping("")
    public Header<List<CategoryApiResponse>> getCategoryList(){
        return Header.OK(categoryApiLogicService.getList());
    }

}