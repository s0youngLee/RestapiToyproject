package com.example.restapi.controller;

import com.example.restapi.ifs.CrudInterface;
import com.example.restapi.model.network.Header;
import org.springframework.web.bind.annotation.*;

public abstract class CrudController<Req, Res> implements CrudInterface<Req, Res> {

    protected CrudInterface<Req,Res> baseService;

    @Override
    @PostMapping("")
    public Header<Res> create(@RequestBody Header<Req> request) {
        return baseService.create(request);
    }

    @Override
    @GetMapping("{id}")
    public Header<Res> read(@PathVariable int id) {
        return baseService.read(id);
    }

    @Override
    @PutMapping("{id}")
    public Header<Res> update(@RequestBody Header<Req> request, @PathVariable int id) {
        return baseService.update(request, id);
    }

    @Override
    @DeleteMapping("{id}")
    public Header delete(@PathVariable int id) {
        return baseService.delete(id);
    }

}
