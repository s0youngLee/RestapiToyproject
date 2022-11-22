package com.example.restapi.model.network;

import java.util.Date;

import javax.servlet.http.HttpServletResponse;

import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestController
@RestControllerAdvice
public class StatusControl extends ResponseEntityExceptionHandler {

	//Default
	@ExceptionHandler
	public final ResponseEntity<Object> handleAllExeptions(Exception ex, WebRequest request){
		Object exceptionResponse = Status.builder()
			.timestamp(new Date())
			.message(ex.getMessage())
			.details(request.getDescription(false))
			.build();
		return  new ResponseEntity<>(exceptionResponse,
			HttpStatus.valueOf(HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
	}

	@ExceptionHandler(UsernameNotFoundException.class)
	public final ResponseEntity<Object> handleUserNotFoundExceptions(Exception ex, WebRequest request){
		Object exceptionResponse = Status.builder()
			.timestamp(new Date())
			.message(ex.getMessage())
			.details(request.getDescription(false))
			.build();
		return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(RuntimeException.class)
	public final ResponseEntity<Object> handleRuntimeExceptions(Exception ex, WebRequest request){
		Object exceptionResponse = Status.builder()
			.timestamp(new Date())
			.message(ex.getMessage())
			.details(request.getDescription(false))
			.build();
		return new ResponseEntity<>(exceptionResponse, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(PermissionDeniedDataAccessException.class)
	public final ResponseEntity<Object> handlePermissionDeniedExceptions(Exception ex, WebRequest request){
		Object exceptionResponse = Status.builder()
			.timestamp(new Date())
			.message(ex.getMessage())
			.details(request.getDescription(false))
			.build();
		return new ResponseEntity<>(exceptionResponse, HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS);
	}
}
