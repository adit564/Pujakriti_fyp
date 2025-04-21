package com.ecom.pujakriti.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

@RedisHash("CartItem")
@Getter
@Setter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartItem {
    @JsonProperty("cartItemId")
    private Integer id;

    @JsonProperty("productId")
    private Integer productId;

    @JsonProperty("bundleId")
    private Integer bundleId;

    @NotNull
    @Positive
    @JsonProperty("quantity")
    private Integer quantity;

    @NotNull
    @Positive
    @JsonProperty("price")
    private Double price;

    public CartItem() {
    }

    @AssertTrue(message = "CartItem must have exactly one of productId or bundleId")
    private boolean isValidProductOrBundle() {
        return (productId != null && bundleId == null) || (productId == null && bundleId != null);
    }
}