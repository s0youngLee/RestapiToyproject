package com.example.restapi.service;

import com.example.restapi.ifs.CrudInterface;
import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Category;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.ArticleApiRequest;
import com.example.restapi.model.network.response.ArticleApiResponse;
import com.example.restapi.model.network.response.ArticleListApiResponse;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CategoryRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ArticleApiLogicService implements CrudInterface<ArticleApiRequest, ArticleApiResponse> {

    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;
    private final CommentApiLogicService commentApiLogicService;
    private final ArticleApiLogicService articleApiLogicService;

    public ArticleApiLogicService(@Lazy CategoryRepository categoryRepository, @Lazy ArticleRepository articleRepository, @Lazy CommentApiLogicService commentApiLogicService, @Lazy ArticleApiLogicService articleApiLogicService) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
        this.commentApiLogicService = commentApiLogicService;
        this.articleApiLogicService = articleApiLogicService;
    }

    @Override
    public Header<ArticleApiResponse> create(Header<ArticleApiRequest> request) {

        ArticleApiRequest body = request.getData();

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
    public Header<ArticleApiResponse> read(int id) {
        articleApiLogicService.updateVisitCnt(id);
        return articleRepository.findById(id)
                .map(article -> response(article))
                .orElseGet(()-> Header.ERROR("No DATA"));
    }

    @Override
    public Header<ArticleApiResponse> update(Header<ArticleApiRequest> request, int id) {
        ArticleApiRequest body = request.getData();

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
        return articleRepository.findById((id))
                .map(article -> {
                    articleRepository.delete(article);
                    return Header.OK();
                })
                .orElseGet(()->Header.ERROR("No DATA"));
    }
    
    public List<ArticleListApiResponse> getList(){
        return listResponse(articleRepository.findAll());
    }
 
    public List<ArticleListApiResponse> getArticleListByCategory(int categoryId) {
        List<Article> articleList = new ArrayList<>();
        for(Article article : articleRepository.findAll()){
            if(article.getCategory().getId() == categoryId){
                articleList.add(article);
            }
        }
        return listResponse(articleList);
    }

    private Header<ArticleApiResponse> response(Article article){
        ArticleApiResponse body = ArticleApiResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .createdId(article.getCreatedId())
                .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
                .categoryName(article.getCategory().getName())
                .categoryId(article.getCategory().getId())
                .visitCnt(article.getVisitCnt())
                .comment(commentApiLogicService.findByArticleId(article.getId()))
                .build();

        return Header.OK(body);
    }

    private List<ArticleListApiResponse> listResponse(List<Article> articleList){
        List<ArticleListApiResponse> newList = new ArrayList<>();

        for(Article article: articleList){
            ArticleListApiResponse addBody = ArticleListApiResponse.builder()
                    .id(article.getId())
                    .title(article.getTitle())
                    .createdId(article.getCreatedId())
                    .categoryName(article.getCategory().getName())
                    .category(article.getCategory())
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
