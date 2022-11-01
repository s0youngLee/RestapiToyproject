package com.example.restapi.model.network.response;

import lombok.Builder;

@Builder
public record FileResponseDto(Integer id, String originName, String date, Double fileSize){ }
