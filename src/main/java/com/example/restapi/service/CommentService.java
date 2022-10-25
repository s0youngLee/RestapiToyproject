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
import com.example.restapi.model.entity.Comment;
import com.example.restapi.model.network.Status;
import com.example.restapi.model.network.request.CommentRequest;
import com.example.restapi.model.network.response.CommentResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.CommentRepository;



@Service
public class CommentService extends AbstractCrudMethod<CommentRequest, CommentResponseDto> {
    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;

    public CommentService(@Lazy CommentRepository commentRepository, @Lazy ArticleRepository articleRepository) {
        this.commentRepository = commentRepository;
        this.articleRepository = articleRepository;
    }

    @Override
    public Status<CommentResponseDto> create(Status<CommentRequest> request) {
        CommentRequest body = request.getData();
        if(body.getUserId()==null){
            body.setUserId("unknown");
        }

        Comment comment = Comment.builder()
                .userId(body.getUserId())
                .content(body.getContent())
                .createdAt(LocalDateTime.now())
                .article(articleRepository.getReferenceById(body.getArticleId()))
                .build();

        return Status.OK(buildComment(commentRepository.save(comment)));
    }

    @Override
    @Transactional
    public Status<CommentResponseDto> read(int id) {
        return commentRepository.findById(id)
            .map(comment -> Status.OK(buildComment(comment)))
            .orElseGet(()-> Status.ERROR("No DATA"));
    }

    @Override
    @Transactional
    public Status<CommentResponseDto> update(Status<CommentRequest> request, int id) {
        CommentRequest body = request.getData();
        return commentRepository.findById(id)
            .map(comment -> {
                comment.setUserId(body.getUserId() == null ? comment.getUserId() : body.getUserId());
                comment.setContent(body.getContent());
                comment.setCreatedAt(LocalDateTime.now());
                comment.setArticleId(body.getArticleId());
                return comment;
            })
            .map(commentRepository::save)
            .map(comment -> Status.OK(buildComment(comment)))
            .orElseGet(()-> Status.ERROR("No DATA"));
    }

    @Override
    public Status delete(int id) {
        return commentRepository.findById((id))
                .map(comment -> {
                    commentRepository.delete(comment);
                    return Status.OK();
                })
                .orElseGet(()-> Status.ERROR("No DATA"));
    }

    public List<CommentResponseDto> getList(Article article){
        List<CommentResponseDto> commentList = new ArrayList<>();
        for(Comment comment : commentRepository.findAllByArticleId(article.getId())){
            commentList.add(buildComment(comment));
        }
        return commentList;
    }

    public List<CommentResponseDto> getUserComment(String nickName){
        List<CommentResponseDto> commentList = new ArrayList<>();
        for(Comment comment : commentRepository.findAllByUserId(nickName)){
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
