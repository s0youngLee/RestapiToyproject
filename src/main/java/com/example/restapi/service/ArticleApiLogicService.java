package com.example.restapi.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.example.restapi.controller.AbstractCrudMethod;
import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Category;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.ArticleRequest;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.ArticleResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CategoryRepository;

@Service
public class ArticleApiLogicService extends AbstractCrudMethod<ArticleRequest, ArticleResponseDto> {
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;
    private final ArticleApiLogicService articleApiLogicService;
    private final CommentApiLogicService commentApiLogicService;

    public ArticleApiLogicService(@Lazy CategoryRepository categoryRepository, @Lazy ArticleRepository articleRepository,
        @Lazy ArticleApiLogicService articleApiLogicService, CommentApiLogicService commentApiLogicService) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
        this.articleApiLogicService = articleApiLogicService;
        this.commentApiLogicService = commentApiLogicService;
    }

    @Override
    public Header<ArticleResponseDto> create(Header<ArticleRequest> request) {

        ArticleRequest body = request.getData();

        Article article = Article.builder()
                .id(body.getId())
                .title(body.getTitle())
                .content(body.getContent())
                .createdId(body.getCreatedId())
                .createdAt(LocalDateTime.now())
                .category(categoryRepository.getReferenceById(body.getCategoryId()))
                .visitCnt(0)
                .comment(new ArrayList<>())
                .build();

        return response(articleRepository.save(article));
    }

    @Override
    @Transactional
    public Header<ArticleResponseDto> read(int id) {
        articleApiLogicService.updateVisitCnt(id);
        return articleRepository.findById(id)
                .map(this::response)
                .orElseGet(()-> Header.ERROR("No DATA"));
    }


    @Override
    public Header<ArticleResponseDto> update(Header<ArticleRequest> request, int id) {
        ArticleRequest body = request.getData();

        return articleRepository.findById(id)
                .map(article -> {
                    article.setTitle(body.getTitle());
                    article.setContent(body.getContent());
                    article.setCreatedId(body.getCreatedId());
                    article.setCreatedAt(LocalDateTime.now());
                    article.setCategory(Category.builder()
                                   .id(body.getCategoryId())
                                   .name(categoryRepository.findById(body.getCategoryId()).get().getName())
                                   .build());
                    return article;
                })
                .map(articleRepository::save)
                .map(this::response)
                .orElseGet(()->Header.ERROR("No DATA"));
    }

    @Override
    public Header delete(int id) {
        return articleRepository.findById(id)
                .map(article -> {
                    articleRepository.delete(article);
                    return Header.OK();
                })
                .orElseGet(()->Header.ERROR("No DATA"));
    }
    
    public List<ArticleListResponseDto> getList(){
        return listResponse(articleRepository.findAll());
    }
 
    public List<ArticleListResponseDto> getArticleListByCategory(int categoryId) {
        return listResponse(articleRepository.findAllByCategoryId(categoryId));
    }

    private Header<ArticleResponseDto> response(Article article){
        ArticleResponseDto body = ArticleResponseDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .createdId(article.getCreatedId())
                .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
                .categoryName(article.getCategory().getName())
                .categoryId(article.getCategory().getId())
                .visitCnt(article.getVisitCnt())
                .comment(commentApiLogicService.getList(article))
                .build();

        return Header.OK(body);
    }

    private List<ArticleListResponseDto> listResponse(List<Article> articleList){
        List<ArticleListResponseDto> newList = new ArrayList<>();

        for(Article article: articleList){
            ArticleListResponseDto addBody = ArticleListResponseDto.builder()
                    .id(article.getId())
                    .title(article.getTitle())
                    .createdId(article.getCreatedId())
                    .categoryName(article.getCategory().getName())
                    .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
                    .visitCnt(article.getVisitCnt())
                    .commentCnt(article.getComment().size())
                    .build();
            newList.add(addBody);
        }
        return newList;
    }

    public void updateVisitCnt(int articleId) {
        articleRepository.updateVisitCnt(articleId);
    }
}
