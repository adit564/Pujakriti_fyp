package com.ecom.pujakriti.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

import java.util.ArrayList;
import java.util.List;

@RedisHash("Cart")
@Getter
@Setter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Cart {
    @Schema(description = "Cart ID")
    private String id;

    private Integer userId;

    private List<CartItem> cartItems = new ArrayList<>();

    public Cart(String id) {
        this.id = id;
    }

    public Cart() {
        this.cartItems = new ArrayList<>();
    }
}