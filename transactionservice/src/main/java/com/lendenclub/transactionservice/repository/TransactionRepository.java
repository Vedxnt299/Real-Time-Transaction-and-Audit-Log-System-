package com.lendenclub.transactionservice.repository;

import com.lendenclub.transactionservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySender_IdOrReceiver_Id(Long senderId, Long receiverId);

}
