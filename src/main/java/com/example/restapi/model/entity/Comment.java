package com.example.restapi.model.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
//4. 댓글 (게시글 하나에 여러개 (댓글 N : 1 게시글))
//        > Create, Delete 구성
//
//        Article 1  :  N  Comment
//        ( Article 안에 Comment. Article Delete 시 Comment 모두 Delete )
//

//
//        Create  ( /board/{article_id} POST )
//        id - Auto Increase
//        "content" : "comment content",
//        created_at - LocalDateTime.now()
//
//        Delete ( /board/{article_id}/{comment_id} DELETE )
////      check id == created id (later)



@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@EntityListeners(AuditingEntityListener.class)
@Accessors(chain = true)
@DynamicInsert
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String userId;

    private String content;

    private LocalDateTime createdAt;

    @Column(name = "article_id", insertable = false, updatable = false)
    private Integer articleId;

    @ManyToOne
    @JoinColumn(name = "article_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Article article;

}