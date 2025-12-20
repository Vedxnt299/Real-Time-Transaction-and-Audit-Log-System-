package com.lendenclub.transactionservice.controller;

import com.lendenclub.transactionservice.dto.TransactionResponse;
import com.lendenclub.transactionservice.entity.Transaction;
import com.lendenclub.transactionservice.entity.User;
import com.lendenclub.transactionservice.exception.ResourceNotFoundException;
import com.lendenclub.transactionservice.repository.TransactionRepository;
import com.lendenclub.transactionservice.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")

public class UserController {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;


    public UserController(UserRepository userRepository,
                          TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }


    @PostMapping("/create")
    public User createUser(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam BigDecimal balance) {

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword("password"); //dummyPass
        user.setBalance(balance);

        return userRepository.save(user);

    }
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    @GetMapping("/{userId}/transactions")
    public List<TransactionResponse> getUserTransactions(@PathVariable Long userId) {

        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

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
