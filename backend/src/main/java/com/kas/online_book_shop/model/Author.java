package com.kas.online_book_shop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Table(name = "author")
@Entity
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Validate name
    @NotBlank(message = "The author name is required")
    @Pattern(
            regexp = "^[\\p{L}\\s]+$",
            message = "Tên tác giả không được chứa số hoặc ký tự đặc biệt"
    )
    private String name;

    // ✅ Optional validate company
    @Pattern(
            regexp = "^[\\p{L}0-9\\s]*$",
            message = "Tên công ty không được chứa ký tự đặc biệt"
    )
    private String company;

    @ManyToMany(mappedBy = "authors")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore
    private Set<Book> books;
}