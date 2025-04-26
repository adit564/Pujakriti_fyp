package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.AdminOrdersResponse;
import com.ecom.pujakriti.model.OrderResponse;
import com.ecom.pujakriti.model.OrdersResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(Integer userId, Integer addressId, String cartId, String discountCode);
    List<OrdersResponse> getOrdersByUserId(Integer userId);

    List<AdminOrdersResponse> getAllOrdersForAdmin();

    OrderResponse updateOrderStatus(Integer orderId, String newStatus);
}
