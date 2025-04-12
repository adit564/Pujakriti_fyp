package com.ecom.pujakriti.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;

@Data
@NoArgsConstructor
@RedisHash("Cart")
public class Cart {
    @Id
    @Schema(description = "Cart ID")
    private String id;

    private Integer userId;

    private List<CartItem> cartItems;

    public Cart(String id){
        this.id = id;
    }

}