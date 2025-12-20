package com.lendenclub.transactionservice.controller;
import com.lendenclub.transactionservice.dto.TransactionResponse;
import com.lendenclub.transactionservice.entity.Transaction;
import com.lendenclub.transactionservice.repository.TransactionRepository;
import java.util.List;
import com.lendenclub.transactionservice.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api")
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;


    public TransactionController(TransactionService transactionService,
                                 TransactionRepository transactionRepository) {
        this.transactionService = transactionService;
        this.transactionRepository = transactionRepository;
    }


    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam BigDecimal amount) {

        transactionService.transferMoney(senderId, receiverId, amount);
        return ResponseEntity.ok("Transfer successful!");
    }
    @GetMapping("/transactions")
    public List<TransactionResponse> getTransactions(
            @RequestParam Long userId
    ) {
        return transactionRepository
                .findBySender_IdOrReceiver_Id(userId, userId)
                .stream()
                .map(tx -> new TransactionResponse(
                        tx.getId(),
                        tx.getSender().getName(),
                        tx.getReceiver().getName(),
                        tx.getAmount(),
                        tx.getStatus(),
                        tx.getTimestamp()
                ))
                .toList();
    }


}
