package com.ecom.pujakriti.controller;

import com.ecom.pujakriti.entity.Cart;
import com.ecom.pujakriti.entity.CartItem;
import com.ecom.pujakriti.model.CartItemResponse;
import com.ecom.pujakriti.model.CartResponse;
import com.ecom.pujakriti.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartResponse> getAllCarts() {
        return cartService.getAllCarts();
    }

    @GetMapping("/{cartId}")
    public CartResponse getCartById(@PathVariable String cartId) {
            return cartService.getCartById(cartId);
    }


    @DeleteMapping("/{cartId}")
    public void deleteCart(@PathVariable String cartId) {
        cartService.deleteCartById(cartId);
    }


    @PostMapping
    public ResponseEntity<CartResponse> createCart(@RequestBody CartResponse cartResponse) {
        Cart cart = convertToCartEntity(cartResponse);
        CartResponse createdCart = cartService.createCart(cart);

        return new ResponseEntity<>(createdCart, HttpStatus.CREATED);
    }

    private Cart convertToCartEntity(CartResponse cartResponse) {
        Cart cart = new Cart();
        cart.setId(cartResponse.getCartId());
        cart.setUserId(cartResponse.getUserId());
        cart.setCartItems(mapCartItemResponsesToEntities(cartResponse.getCartItems()));
        return cart;
    }


    private List<CartItem> mapCartItemResponsesToEntities(List<CartItemResponse> cartItemResponse) {
        return cartItemResponse.stream()
                .map(this::convertToCartItemEntity)
                .collect(Collectors.toList());
    }

    private CartItem convertToCartItemEntity(CartItemResponse cartItemResponse) {
        CartItem cartItem = new CartItem();
        cartItem.setId(cartItemResponse.getCartItemId());
        cartItem.setProductId(cartItemResponse.getProductId());
        cartItem.setBundleId(cartItemResponse.getBundleId());
        cartItem.setQuantity(cartItemResponse.getQuantity());
        return cartItem;
    }


}
