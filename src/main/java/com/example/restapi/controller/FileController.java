package com.example.restapi.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.restapi.service.FileService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
public class FileController {
	private final FileService fileService;

	public FileController(@Lazy FileService fileService) {
		this.fileService = fileService;
	}

	@GetMapping(value = "/download/{id}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	public ResponseEntity<Resource> downloadFile(@PathVariable Integer id) throws IOException {
		return fileService.downloadFile(id);
	}
	@GetMapping("/board/excel/download")
	public void downloadExcelBoard(HttpServletRequest request, HttpServletResponse response){
		try{
			fileService.downloadExcelBoard(response);
		}catch (Exception e){
			log.error(e.getMessage());
		}
	}

	@DeleteMapping("/delete/{id}")
	public void deleteFile(@PathVariable Integer id){
		fileService.deleteFile(id);
	}
}

