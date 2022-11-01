package com.example.restapi.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Filedata;
import com.example.restapi.model.network.response.FileResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.FileRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class FileService {
	private final FileRepository fileRepository;
	private final ArticleRepository articleRepository;

	@Value("${upload.path}")
	private String uploadPath;

	@Value("${download.path}")
	private String downPath;

	public FileService(@Lazy FileRepository fileRepository, ArticleRepository articleRepository) {
		this.fileRepository = fileRepository;
		this.articleRepository = articleRepository;
	}

	public List<FileResponseDto> getList(Article article){
		List<FileResponseDto> fileList = new ArrayList<>();
		for(Filedata file : fileRepository.findAllByArticleId(article.getId())){
			fileList.add(buildFile(file));
		}
		return fileList;
	}

	public List<Filedata> upload(List<MultipartFile> uploadFiles, Integer articleId) throws IOException {
		List<Filedata> fileList = new ArrayList<>();
		for (MultipartFile uploadFile : uploadFiles) {
			if(!uploadFile.getContentType().startsWith("image")) {
				log.warn("Not image type file");
				return null;
			}

			String originalName = uploadFile.getOriginalFilename();
			String fileName = originalName.substring(originalName.lastIndexOf("//") + 1);
			log.info("fileName : " + fileName);

			//날짜 폴더 생성 - 폴더 용량 고려
			String folderPath = makeFolder();
			//UUID - 파일 덮어쓰기 방지
			String uuid = UUID.randomUUID().toString();
			String saveFile = uploadPath + File.separator + folderPath + File.separator;
			String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "_" + fileName;
			log.info("saveName : " + saveName);

			Path savePath = Paths.get(saveName);

			log.info(articleId);
			try{
				uploadFile.transferTo(savePath);
				Filedata newFile = Filedata.builder()
					.article(articleRepository.getReferenceById(articleId))
					.saveFile(saveFile)
					.date(LocalDateTime.now())
					.fileSize(uploadFile.getSize())
					.originName(originalName)
					.saveName(saveName)
					.build();
				fileRepository.save(newFile);
				fileList.add(newFile);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return fileList;
	}

	public FileResponseDto buildFile(Filedata file){
		return FileResponseDto.builder()
				.id(file.getId())
				.originName(file.getOriginName())
				.fileSize(file.getFileSize()/(1000000.0))
				.date(file.getDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
				.build();
	}

	private String makeFolder(){
		String folderPath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

		File uploadPathFolder = new File(uploadPath, folderPath);

		if(!uploadPathFolder.exists()){
			uploadPathFolder.mkdirs();
		}
		return folderPath;
	}

	// public ResponseEntity<?> downloadFile(String fileCode) throws IOException {
	// 	FileDownloadUtil downloadUtil = new FileDownloadUtil(fileRepository);
	//
	// 	Resource resource = null;
	// 	try {
	// 		resource = downloadUtil.getFileAsResource(uploadPath, fileCode);
	// 		log.info(resource.getFile());
	// 	} catch (IOException e) {
	// 		return ResponseEntity.internalServerError().build();
	// 	}
	//
	// 	if (resource == null) {
	// 		return new ResponseEntity<>("File not found", HttpStatus.NOT_FOUND);
	// 	}
	//
	// 	String contentType = "application/octet-stream";
	// 	String headerValue = "attachment; filename=\"" + resource.getFilename() + "\"";
	//
	// 	return ResponseEntity.ok()
	// 		.contentLength(resource.contentLength())
	// 		.contentType(MediaType.parseMediaType(contentType))
	// 		.header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
	// 		.body(resource);
	// }

}
