package com.example.restapi.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Category;
import com.example.restapi.model.network.request.CategoryRequest;
import com.example.restapi.model.network.response.CategoryResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CategoryRepository;

@Service
public class CategoryService{
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;

    public CategoryService(CategoryRepository categoryRepository, @Lazy ArticleRepository articleRepository) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
    }

    public ResponseEntity<CategoryResponseDto> create(CategoryRequest request) {
        Category category = Category.builder()
                .id(request.getId())
                .name(request.getName())
                .build();

        return ResponseEntity.ok(buildCategory(categoryRepository.save(category)));
    }

    public ResponseEntity<CategoryResponseDto> read(int id) {
        try{
            return ResponseEntity.ok(buildCategory(categoryRepository.getReferenceById(id)));
        }catch (IllegalArgumentException | EntityNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }


    public ResponseEntity<CategoryResponseDto> update(CategoryRequest request, int id) {
        try{
            categoryRepository.findById(id)
                .map(category -> {
                    category.setName(request.getName());
                    return category;
                })
                .map(categoryRepository::save);
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.noContent().build();
    }

    @Transactional
    public ResponseEntity<CategoryResponseDto> delete(int categoryId) {
        List<Article> articleList = articleRepository.findAll();

        for(Article article : articleList){
            if((article.getCategory().getId() == categoryId)){
                article.setCategory(Category.builder()
                                .id(0).build());
            }
        }

        try {
            categoryRepository.delete(categoryRepository.getReferenceById(categoryId));
        }catch (IllegalArgumentException | EntityNotFoundException e){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<List<CategoryResponseDto>> getList() {
        List<CategoryResponseDto> newList = new ArrayList<>();
        for(Category category: categoryRepository.findAll()){
            newList.add(buildCategory(category));
        }
        return ResponseEntity.ok(newList);
    }

    private CategoryResponseDto buildCategory(Category category){
        return CategoryResponseDto.builder()
                .id(category.getId())
                .name(category.getName())
                .articleCnt(category.getArticleList() == null ? 0 : category.getArticleList().size())
                .build();
    }
}
