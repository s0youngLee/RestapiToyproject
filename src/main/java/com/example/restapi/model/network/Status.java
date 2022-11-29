package com.example.restapi.model.network;

import java.util.Date;

import lombok.Builder;

@Builder
public class Status<T> {
    private T data;
    private Date timestamp;
    private String message;
    private String details;

    public Status() {
    }

    public Status(T data, Date timestamp, String message, String details) {
        this.data = data;
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public T getData() {
        return data;
    }
    public void setData(T data) {
        this.data = data;
    }

    //OK
    public static <T> Status<T> OK(){
        return (Status<T>)Status.builder()
                .message("OK")
                .build();
    }

    //DATA OK
    public static <T> Status<T> OK(T data){
        return (Status<T>)Status.builder()
                .data(data)
                .build();
    }

    //ERROR
    public static <T> Status<T> ERROR(String description){
        return (Status<T>)Status.builder()
                .data(description)
                .build();
    }

}
