package com.example.restapi.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Category;
import com.example.restapi.model.network.request.ArticleRequest;
import com.example.restapi.model.network.response.ArticleExcelResponseDto;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.ArticleResponseDto;
import com.example.restapi.model.network.response.UserResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CategoryRepository;
import com.example.restapi.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class ArticleService {
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final CommentService commentService;
    private final FileService fileService;
    private final ExcelSetting<ArticleExcelResponseDto> excelSetting;

    public ArticleService(@Lazy CategoryRepository categoryRepository, @Lazy ArticleRepository articleRepository,
        UserRepository userRepository, @Lazy CommentService commentService,@Lazy FileService fileService,
        ExcelSetting<ArticleExcelResponseDto> excelSetting) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
        this.fileService = fileService;
        this.commentService = commentService;
        this.excelSetting = excelSetting;
    }

    @Transactional
    public ResponseEntity<ArticleResponseDto> register(List<MultipartFile> uploadFiles, ArticleRequest request) throws Exception {
        log.info(request.getCategoryId());
        Article article = Article.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .createdAt(LocalDateTime.now())
            .finalEditDate(LocalDateTime.now())
            .category(request.getCategoryId() != null ? categoryRepository.getReferenceById(request.getCategoryId()) : null)
            .visitCnt(0)
            .comment(new ArrayList<>())
            .files(new ArrayList<>())
            .user(userRepository.findByNickName(request.getCreatedId()))
            .build();

        try{
            articleRepository.save(article);
            article.setFiles(fileService.upload(uploadFiles, article.getId())); // file upload
        }catch (NullPointerException e){
            log.warn("File not selected");
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(articleBuilder(article));
    }

    @Transactional
    public ResponseEntity<ArticleResponseDto> read(int id) {
        articleRepository.updateVisitCnt(id);
        try{
            return ResponseEntity.ok(articleBuilder(articleRepository.getReferenceById(id)));
        }catch (EntityNotFoundException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @Transactional
    public ResponseEntity<ArticleResponseDto> edit(List<MultipartFile> uploadFiles, ArticleRequest request, int id) {
        try {
            articleRepository.findById(id)
                .map(article -> {
                    article.setTitle(request.getTitle());
                    article.setContent(request.getContent());
                    article.setFinalEditDate(LocalDateTime.now());
                    try {
                        article.setFiles(fileService.upload(uploadFiles, id));
                    } catch (NullPointerException e){
                        log.warn("File not selected");
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    article.setCategory(request.getCategoryId() != null ? categoryRepository.getReferenceById(request.getCategoryId()) : null);
//                            Category.builder()
//                        .id(request.getCategoryId())
//                        .name(categoryRepository.findById(request.getCategoryId()).orElseThrow().getName())
//                        .build());
                    return article;
                })
                .map(articleRepository::save)
                .map(this::articleBuilder);
        }catch (IllegalArgumentException | NoSuchElementException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.noContent().build();
    }

    @Transactional
    public ResponseEntity<ArticleResponseDto> delete(int id) {
        try {
            fileService.deleteFileByArticleId(id);
            articleRepository.delete(articleRepository.getReferenceById(id));
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<List<ArticleListResponseDto>> getList(){
        return ResponseEntity.ok(listResponse(articleRepository.findAll()));
    }
 
    public ResponseEntity<List<ArticleListResponseDto>> getArticleListByCategory(int categoryId) {
        return ResponseEntity.ok(listResponse(articleRepository.findAllByCategoryId(categoryId)));
    }

    public ResponseEntity<List<ArticleListResponseDto>> getUserArticles(UserResponseDto user){
        return ResponseEntity.ok(listResponse(articleRepository.findAllByUser(userRepository.getReferenceById(user.code()))));
    }

    public ResponseEntity<List<ArticleListResponseDto>> getSearchResults(String type, String keyword){
        String searchType = type.split("-")[1];
        String categoryId = type.split("-")[0];
        if(categoryId.equals("")){
            return ResponseEntity.ok(search(articleRepository.findAll(), searchType, keyword));
        }else{
            return ResponseEntity.ok(search(articleRepository.findAllByCategoryId(Integer.parseInt(categoryId)), searchType, keyword));
        }
    }

    public List<ArticleListResponseDto> search(List<Article> findFromList, String type, String keyword){
        List<ArticleListResponseDto> searchResults = new ArrayList<>();
        for(Article article: findFromList){
            switch (type) {
                case "Title":
                    if (article.getTitle().contains(keyword)) {
                        searchResults.add(listResponseBuilder(article));
                    }
                    break;
                case "Content":
                    if (article.getContent().contains(keyword)) {
                        searchResults.add(listResponseBuilder(article));
                    }
                    break;
                case "Title+Content":
                    if (article.getTitle().contains(keyword) || article.getContent().contains(keyword)) {
                        searchResults.add(listResponseBuilder(article));
                    }
                    break;
                case "Nickname":
                    if (article.getUser().getNickName().contains(keyword)) {
                        searchResults.add(listResponseBuilder(article));
                    }
                    break;
                default:
                    break;
            }
        }
        return searchResults;
    }


    /**
     * GetMapping("/board/excel/download")
     * Write an Excel file with article table
     *
     * @param response to download written Excel file
     */
    @Transactional
    public void downloadExcelBoard(HttpServletResponse response) {
        List<ArticleExcelResponseDto> dtoData = new ArrayList<>();
        for(Article article: articleRepository.findAll()){
            ArticleExcelResponseDto body = ArticleExcelResponseDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .createdBy(article.getUser().getNickName())
                .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
                .finalEditDate(article.getFinalEditDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
                .build();
            dtoData.add(body);
        }

        List<List<String>> dataList = new ArrayList<>();
        for(ArticleExcelResponseDto data : dtoData){
            dataList.add(data.getData());
        }
        excelSetting.writeWorkbook(response, ArticleExcelResponseDto.class.getRecordComponents() , dtoData, dataList);
    }


    private ArticleResponseDto articleBuilder(Article article){
        try{
            return ArticleResponseDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
                .categoryName(article.getCategory() != null ? article.getCategory().getName() : null)
                .categoryId(article.getCategory() != null ? article.getCategory().getId() : null)
                .visitCnt(article.getVisitCnt())
                .finalEditDate(article.getFinalEditDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
                .comment(commentService.getList(article))
                .files(fileService.getList(article))
                .userNickname(article.getUser().getNickName())
                .build();
        }catch (NullPointerException e){
            log.warn("Edit time is null");
            return null;
        }
    }

    private ArticleListResponseDto listResponseBuilder(Article article) {
        return ArticleListResponseDto.builder()
            .id(article.getId())
            .title(article.getTitle())
            .finalEditDate(article.getFinalEditDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
            .categoryName(article.getCategory() != null ? article.getCategory().getName() : "선택 안함")
            .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
            .visitCnt(article.getVisitCnt())
            .commentCnt(article.getComment().size())
            .userNickname(article.getUser().getNickName())
            .build();
    }


    private List<ArticleListResponseDto> listResponse(List<Article> articleList){
        List<ArticleListResponseDto> newList = new ArrayList<>();
        for(Article article: articleList){
            newList.add(listResponseBuilder(article));
        }
        return newList;
    }
}
