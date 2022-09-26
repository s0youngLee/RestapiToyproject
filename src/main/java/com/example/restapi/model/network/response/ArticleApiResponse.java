package com.example.restapi.model.network.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleApiResponse {
    private Integer id;

    private String title;

    private String content;

    private String createdId;

    private String createdAt;

    private String categoryName;

    private Integer visitCnt;

    private Integer commentCnt;

    private List<CommentApiResponse> comment;
}
