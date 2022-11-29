package com.example.restapi.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

import com.example.restapi.model.network.request.ArticleRequest;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.ArticleResponseDto;
import com.example.restapi.model.network.response.UserResponseDto;
import com.example.restapi.service.ArticleService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/article")
@SessionAttributes("user")
public class ArticleController {
    private final ArticleService articleService;
    public ArticleController(@Lazy ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping("{id}")
    public ResponseEntity<ArticleResponseDto> read(@PathVariable int id) {
        return articleService.read(id);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ArticleResponseDto> delete(@PathVariable int id) {
        return articleService.delete(id);
    }

    @GetMapping("")
    public ResponseEntity<List<ArticleListResponseDto>> getArticleList() {
        return articleService.getList();
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ArticleListResponseDto>> getArticlesByCategory(@PathVariable int categoryId){
        return articleService.getArticleListByCategory(categoryId);
    }

    @GetMapping("/user")
    public ResponseEntity<List<ArticleListResponseDto>> getMyArticles(@SessionAttribute("user") UserResponseDto user){
        return articleService.getUserArticles(user);
    }

    @GetMapping("/search/{type}/{keyword}")
    public ResponseEntity<List<ArticleListResponseDto>> getSearchResults(@PathVariable String type, @PathVariable String keyword){
        return articleService.getSearchResults(type, keyword);
    }

    @PostMapping(value = "", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ArticleResponseDto> register(@RequestPart("article") ArticleRequest request, @RequestPart(value = "file", required = false) List<MultipartFile> upfile)
        throws Exception {
        return articleService.register(upfile, request);
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ArticleResponseDto> edit(@RequestPart(value = "file", required = false) List<MultipartFile> uploadFiles, @RequestPart("article") ArticleRequest request, @PathVariable int id)
        throws MissingServletRequestPartException {
        return articleService.edit(uploadFiles, request, id);
    }

    @GetMapping("/excel/download")
    public void downloadExcelBoard(HttpServletResponse response){
        try{
            articleService.downloadExcelBoard(response);
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }

}
