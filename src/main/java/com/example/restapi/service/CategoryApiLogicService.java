package com.example.restapi.service;

import com.example.restapi.ifs.CrudInterface;
import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Category;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.CategoryApiRequest;
import com.example.restapi.model.network.response.CategoryApiResponse;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CategoryRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryApiLogicService implements CrudInterface<CategoryApiRequest, CategoryApiResponse> {


    private final CategoryRepository categoryRepository;

    private final ArticleRepository articleRepository;

    public CategoryApiLogicService(@Lazy CategoryRepository categoryRepository, @Lazy ArticleRepository articleRepository) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
    }

    @Override
    public Header<CategoryApiResponse> create(Header<CategoryApiRequest> request) {
        CategoryApiRequest body = request.getData();

        Category category = Category.builder()
                .id(body.getId())
                .name(body.getName())
                .build();

        Category newCategory = categoryRepository.save(category);
        return response(newCategory);
    }

    @Override
    public Header<CategoryApiResponse> read(int id) {
        return categoryRepository.findById(id)
                .map(category -> response(category))
                .orElseGet(()-> Header.ERROR("No DATA"));
    }

    // category 목록
    public List<CategoryApiResponse> getList() {
        List<CategoryApiResponse> newList = new ArrayList<CategoryApiResponse>();
        for(Category category: categoryRepository.findAll()){
            CategoryApiResponse addBody = CategoryApiResponse.builder()
                    .id(category.getId())
                    .name(category.getName())
                    .build();

            newList.add(addBody);
        }
        return newList;
    }

    @Override
    public Header<CategoryApiResponse> update(Header<CategoryApiRequest> request, int id) {
        CategoryApiRequest body = request.getData();

        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(body.getName());
                    return category;
                })
                .map(newCategory -> categoryRepository.save(newCategory))
                .map(category -> response(category))
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

    private Header<CategoryApiResponse> response(Category category) {
        CategoryApiResponse body = CategoryApiResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();

        return Header.OK(body);
    }


}
