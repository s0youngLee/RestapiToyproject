package com.example.restapi.model.network.response;

import lombok.Builder;

@Builder
public record CommentResponseDto(Integer id, String userId, String content, String createdAt, Integer articleId){ }
