package com.FashionStore.backend.Security;

	import java.util.Date;

	import javax.crypto.SecretKey;

	import org.springframework.stereotype.Service;

	import io.jsonwebtoken.Claims;
	import io.jsonwebtoken.Jwts;
	import io.jsonwebtoken.security.Keys;

	@Service
	public class JwtService {

	    private final SecretKey secretKey =
	            Keys.hmacShaKeyFor(
	                    "fashion-store-super-secret-key-2026-production"
	                            .getBytes()
	            );

	    private final long jwtExpiration =
	            1000 * 60 * 60 * 24;

	    public String generateToken(
	            String email,
	            String role) {

	        return Jwts.builder()
	                .subject(email)
	                .claim("role", role)
	                .issuedAt(new Date())
	                .expiration(
	                        new Date(
	                                System.currentTimeMillis()
	                                        + jwtExpiration
	                        )
	                )
	                .signWith(secretKey)
	                .compact();
	    }

	    public String extractEmail(String token) {

	        return extractClaims(token)
	                .getSubject();
	    }

	    public String extractRole(String token) {

	        return extractClaims(token)
	                .get("role", String.class);
	    }

	    public boolean isTokenValid(
	            String token,
	            String email) {

	        String tokenEmail =
	                extractEmail(token);

	        return tokenEmail.equals(email)
	                && !isTokenExpired(token);
	    }

	    private boolean isTokenExpired(String token) {

	        return extractClaims(token)
	                .getExpiration()
	                .before(new Date());
	    }

	    private Claims extractClaims(String token) {

	        return Jwts.parser()
	                .verifyWith(secretKey)
	                .build()
	                .parseSignedClaims(token)
	                .getPayload();
	    }
	
}
