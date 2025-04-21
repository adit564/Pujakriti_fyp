package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Cart;
import com.ecom.pujakriti.entity.CartItem;
import com.ecom.pujakriti.model.CartItemResponse;
import com.ecom.pujakriti.model.CartResponse;
import com.ecom.pujakriti.repository.CartRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    public CartServiceImpl(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Override
    public List<CartResponse> getAllCarts() {
        log.info("Fetching all carts");
        List<Cart> cartList = (List<Cart>) cartRepository.findAll();

        List<CartResponse> cartResponseList = cartList.stream()
                .map(this::convertToCartResponse)
                .collect(Collectors.toList());
        log.info("Fetched all carts");
        return cartResponseList;
    }


    @Override
    public CartResponse getCartById(String cartId) {
        log.info("Fetching cart by id: " + cartId);
        Optional<Cart> cartOptional = cartRepository.findById(cartId);
        if (cartOptional.isPresent()) {
            Cart cart = cartOptional.get();
            log.info("Fetched cart by id: " + cartId);
            return convertToCartResponse(cart);
        }else {
            log.info("Cart by id: " + cartId + " not found");
            return null;
        }
    }

    @Override
    public void deleteCartById(String cartId) {
        log.info("Deleting cart by id: " + cartId);
        cartRepository.deleteById(cartId);
        log.info("Deleted cart by id: " + cartId);
    }

    @Override
    public CartResponse createCart(Cart cart) {
        log.info("Creating cart: " + cart);
        Cart savedCart = cartRepository.save(cart);
        log.info("Saved cart: " + savedCart);
        return convertToCartResponse(savedCart);
    }

    private CartResponse convertToCartResponse(Cart cart) {
        if (cart == null) {
            return null;
        }
        List<CartItemResponse> itemResponses = cart.getCartItems().stream()
                .map(this::convertToCartItemResponse)
                .collect(Collectors.toList());

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(cart.getUserId())
                .cartItems(itemResponses)
                .build();
    }

    private CartItemResponse convertToCartItemResponse(CartItem cartItem) {
        return CartItemResponse.builder()
                .cartItemId(cartItem.getId())
                .bundleId(cartItem.getBundleId())
                .productId(cartItem.getProductId())
                .quantity(cartItem.getQuantity())
                .price(cartItem.getPrice())
                .build();
    }


}
