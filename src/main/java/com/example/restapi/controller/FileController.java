package com.example.restapi.controller;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.restapi.model.entity.Filedata;
import com.example.restapi.repository.FileRepository;
import com.example.restapi.service.FileService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
public class FileController {
	private final FileService fileService;
	private final FileRepository fileRepository;

	public FileController(@Lazy FileService fileService, FileRepository fileRepository) {
		this.fileService = fileService;
		this.fileRepository = fileRepository;
	}

	@GetMapping(value = "/download/{id}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	public ResponseEntity<Resource> downloadFile(@PathVariable Integer id) throws IOException {
		Filedata file = fileRepository.getReferenceById(id);

		Resource resource = new FileSystemResource(file.getSaveName());
		log.info("Download file : " + resource.getFilename());

		if(!resource.exists()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}else{
			String resourceName = resource.getFilename();

			return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename="
						+ new String(resourceName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1))
				.body(resource);
		}
	}

	@DeleteMapping("/delete/{id}")
	public void deleteFile(@PathVariable Integer id){
		try{
			File file = new File(fileRepository.getReferenceById(id).getSaveName());
			file.delete();
			fileRepository.deleteById(id);
		}catch (Exception e){
			log.info(e.getMessage());
		}
	}
}

