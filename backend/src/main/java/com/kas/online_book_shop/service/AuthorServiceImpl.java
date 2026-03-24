package com.kas.online_book_shop.service;

import com.kas.online_book_shop.exception.ResourceNotFoundException;
import com.kas.online_book_shop.model.Author;
import com.kas.online_book_shop.repository.AuthorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;

    @Override
    public void deleteAuthor(Long id) {
        var author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tác giả để xóa"));

        author.getBooks().forEach(x -> x.getAuthors().remove(author));
        authorRepository.deleteById(id);
    }

    @Override
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    // ✅ CREATE
    @Override
    public Author saveAuthor(Author author) {

        // check trùng (không phân biệt hoa thường)
        boolean exists = authorRepository.findAll().stream()
                .anyMatch(a -> a.getName().equalsIgnoreCase(author.getName()));

        if (exists) {
            throw new RuntimeException("Tên tác giả đã tồn tại");
        }

        return authorRepository.save(author);
    }

    // ✅ UPDATE
    @Override
    public Author updateAuthor(Author author) {

        Author existing = authorRepository.findById(author.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tác giả để cập nhật"));

        // nếu đổi tên thì mới check trùng
        boolean exists = authorRepository.findAll().stream()
                .anyMatch(a -> !a.getId().equals(author.getId()) &&
                        a.getName().equalsIgnoreCase(author.getName()));

        if (exists) {
            throw new RuntimeException("Tên tác giả đã tồn tại");
        }

        return authorRepository.save(author);
    }

    @Override
    public Author getAuthorById(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tác giả tương ứng"));
    }

    @Override
    public Page<Author> getAllAuthor(Pageable pageable) {
        return authorRepository.findAll(pageable);
    }
}