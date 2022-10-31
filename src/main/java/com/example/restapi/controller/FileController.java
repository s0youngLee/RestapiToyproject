package com.example.restapi.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.FileRepository;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
public class FileController {

	private final ArticleRepository articleRepository;
	private final FileRepository fileRepository;

	@Value("${upload.path}")
	private String uploadPath;

	@Value("${download.path}")
	private String downPath;

	public FileController(ArticleRepository articleRepository, FileRepository fileRepository) {
		this.articleRepository = articleRepository;
		this.fileRepository = fileRepository;
	}

	@PostMapping("/upload")
	public void uploadFile(List<MultipartFile> uploadFiles) throws IOException {
		for (MultipartFile uploadFile : uploadFiles) {
			if(!uploadFile.getContentType().startsWith("image")) {
				log.warn("Not image type file");
				return;
			}

			String originalName = uploadFile.getOriginalFilename();
			String fileName = originalName.substring(originalName.lastIndexOf("//") + 1);
			log.info("fileName : " + fileName);

			//날짜 폴더 생성 - 폴더 용량 고려
			String folderPath = makeFolder();
			//UUID - 파일 덮어쓰기 방지
			String uuid = UUID.randomUUID().toString();
			String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "_" + fileName;
			log.info("saveName : " + saveName);

			Path savePath = Paths.get(saveName);

			try{
				uploadFile.transferTo(savePath);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	private String makeFolder(){
		String folderPath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

		File uploadPathFolder = new File(uploadPath, folderPath);

		if(!uploadPathFolder.exists()){
			uploadPathFolder.mkdirs();
		}
		return folderPath;
	}

	@GetMapping("/download")
	public void download(HttpServletResponse response) throws Exception {
		try {
			String path = downPath + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
			// String path = fileRoute(); // 경로에 접근할 때 역슬래시('\') 사용

			File file = new File(path);
			response.setHeader("Content-Disposition", "attachment;filename=" + file.getName()); // 다운로드 되거나 로컬에 저장되는 용도로 쓰이는지를 알려주는 헤더

			FileInputStream fileInputStream = new FileInputStream(path); // 파일 읽어오기
			OutputStream out = response.getOutputStream();

			int read = 0;
			byte[] buffer = new byte[1024];
			while ((read = fileInputStream.read(buffer)) != -1) { // 1024바이트씩 계속 읽으면서 outputStream에 저장, -1이 나오면 더이상 읽을 파일이 없음
				out.write(buffer, 0, read);
			}

		} catch (Exception e) {
			throw new Exception("download error");
		}
	}
}

