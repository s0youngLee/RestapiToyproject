package com.example.restapi.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import com.example.restapi.model.entity.Filedata;
import com.example.restapi.repository.FileRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class FileDownloadUtil {
	private Path foundFile;
	private final FileRepository fileRepository;

	public FileDownloadUtil(FileRepository fileRepository) {
		this.fileRepository = fileRepository;
	}

	public Resource getFileAsResource(String path, String fileCode) throws IOException {
		log.info(fileCode);
		log.info(path);
		Filedata selectedFile = fileRepository.findBySaveFile(fileCode);

		Path dirPath = Paths.get(path + File.separator + selectedFile.getDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")));
		log.info(dirPath);

		Files.list(dirPath).forEach(file -> {
			if (file.getFileName().toString().startsWith(fileCode)) {
				foundFile = file;
			}
		});

		if (foundFile != null) {
			return new UrlResource(foundFile.toUri());
		}else{
			return null;
		}
	}
}