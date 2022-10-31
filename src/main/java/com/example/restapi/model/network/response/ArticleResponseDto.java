package com.example.restapi.model.network.response;

import java.util.List;

import com.example.restapi.model.entity.Files;

import lombok.Builder;

@Builder
public record ArticleResponseDto(Integer id,
                                 String title,
                                 String content,
                                 String createdId,
                                 String createdAt,
                                 Integer categoryId,
                                 String categoryName,
                                 Integer visitCnt,
                                 List<CommentResponseDto> comment,
                                 List<Files> files) { }
