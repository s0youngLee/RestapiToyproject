package com.example.restapi.controller;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Status;
import com.example.restapi.model.network.request.ArticleRequest;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.ArticleResponseDto;
import com.example.restapi.service.ArticleService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@SessionAttributes("user")
@RequestMapping("/board")
public class ArticleController extends AbstractCrudMethod<ArticleRequest, ArticleResponseDto> {
    private final ArticleService articleService;
    public ArticleController(@Lazy ArticleService articleService) {
        this.articleService = articleService;
    }
    @ModelAttribute("user")
    public UserInfo userForm(){
        return new UserInfo();
    }

    @PostConstruct
    public void init(){
        this.baseService = articleService;
    }

    @GetMapping("")
    public Status<List<ArticleListResponseDto>> getArticleList() {
        return Status.OK(articleService.getList());
    }

    @GetMapping("/category/{categoryId}")
    public Status<List<ArticleListResponseDto>> getArticlesByCategory(@PathVariable int categoryId){
        return Status.OK(articleService.getArticleListByCategory(categoryId));
    }

    @GetMapping("/user")
    public List<ArticleListResponseDto> getMyArticles(@SessionAttribute("user") UserInfo user){
        return articleService.getUserArticles(user.getNickName());
    }

    @GetMapping("/search/{type}/{keyword}")
    public List<ArticleListResponseDto> getSearchResults(@PathVariable String type, @PathVariable String keyword){
        log.info(type);
        return articleService.getSearchResults(type, keyword);
    }

    @PostMapping(value = "/withfile", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public void register(@RequestPart("article") Status<ArticleRequest> request, @RequestPart(value = "file", required = false) List<MultipartFile> upfile)
        throws Exception {
        articleService.register(upfile, request);
    }

    @PutMapping(value = "/withfile/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public void edit(@RequestPart(value = "file", required = false) List<MultipartFile> uploadFiles, @RequestPart("article") Status<ArticleRequest> request, @PathVariable int id)
        throws MissingServletRequestPartException {
        articleService.edit(uploadFiles, request, id);
    }

    @GetMapping("/excel/download")
    public void downloadExcelBoard(HttpServletRequest request, HttpServletResponse response){
        try{
            articleService.downloadExcelBoard(response);
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }

}
