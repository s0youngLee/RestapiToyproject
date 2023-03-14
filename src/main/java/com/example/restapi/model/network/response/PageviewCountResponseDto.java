package com.example.restapi.model.network.response;

import lombok.Builder;

import java.util.Date;

@Builder
public record PageviewCountResponseDto(String pageName, Date date, Integer count) {
}
