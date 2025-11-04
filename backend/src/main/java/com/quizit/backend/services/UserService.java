package com.quizit.backend.services;

import java.util.Optional;

import com.quizit.backend.models.User;
import com.quizit.backend.repository.UserRepository;
import com.quizit.backend.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService{
	
	@Autowired
	UserRepository repo;

	//get user by email
	public Optional<User> getUserByEmail(String email) {
		return repo.findOneByEmail(email);
	}

	//register user
	public void registerUser(User user) {
		repo.save(user);
	}
	
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repo.findOneByEmail(email).get();
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new CustomUserDetails(user);
    }

}