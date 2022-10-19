package com.example.restapi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.example.restapi.controller.AbstractCrudMethod;
import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Category;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.CategoryRequest;
import com.example.restapi.model.network.response.CategoryResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CategoryRepository;

@Service
public class CategoryApiLogicService extends AbstractCrudMethod<CategoryRequest, CategoryResponseDto> {
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;

    public CategoryApiLogicService(@Lazy CategoryRepository categoryRepository, @Lazy ArticleRepository articleRepository) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
    }

    @Override
    public Header<CategoryResponseDto> create(Header<CategoryRequest> request) {
        System.out.println(request);
        CategoryRequest body = request.getData();

        Category category = Category.builder()
                .id(body.getId())
                .name(body.getName())
                .build();

        return Header.OK(buildCategory(categoryRepository.save(category)));
    }

    @Override
    public Header<CategoryResponseDto> read(int id) {
        return categoryRepository.findById(id)
                .map(category -> Header.OK(buildCategory(categoryRepository.save(category))))
                .orElseGet(()-> Header.ERROR("No DATA"));
    }

    // category 목록
    @Override
    public Header<CategoryResponseDto> update(Header<CategoryRequest> request, int id) {
        CategoryRequest body = request.getData();

        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(body.getName());
                    return category;
                })
                .map(categoryRepository::save)
                .map(category -> Header.OK(buildCategory(categoryRepository.save(category))))
                .orElseGet(()->Header.ERROR("No DATA"));
    }

    @Override
    public Header delete(int categoryId) {
        List<Article> articleList = articleRepository.findAll();

        for(Article article : articleList){
            if((article.getCategory().getId() == categoryId)){
                article.setCategory(Category.builder()
                                .id(0).build());
            }
        }
        return categoryRepository.findById(categoryId)
                .map(category -> {
                    categoryRepository.delete(category);
                    return Header.OK();
                })
                .orElseGet(()->Header.ERROR("NO DATA"));
    }

    public List<CategoryResponseDto> getList() {
        List<CategoryResponseDto> newList = new ArrayList<>();
        for(Category category: categoryRepository.findAll()){
            newList.add(buildCategory(category));
        }
        return newList;
    }

    private CategoryResponseDto buildCategory(Category category){
        return CategoryResponseDto.builder()
                .id(category.getId())
                .name(category.getName())
                .articleCnt(category.getArticleList() == null ? 0 : category.getArticleList().size())
                .build();
    }
}
