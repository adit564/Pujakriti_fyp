package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Order;
import com.ecom.pujakriti.entity.User;
import com.ecom.pujakriti.model.OrderResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByCartId(String cartId);

    List<Order> user(User user);

    List<Order> findByUser_UserId(Integer userId);
}
