package com.lendenclub.transactionservice.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> transferBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // 1️⃣ Rate limit login endpoint (by IP)
        if (path.contains("/auth/login")) {
            String ip = request.getRemoteAddr();
            Bucket bucket = loginBuckets.computeIfAbsent(ip, k -> createLoginBucket());

            if (!bucket.tryConsume(1)) {
                sendRateLimitResponse(response, "Too many login attempts. Try again later.");
                return;
            }
        }

        // 2️⃣ Rate limit transfer endpoint (by user)
        if (path.contains("/api/transfer")) {
            String user = request.getUserPrincipal() != null
                    ? request.getUserPrincipal().getName()
                    : "anonymous";

            Bucket bucket = transferBuckets.computeIfAbsent(user, k -> createTransferBucket());

            if (!bucket.tryConsume(1)) {
                sendRateLimitResponse(response, "Too many transfers. Please slow down.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Bucket createLoginBucket() {
        Bandwidth limit = Bandwidth.classic(
                5,
                Refill.greedy(5, Duration.ofMinutes(1))
        );

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }


    private Bucket createTransferBucket() {
        Bandwidth limit = Bandwidth.classic(
                10,
                Refill.greedy(10, Duration.ofMinutes(1))
        );

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }


    private void sendRateLimitResponse(HttpServletResponse response, String message)
            throws IOException {

        response.setStatus(429);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
}
