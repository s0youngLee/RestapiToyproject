package com.example.restapi.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Category;
import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Status;
import com.example.restapi.model.network.request.ArticleRequest;
import com.example.restapi.model.network.response.ArticleExcelResponseDto;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.ArticleResponseDto;
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
    public void register(List<MultipartFile> uploadFiles, Status<ArticleRequest> request) throws Exception {
        ArticleRequest body = request.getData();
        Article article = Article.builder()
            .title(body.getTitle())
            .content(body.getContent())
            .createdAt(LocalDateTime.now())
            .finalEditDate(LocalDateTime.now())
            .category(categoryRepository.getReferenceById(body.getCategoryId()))
            .visitCnt(0)
            .comment(new ArrayList<>())
            .files(new ArrayList<>())
            .user(userRepository.getReferenceById(body.getCreatedId()))
            .build();

        articleRepository.save(article);
        try{
            article.setFiles(fileService.upload(uploadFiles, article.getId())); // file upload
        }catch (NullPointerException e){
            log.warn("File not selected");
        }
    }

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
                    article.setFinalEditDate(LocalDateTime.now());
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

    @Transactional
    public Status delete(int id) {
        return articleRepository.findById(id)
                .map(article -> {
                    fileService.deleteFileByArticleId(id);
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

    public Status<List<ArticleListResponseDto>> getUserArticles(UserInfo user){
        return Status.OK(listResponse(articleRepository.findAllByUser(user)));
    }

    private Status<ArticleResponseDto> articleBuilder(Article article){
        try{
            ArticleResponseDto body  = ArticleResponseDto.builder()
                    .id(article.getId())
                    .title(article.getTitle())
                    .content(article.getContent())
                    .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
                    .categoryName(article.getCategory().getName())
                    .categoryId(article.getCategory().getId())
                    .visitCnt(article.getVisitCnt())
                    .finalEditDate(article.getFinalEditDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
                    .comment(commentService.getList(article))
                    .files(fileService.getList(article))
                    .userNickname(article.getUser().getNickName())
                    .build();

            return Status.OK(body);
        }catch (NullPointerException e){
            log.warn("Edit time is null");
            return null;
        }
    }

    private ArticleListResponseDto listResponseBuilder(Article article) {
        ArticleListResponseDto addBody = ArticleListResponseDto.builder()
            .id(article.getId())
            .title(article.getTitle())
            .finalEditDate(article.getFinalEditDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
            .categoryName(article.getCategory().getName())
            .createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
            .visitCnt(article.getVisitCnt())
            .commentCnt(article.getComment().size())
            .userNickname(article.getUser().getNickName())
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

    public List<ArticleListResponseDto> getSearchResults(String type, String keyword){
        String searchType = type.split("-")[1];
        String categoryId = type.split("-")[0];
        if(categoryId.equals("")){
            return search(articleRepository.findAll(), searchType, keyword);
        }else{
            return search(articleRepository.findAllByCategoryId(Integer.parseInt(categoryId)), searchType, keyword);
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
}
