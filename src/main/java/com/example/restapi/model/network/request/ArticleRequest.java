package com.example.restapi.model.network.request;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import lombok.Builder;

@Builder
public class ArticleRequest {
	private Integer id;
	private String title;
	private String content;
	private String createdId;
	private LocalDateTime createdAt;
	private Integer categoryId;
	// private List<Files> files;

	private MultipartFile[] files;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getCreatedId() {
		return createdId;
	}

	public void setCreatedId(String createdId) {
		this.createdId = createdId;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Integer getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Integer categoryId) {
		this.categoryId = categoryId;
	}

	public MultipartFile[] getFiles() {
		return files;
	}
}
