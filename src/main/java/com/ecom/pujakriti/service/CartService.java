package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Cart;
import com.ecom.pujakriti.model.CartResponse;

import java.util.List;

public interface CartService {

    List<CartResponse> getAllCarts();

    CartResponse getCartById(String cartId);

    void deleteCartById(String cartId);

    CartResponse createCart(Cart cart);
}
