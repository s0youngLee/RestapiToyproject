package com.example.restapi.model.network;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Header<T> {


    private T data;

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
