package com.kas.online_book_shop.controller;

import com.kas.online_book_shop.model.BookCollection;
import com.kas.online_book_shop.service.BookCollectionService;
import com.kas.online_book_shop.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost"})
@RequiredArgsConstructor
@RequestMapping("/api/v1/book-collection")
public class BookCollectionController {
    private final BookCollectionService bookCollectionService;
    private final BookService bookService;

    @GetMapping("")
    public ResponseEntity<List<BookCollection>> getBookCollections() {
        var bookCollections = bookCollectionService.getAllBookCollections();
        if (bookCollections.isEmpty())
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.ok(bookCollections);
    }

    @GetMapping("/sorted-and-paged")
    public ResponseEntity<Page<BookCollection>> getAllAuthorPagedAndSorted(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        Direction direction = (sortOrder.equalsIgnoreCase("asc")) ? Direction.ASC : Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, direction, sortBy);
        return ResponseEntity.ok(bookCollectionService.getAllBookCollections(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookCollection> getBookCollectionById(@PathVariable Long id) {
            return ResponseEntity.ok(bookCollectionService.getBookCollectionById(id));
    }

    @PostMapping()
    public ResponseEntity<BookCollection> saveBookCollection(@RequestBody BookCollection BookCollection) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookCollectionService.saveBookCollection(BookCollection));
    }

    @PutMapping
    public ResponseEntity<BookCollection> updateBookCollection(@RequestBody BookCollection updatedBookCollection) {
        return ResponseEntity.ok(bookCollectionService.updateBookCollection(updatedBookCollection));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookCollection(@PathVariable Long id) {
        bookCollectionService.deleteBookCollection(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/add-to-collection")
    public ResponseEntity<Void> addBookToCollection(
        @RequestParam(name = "book") Long bookId,
        @RequestParam(name = "collection") Long collectionId
    ) {
        bookService.addBookToCollection(bookId, collectionId);
        return ResponseEntity.noContent().build();
    }

}
