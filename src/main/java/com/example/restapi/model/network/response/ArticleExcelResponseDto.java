package com.example.restapi.model.network.response;

import lombok.Builder;

@Builder
public record ArticleExcelResponseDto(Integer id, String title, String createdId, String createdAt, String finalEditDate) {
}
