package com.lendenclub.transactionservice.repository;

import com.lendenclub.transactionservice.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // User-specific paginated transactions
    Page<Transaction> findBySender_IdOrReceiver_Id(
            Long senderId,
            Long receiverId,
            Pageable pageable
    );
}
