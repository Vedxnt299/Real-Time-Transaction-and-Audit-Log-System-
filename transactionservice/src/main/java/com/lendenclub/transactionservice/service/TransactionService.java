package com.lendenclub.transactionservice.service;

import com.lendenclub.transactionservice.entity.Transaction;
import com.lendenclub.transactionservice.entity.User;
import com.lendenclub.transactionservice.exception.ResourceNotFoundException;
import com.lendenclub.transactionservice.repository.TransactionRepository;
import com.lendenclub.transactionservice.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(UserRepository userRepository,
                              TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void transferMoney(Long senderId, Long receiverId, BigDecimal amount) {

        // 1. Fetch sender
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        // 2. Fetch receiver
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        // 3. Check balance
        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // 4. Debit sender
        sender.setBalance(sender.getBalance().subtract(amount));

        // 5. Credit receiver
        receiver.setBalance(receiver.getBalance().add(amount));

        // 6. Save users
        userRepository.save(sender);
        userRepository.save(receiver);

        // 7. Save transaction audit log
        Transaction tx = new Transaction(
                sender,
                receiver,
                amount,
                LocalDateTime.now()
        );

        tx.setStatus("SUCCESS");

        transactionRepository.save(tx);
    }
}
