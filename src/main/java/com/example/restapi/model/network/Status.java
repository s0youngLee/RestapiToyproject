package com.example.restapi.model.network;

import lombok.Builder;

@Builder
public class Status<T> {
    private T data;
    public Status() {
    }
    public Status(T data) {
        this.data = data;
    }
    public T getData() {
        return data;
    }
    public void setData(T data) {
        this.data = data;
    }

    //OK
    public static <T> Status<T> OK(){
        return (Status<T>)Status.builder().build();
    }

    //DATA OK
    public static <T> Status<T> OK(T data){
        return (Status<T>)Status.builder()
                .data(data)
                .build();
    }

    //ERROR
    public static <T> Status<T> ERROR(String description){
        return (Status<T>)Status.builder().data(description).build();
    }

}
