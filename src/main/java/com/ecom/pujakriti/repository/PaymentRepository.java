package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByOrder_OrderId(Integer orderId);

    List<Payment> findByStatus(Payment.PaymentStatus status);

}
