package com.example.restapi.controller;

import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.request.CommentRequest;
import com.example.restapi.model.network.response.CommentResponseDto;
import com.example.restapi.service.CommentService;

@RestController
@RequestMapping("/comment")
public class CommentController extends AbstractCrudMethod<CommentRequest, CommentResponseDto> {
    private final CommentService commentService;
    public CommentController(@Lazy CommentService commentService) {
        super();
        this.commentService = commentService;
    }
    @PostConstruct
    public void init(){
        this.baseService = commentService;
    }

    @GetMapping("/user")
    public List<CommentResponseDto> getMyComments(@SessionAttribute("user") UserInfo user){
        return commentService.getUserComment(user.getNickName());
    }

}
