package com.example.restapi.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.restapi.controller.AbstractCrudMethod;
import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Category;
import com.example.restapi.model.network.Status;
import com.example.restapi.model.network.request.ArticleRequest;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.ArticleResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CategoryRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class ArticleService extends AbstractCrudMethod<ArticleRequest, ArticleResponseDto> {
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;
    private final CommentService commentService;
    private final FileService fileService;

    public ArticleService(@Lazy CategoryRepository categoryRepository, @Lazy ArticleRepository articleRepository,
        @Lazy CommentService commentService,@Lazy FileService fileService) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
        this.fileService = fileService;
        this.commentService = commentService;
    }

    @Override
    public Status<ArticleResponseDto> create(Status<ArticleRequest> request) {
        return null;
    }

    @Transactional
    public void register(List<MultipartFile> uploadFiles, Status<ArticleRequest> request) throws Exception {
        ArticleRequest body = request.getData();
        Article article = Article.builder()
            .title(body.getTitle())
            .content(body.getContent())
            .createdId(body.getCreatedId())
            .createdAt(LocalDateTime.now())
            .category(categoryRepository.getReferenceById(body.getCategoryId()))
            .visitCnt(0)
            .comment(new ArrayList<>())
            .files(new ArrayList<>())
            .build();

        articleRepository.save(article);
        try{
            article.setFiles(fileService.upload(uploadFiles, article.getId())); // file upload
        }catch (NullPointerException e){
            log.warn("File not selected");
        }
    }

    @Override
    @Transactional
    public Status<ArticleResponseDto> read(int id) {
        articleRepository.updateVisitCnt(id);
        return articleRepository.findById(id)
                .map(this::articleBuilder)
                .orElseGet(()-> Status.ERROR("No DATA"));
    }

    @Transactional
    public Status<ArticleResponseDto> edit(List<MultipartFile> uploadFiles, Status<ArticleRequest> request, int id) {
        ArticleRequest body = request.getData();
        return articleRepository.findById(id)
                .map(article -> {
                    article.setTitle(body.getTitle());
                    article.setContent(body.getContent());
                    article.setCreatedId(body.getCreatedId());
                    article.setCreatedAt(LocalDateTime.now());
                    try {
                        article.setFiles(fileService.upload(uploadFiles, id));
                    } catch (NullPointerException e){
                        log.warn("File not selected");
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
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
                .files(fileService.getList(article))
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

    public void decreaseVisitCnt(int id) {
        articleRepository.decreaseVisitCnt(id);
    }
}
