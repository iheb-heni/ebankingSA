package com.example.ebanking.repository;

import com.example.ebanking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Méthode dérivée - Spring Data génère automatiquement la requête
    Optional<User> findByEmail(String email);
    
    // Méthode dérivée pour exists
    Boolean existsByEmail(String email);
    
    // OU si vous voulez utiliser des requêtes natives explicites :
    /*
    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Optional<User> findByEmail(@Param("email") String email);
    
    @Query(value = "SELECT COUNT(*) > 0 FROM users WHERE email = :email", nativeQuery = true)
    Boolean existsByEmail(@Param("email") String email);
    */
}