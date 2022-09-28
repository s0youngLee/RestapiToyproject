package com.example.restapi.controller;

import com.example.restapi.model.network.request.CommentApiRequest;
import com.example.restapi.model.network.response.CommentApiResponse;
import com.example.restapi.service.CommentApiLogicService;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;


@RestController
@RequestMapping("/comment")
public class CommentController extends CrudController<CommentApiRequest, CommentApiResponse> {
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
