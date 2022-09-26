package com.example.restapi.model.network.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleListApiResponse {
    private Integer id;

    private String title;

    private String categoryName;

    private String createdId;

    private String createdAt;

    private Integer visitCnt;

    private Integer commentCnt;

}
