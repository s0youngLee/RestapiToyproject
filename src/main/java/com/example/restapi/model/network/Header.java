package com.example.restapi.model.network;

import lombok.Builder;

@Builder
public class Header<T> {
    private T data;
    public Header() {
    }
    public Header(T data) {
        this.data = data;
    }
    public T getData() {
        return data;
    }
    public void setData(T data) {
        this.data = data;
    }

    //OK
    public static <T> Header<T> OK(){
        return (Header<T>)Header.builder().build();
    }

    //DATA OK
    public static <T> Header<T> OK(T data){
        return (Header<T>)Header.builder()
                .data(data)
                .build();
    }

    //ERROR
    public static <T> Header<T> ERROR(String description){
        return (Header<T>)Header.builder().build();
    }
}
