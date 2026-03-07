package com.kas.online_book_shop.controller;

import com.kas.online_book_shop.model.PostCategory;
import com.kas.online_book_shop.service.PostCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost"})
@RequiredArgsConstructor
@RequestMapping("/api/v1/post-category")
public class PostCategoryController {

    private final PostCategoryService postCategoryService;

    @GetMapping("")
    public ResponseEntity<List<PostCategory>> getPostCategories() {
        var postCategories = postCategoryService.getAllPostCategories();
        if (postCategories.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(postCategories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostCategory> getPostCategoryId(
        @PathVariable Long id) {
        var postCategory = postCategoryService.getPostCategoryById(id);
        if (postCategory == null)
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(postCategory);
    }

    @PostMapping()
    public ResponseEntity<PostCategory> savePostCategory(
        @Valid @RequestBody PostCategory postCategory) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postCategoryService.savePostCategory(postCategory));
    }

    @PutMapping()
    public ResponseEntity<PostCategory> updatePostCategory(
        @Valid @RequestBody PostCategory category) {
        return ResponseEntity.ok(postCategoryService.updatePostCategory(category));        
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostCategory(@PathVariable Long id) {
        postCategoryService.deletePostCategory(id);
        return ResponseEntity.noContent().build();
    }
}
