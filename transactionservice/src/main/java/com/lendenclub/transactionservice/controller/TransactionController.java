package com.lendenclub.transactionservice.controller;
import com.lendenclub.transactionservice.dto.TransactionResponse;
import com.lendenclub.transactionservice.entity.Transaction;
import org.springframework.security.core.Authentication;
import com.lendenclub.transactionservice.repository.TransactionRepository;
import java.util.List;
import com.lendenclub.transactionservice.service.TransactionService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
            @RequestParam Long receiverId,
            @RequestParam BigDecimal amount,
            Authentication authentication
    ) {
        // email/username extracted from JWT
        String email = authentication.getName();

        transactionService.transferMoneyByEmail(
                email,
                receiverId,
                amount
        );

        return ResponseEntity.ok("Transfer successful!");
    }

    @GetMapping("/transactions")
    public List<TransactionResponse> getTransactions(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("timestamp").descending()
        );

        return transactionRepository
                .findBySender_IdOrReceiver_Id(userId, userId, pageable)
                .getContent()
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

    @GetMapping("/transactions/all")
    public List<TransactionResponse> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("timestamp").descending()
        );

        return transactionRepository
                .findAll(pageable)
                .getContent()
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
