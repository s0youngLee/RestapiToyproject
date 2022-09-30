package com.example.restapi.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.restapi.model.network.Header;

public abstract class AbstractCrudMethod<Req, Res>{
    protected AbstractCrudMethod<Req,Res> baseService;

    @PostMapping("")
    public Header<Res> create(@RequestBody Header<Req> request) {
        return baseService.create(request);
    }

    @GetMapping("{id}")
    public Header<Res> read(@PathVariable int id) {
        return baseService.read(id);
    }

    @PutMapping("{id}")
    public Header<Res> update(@RequestBody Header<Req> request, @PathVariable int id) {
        return baseService.update(request, id);
    }

    @DeleteMapping("{id}")
    public Header delete(@PathVariable int id) {
        return baseService.delete(id);
    }
}
