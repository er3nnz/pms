package org.dev.pys.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "blacklist_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlacklistToken extends BaseEntity {

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expiryDate;
}