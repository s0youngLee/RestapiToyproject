package com.example.restapi.ifs;

import com.example.restapi.model.network.Header;

public interface CrudInterface <Req , Res>{
    public Header<Res> create(Header<Req> request);

    public Header<Res> read(int id);

    public Header<Res> update(Header<Req> request, int id);

    public Header delete(int id);
}
