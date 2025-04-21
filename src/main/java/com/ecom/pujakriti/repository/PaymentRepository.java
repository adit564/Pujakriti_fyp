package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Order;
import com.ecom.pujakriti.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Payment findByOrder(Optional<Order> order);

    Optional<Payment> findByOrder_OrderId(Integer orderId);
}
