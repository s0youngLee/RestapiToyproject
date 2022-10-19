package com.example.restapi.model.network.response;

import lombok.Builder;

@Builder
public record ArticleListResponseDto(Integer id,
                                     String title,
                                     String categoryName,
                                     String createdId,
                                     String createdAt,
                                     Integer visitCnt,
                                     Integer commentCnt){ }