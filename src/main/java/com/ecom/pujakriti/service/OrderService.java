package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.OrderResponse;

public interface OrderService {

    OrderResponse createOrder(Integer userId, Integer addressId, String cartId, String discountCode);


}
