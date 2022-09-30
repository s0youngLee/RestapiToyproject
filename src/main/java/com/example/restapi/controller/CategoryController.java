package com.example.restapi.controller;

import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.CategoryRequest;
import com.example.restapi.model.network.response.CategoryResponseDto;
import com.example.restapi.service.CategoryApiLogicService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/category")
public class CategoryController extends AbstractCrudMethod<CategoryRequest, CategoryResponseDto> {
    private final CategoryApiLogicService categoryApiLogicService;
    public CategoryController(@Lazy CategoryApiLogicService categoryApiLogicService) {
        this.categoryApiLogicService = categoryApiLogicService;
    }

    @PostConstruct
    public void init(){
        this.baseService = categoryApiLogicService;
    }

    @GetMapping("")
    public Header<List<CategoryResponseDto>> getCategoryList(){
        return Header.OK(categoryApiLogicService.getList());
    }

}