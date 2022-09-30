package com.example.restapi.controller;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.restapi.model.network.request.CommentRequest;
import com.example.restapi.model.network.response.CommentResponseDto;
import com.example.restapi.service.CommentApiLogicService;

@RestController
@RequestMapping("/comment")
public class CommentController extends AbstractCrudMethod<CommentRequest, CommentResponseDto> {
    private final CommentApiLogicService commentApiLogicService;
    public CommentController(@Lazy CommentApiLogicService commentApiLogicService) {
        super();
        this.commentApiLogicService = commentApiLogicService;
    }
    @PostConstruct
    public void init(){
        this.baseService = commentApiLogicService;
    }

}
