package com.lendenclub.transactionservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private String senderName;
    private String receiverName;
    private BigDecimal amount;
    private String status;
    private LocalDateTime timestamp;

    public TransactionResponse(
            Long id,
            String senderName,
            String receiverName,
            BigDecimal amount,
            String status,
            LocalDateTime timestamp
    ) {
        this.id = id;
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.amount = amount;
        this.status = status;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
