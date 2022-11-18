// package com.example.restapi.controller;
//
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
//
// import com.example.restapi.model.network.Status;
//
// public abstract class AbstractBaseMethod<Req, Res>{
//     protected AbstractBaseMethod<Req,Res> baseService;
//
//     /**
//      * PostMapping("") to create entity
//      *
//      * @param request the request from client
//      * @return baseService.create(request)
//      */
//     @PostMapping("")
//     public Status<Res> create(@RequestBody Status<Req> request) {
//         return baseService.create(request);
//     }
//
//     /**
//      * GetMapping("{id}") to read entity by id
//      *
//      * @param id the id from url (pathVariable)
//      * @return baseService.read(id)
//      */
//     @GetMapping("{id}")
//     public Status<Res> read(@PathVariable int id) {
//         return baseService.read(id);
//     }
//
//     /**
//      * PutMapping("{id}") to edit entity by id
//      *
//      * @param request the request from client (requestBody)
//      * @param id the id from url (pathVariable)
//      * @return baseService.create(request)
//      */
//     @PutMapping("{id}")
//     public Status<Res> update(@RequestBody Status<Req> request, @PathVariable int id) {
//         return baseService.update(request, id);
//     }
//
//     /**
//      * DeleteMapping("{id}") to delete entity by id
//      *
//      * @param id the id from url (pathVariable)
//      * @return baseService.delete(id)
//      */
//     @DeleteMapping("{id}")
//     public Status delete(@PathVariable int id) {
//         return baseService.delete(id);
//     }
// }
