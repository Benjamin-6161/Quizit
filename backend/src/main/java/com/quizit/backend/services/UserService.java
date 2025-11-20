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
	
	//getUserById
	public Optional<User> getUserById(Long userId){
		return repo.findById(userId);
	}

	//get user by email
	public Optional<User> getUserByEmail(String email) {
		return repo.findOneByEmail(email);
	}
	
	//get user by username
	public Optional<User> getUserByUsername(String username){
		return repo.findOneByUsername(username);
	}

	//register user
	public void registerUser(User user) {
		repo.save(user);
		repo.flush();//flush ensures immediate persistence after calling register function so the registered user is immediately available to all other threads
	}
	
	//delete user
	public void deleteUser(Long userId){
		repo.deleteById(userId);
	}
	
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOpt = repo.findOneByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return new CustomUserDetails(user);
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
      }
}

}