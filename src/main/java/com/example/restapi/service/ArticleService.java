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
import com.example.restapi.model.network.Status;
import com.example.restapi.model.network.request.ArticleRequest;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.ArticleResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CategoryRepository;

@Service
public class ArticleService extends AbstractCrudMethod<ArticleRequest, ArticleResponseDto> {
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;
    private final ArticleService articleService;
    private final CommentService commentService;

    public ArticleService(@Lazy CategoryRepository categoryRepository, @Lazy ArticleRepository articleRepository,
        @Lazy ArticleService articleService, CommentService commentService) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
        this.articleService = articleService;
        this.commentService = commentService;
    }

    @Override
    public Status<ArticleResponseDto> create(Status<ArticleRequest> request) {

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

        return articleBuilder(articleRepository.save(article));
    }

    @Override
    @Transactional
    public Status<ArticleResponseDto> read(int id) {
        articleService.updateVisitCnt(id);
        return articleRepository.findById(id)
                .map(this::articleBuilder)
                .orElseGet(()-> Status.ERROR("No DATA"));
    }


    @Override
    public Status<ArticleResponseDto> update(Status<ArticleRequest> request, int id) {
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
                .map(this::articleBuilder)
                .orElseGet(()-> Status.ERROR("No DATA"));
    }

    @Override
    public Status delete(int id) {
        return articleRepository.findById(id)
                .map(article -> {
                    articleRepository.delete(article);
                    return Status.OK();
                })
                .orElseGet(()-> Status.ERROR("No DATA"));
    }
    
    public List<ArticleListResponseDto> getList(){
        return listResponse(articleRepository.findAll());
    }
 
    public List<ArticleListResponseDto> getArticleListByCategory(int categoryId) {
        return listResponse(articleRepository.findAllByCategoryId(categoryId));
    }

    public List<ArticleListResponseDto> getUserArticles(String nickName){
        return listResponse(articleRepository.findAllByCreatedId(nickName));
    }

    private Status<ArticleResponseDto> articleBuilder(Article article){
        ArticleResponseDto body = ArticleResponseDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .createdId(article.getCreatedId())
                .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
                .categoryName(article.getCategory().getName())
                .categoryId(article.getCategory().getId())
                .visitCnt(article.getVisitCnt())
                .comment(commentService.getList(article))
                .build();

        return Status.OK(body);
    }
    private ArticleListResponseDto listResponseBuilder(Article article) {
        ArticleListResponseDto addBody = ArticleListResponseDto.builder()
            .id(article.getId())
            .title(article.getTitle())
            .createdId(article.getCreatedId())
            .categoryName(article.getCategory().getName())
            .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
            .visitCnt(article.getVisitCnt())
            .commentCnt(article.getComment().size())
            .build();
        return addBody;
    }


    private List<ArticleListResponseDto> listResponse(List<Article> articleList){
        List<ArticleListResponseDto> newList = new ArrayList<>();
        for(Article article: articleList){
            newList.add(listResponseBuilder(article));
        }
        return newList;
    }

    public void updateVisitCnt(int articleId) {
        articleRepository.updateVisitCnt(articleId);
    }

	public List<ArticleListResponseDto> getSearchResults(String keyword) {
        List<ArticleListResponseDto> searchResults = new ArrayList<>();
        // 먼저 내용부터 찾기
        for(Article article: articleRepository.findAll()){
            if(article.getContent().contains(keyword) || article.getTitle().contains(keyword)){
                searchResults.add(listResponseBuilder(article));
            }
        }
        return searchResults;
	}
}
