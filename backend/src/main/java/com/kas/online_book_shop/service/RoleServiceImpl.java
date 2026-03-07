package com.kas.online_book_shop.service;

import com.kas.online_book_shop.enums.Role;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class RoleServiceImpl implements RoleService{
    @Override
    public List<Role> getAllRoles() {
        return List.of(Role.values());
    }
    
}
