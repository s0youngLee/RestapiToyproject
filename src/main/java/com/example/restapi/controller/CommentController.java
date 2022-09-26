package com.example.restapi.controller;

import com.example.restapi.ifs.CrudInterface;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.CommentApiRequest;
import com.example.restapi.model.network.response.CommentApiResponse;
import com.example.restapi.service.CommentApiLogicService;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/board")
public class CommentController implements CrudInterface<CommentApiRequest, CommentApiResponse> {

    private final CommentApiLogicService commentApiLogicService;

    public CommentController(@Lazy CommentApiLogicService commentApiLogicService) {
        this.commentApiLogicService = commentApiLogicService;
    }

    @PostMapping("/{articleId}")
    public Header<CommentApiResponse> create(@RequestBody Header<CommentApiRequest> request, @PathVariable int articleId) {
        return commentApiLogicService.create(request, articleId);
    }

    @DeleteMapping("/{articleId}/{id}")
    public Header delete(@PathVariable int articleId, @PathVariable int id) {
        return commentApiLogicService.delete(articleId,id);
    }

    @Override
    public Header<CommentApiResponse> create(Header<CommentApiRequest> request) {
        return null;
    }

    @Override
    public Header<CommentApiResponse> read(int id) {
        return null;
    }

    @Override
    public Header<CommentApiResponse> update(Header<CommentApiRequest> request, int id) {
        return null;
    }

    @Override
    public Header delete(int id) {
        return null;
    }
}
