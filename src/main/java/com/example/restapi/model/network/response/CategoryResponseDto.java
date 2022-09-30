package com.example.restapi.model.network.response;

import lombok.Builder;


@Builder
public record CategoryResponseDto(Integer id, String name, Integer articleCnt){ }