package com.ecom.pujakriti.controller;
import com.ecom.pujakriti.entity.Cart;
import com.ecom.pujakriti.entity.CartItem;
import com.ecom.pujakriti.model.CartItemResponse;
import com.ecom.pujakriti.model.CartResponse;
import com.ecom.pujakriti.service.CartService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@Log4j2
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartResponse> getAllCarts() {
        log.info("Fetching all carts");
        List<CartResponse> carts = cartService.getAllCarts();
        log.info("Retrieved {} carts", carts.size());
        return carts;
    }

    @GetMapping("/{cartId}")
    public CartResponse getCartById(@PathVariable String cartId) {
        log.info("Fetching cart with ID: {}", cartId);
        CartResponse cart = cartService.getCartById(cartId);
        log.info("Retrieved cart: {}", cart);
        return cart;
    }

    @DeleteMapping("/{cartId}")
    public void deleteCart(@PathVariable String cartId) {
        log.info("Deleting cart with ID: {}", cartId);
        cartService.deleteCartById(cartId);
        log.info("Deleted cart with ID: {}", cartId);
    }

    @PostMapping
    public ResponseEntity<CartResponse> createCart(@Valid @RequestBody CartResponse cartResponse) {
        log.info("Received cart to create: {}", cartResponse);
        for (CartItemResponse item : cartResponse.getCartItems()) {
            if (item.getPrice() == null || item.getPrice() <= 0) {
                log.error("Invalid cart item price: {} for cartItemId={}", item.getPrice(), item.getCartItemId());
                throw new IllegalArgumentException("Invalid cart item price for cartItemId=" + item.getCartItemId());
            }
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                log.error("Invalid cart item quantity: {} for cartItemId={}", item.getQuantity(), item.getCartItemId());
                throw new IllegalArgumentException("Invalid cart item quantity for cartItemId=" + item.getCartItemId());
            }
            if ((item.getProductId() != null && item.getBundleId() != null) || (item.getProductId() == null && item.getBundleId() == null)) {
                log.error("Invalid cart item: productId={} and bundleId={} must be mutually exclusive", item.getProductId(), item.getBundleId());
                throw new IllegalArgumentException("CartItem must have exactly one of productId or bundleId for cartItemId=" + item.getCartItemId());
            }
        }
        Cart cart = convertToCartEntity(cartResponse);
        CartResponse createdCart = cartService.createCart(cart);
        log.info("Created cart: {}", createdCart);
        return new ResponseEntity<>(createdCart, HttpStatus.CREATED);
    }

    private Cart convertToCartEntity(CartResponse cartResponse) {
        Cart cart = new Cart();
        cart.setId(cartResponse.getCartId());
        cart.setUserId(cartResponse.getUserId());
        cart.setCartItems(mapCartItemResponsesToEntities(cartResponse.getCartItems()));
        return cart;
    }

    private List<CartItem> mapCartItemResponsesToEntities(List<CartItemResponse> cartItemResponses) {
        return cartItemResponses.stream()
                .map(this::convertToCartItemEntity)
                .collect(Collectors.toList());
    }

    private CartItem convertToCartItemEntity(CartItemResponse cartItemResponse) {
        CartItem cartItem = new CartItem();
        cartItem.setId(cartItemResponse.getCartItemId());
        cartItem.setProductId(cartItemResponse.getProductId());
        cartItem.setBundleId(cartItemResponse.getBundleId());
        cartItem.setQuantity(cartItemResponse.getQuantity());
        cartItem.setPrice(cartItemResponse.getPrice());
        return cartItem;
    }
}