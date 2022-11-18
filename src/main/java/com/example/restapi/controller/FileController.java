package com.example.restapi.controller;

import java.io.IOException;

import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.restapi.service.FileService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/file")
public class FileController {
	private final FileService fileService;

	public FileController(@Lazy FileService fileService) {
		this.fileService = fileService;
	}

	@GetMapping(value = "/download/{id}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	public ResponseEntity<Resource> downloadFile(@PathVariable Integer id) throws IOException {
		return fileService.downloadFile(id);
	}

	@GetMapping(value = "/downloadzip/{articleId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	public ResponseEntity<Resource> downloadZipFile(@PathVariable Integer articleId) throws IOException {
		return fileService.downloadZipFile(articleId);
	}
	//
	// @GetMapping("/download/complete/{articleId}")
	// public void deleteZipFile(@PathVariable Integer articleId) throws IOException {
	// 	fileService.deleteZipFile(articleId);
	// }

	@DeleteMapping("/delete/{id}")
	public void deleteFile(@PathVariable Integer id){
		fileService.deleteFile(id);
	}
}

