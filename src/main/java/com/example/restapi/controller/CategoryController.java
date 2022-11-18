package com.example.restapi.controller;

import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.restapi.model.network.Status;
import com.example.restapi.model.network.request.CategoryRequest;
import com.example.restapi.model.network.response.CategoryResponseDto;
import com.example.restapi.service.CategoryService;

@RestController
// @CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/category")
public class CategoryController {
    private final CategoryService categoryService;
    public CategoryController(@Lazy CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("")
    public Status<CategoryResponseDto> create(@RequestBody Status<CategoryRequest> request) {
        return categoryService.create(request);
    }

    @GetMapping("{id}")
    public Status<CategoryResponseDto> read(@PathVariable int id) {
        return categoryService.read(id);
    }

    @PutMapping("{id}")
    public Status<CategoryResponseDto> update(@RequestBody Status<CategoryRequest> request, @PathVariable int id) {
        return categoryService.update(request, id);
    }

    @DeleteMapping("{id}")
    public Status delete(@PathVariable int id) {
        return categoryService.delete(id);
    }

    @GetMapping("")
    public Status<List<CategoryResponseDto>> getCategoryList(){
        return Status.OK(categoryService.getList());
    }

}