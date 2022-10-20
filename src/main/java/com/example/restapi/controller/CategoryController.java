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
import com.example.restapi.service.CategoryService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/category")
public class CategoryController extends AbstractCrudMethod<CategoryRequest, CategoryResponseDto> {
    private final CategoryService categoryService;
    public CategoryController(@Lazy CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostConstruct
    public void init(){
        this.baseService = categoryService;
    }

    @GetMapping("")
    public Header<List<CategoryResponseDto>> getCategoryList(){
        return Header.OK(categoryService.getList());
    }

}