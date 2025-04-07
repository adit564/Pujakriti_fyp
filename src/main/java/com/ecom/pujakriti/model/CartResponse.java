package com.ecom.pujakriti.model;

import com.ecom.pujakriti.entity.CartItem;
import com.ecom.pujakriti.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
    private Integer cartId;
    private User user;
    private List<CartItem> cartItems;
}
