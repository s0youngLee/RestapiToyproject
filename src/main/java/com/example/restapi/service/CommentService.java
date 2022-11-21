package com.example.restapi.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Comment;
import com.example.restapi.model.network.request.CommentRequest;
import com.example.restapi.model.network.response.CommentResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CommentRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;

    public CommentService(@Lazy CommentRepository commentRepository, @Lazy ArticleRepository articleRepository) {
        this.commentRepository = commentRepository;
        this.articleRepository = articleRepository;
    }

    public ResponseEntity<CommentResponseDto> create(CommentRequest request) {
        if(request.getUserId()==null){
            request.setUserId("unknown");
        }

        Comment comment = Comment.builder()
                .userId(request.getUserId())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .article(articleRepository.getReferenceById(request.getArticleId()))
                .build();
        try {
            commentRepository.save(comment);
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(buildComment(comment));
    }

    @Transactional
    public ResponseEntity<CommentResponseDto> read(int id) {
        try{
            return ResponseEntity.ok(buildComment(commentRepository.getReferenceById(id)));
        }catch (IllegalArgumentException | EntityNotFoundException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @Transactional
    public ResponseEntity<CommentResponseDto> update(CommentRequest request, int id) {
        try{
            commentRepository.findById(id)
                .map(comment -> {
                    comment.setUserId(request.getUserId() == null ? comment.getUserId() : request.getUserId());
                    comment.setContent(request.getContent());
                    comment.setCreatedAt(LocalDateTime.now());
                    comment.setArticleId(request.getArticleId());
                    return comment;
                })
                .map(commentRepository::save);
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<CommentResponseDto> delete(int id) {
        try{
            commentRepository.delete(commentRepository.getReferenceById(id));
        }catch (IllegalArgumentException | EntityNotFoundException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.noContent().build();
    }


    public ResponseEntity<List<CommentResponseDto>> getUserComment(String nickName){
        List<CommentResponseDto> commentList = new ArrayList<>();
        for(Comment comment : commentRepository.findAllByUserId(nickName)){
            commentList.add(buildComment(comment));
        }
        return ResponseEntity.ok(commentList);
    }

    public List<CommentResponseDto> getList(Article article){
        List<CommentResponseDto> commentList = new ArrayList<>();
        for(Comment comment : commentRepository.findAllByArticleId(article.getId())){
            commentList.add(buildComment(comment));
        }
        return commentList;
    }

    private CommentResponseDto buildComment(Comment comment){
        return CommentResponseDto.builder()
                .id(comment.getId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .articleId(comment.getArticle().getId())
                .articleTitle(comment.getArticle().getTitle())
                .build();
    }

}
