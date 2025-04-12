package com.ecom.pujakriti.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

@Data
@NoArgsConstructor
@RedisHash("CartItem")
public class CartItem {
    @Id
    private Integer id;

    private Integer productId;

    private Integer bundleId;

    private Integer quantity;

}