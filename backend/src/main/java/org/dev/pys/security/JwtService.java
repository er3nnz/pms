package org.dev.pys.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.dev.pys.enumarate.Role;
import org.dev.pys.exception.AuthExceptions.TokenExpiredException;
import org.dev.pys.exception.AuthExceptions.UnauthorizedException;
import org.dev.pys.repository.BlacklistTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private final BlacklistTokenRepository blacklistRepo;

    public JwtService(BlacklistTokenRepository blacklistRepo) {
        this.blacklistRepo = blacklistRepo;
    }

    public String generateToken(String username, Role role) {
        if (role == null) {
            throw new IllegalArgumentException("Role null olamaz");
        }

        SecretKey key = getSignKey();
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = getClaims(token);
        return claimsResolver.apply(claims);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public void validateToken(String token) {
        try {
            if (isTokenExpired(token)) {
                throw new TokenExpiredException("Token süresi dolmuş");
            }
            if (blacklistRepo.existsByToken(token)) {
                throw new UnauthorizedException("Token geçersiz kılınmış");
            }
        } catch (TokenExpiredException e) {
            throw e;
        } catch (Exception e) {
            throw new UnauthorizedException("Token doğrulanamadı: " + e.getMessage());
        }
    }

    private Claims getClaims(String token) {
        SecretKey key = getSignKey();
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new TokenExpiredException("Token süresi dolmuş");
        } catch (Exception e) {
            throw new UnauthorizedException("Token geçersiz veya bozuk");
        }
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}