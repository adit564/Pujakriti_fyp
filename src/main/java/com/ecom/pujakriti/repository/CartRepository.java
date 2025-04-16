package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Cart;
import com.ecom.pujakriti.model.CartResponse;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends CrudRepository<Cart, String> {


}
