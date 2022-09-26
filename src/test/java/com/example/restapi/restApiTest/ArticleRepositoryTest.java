//package com.example.restapi.restApiTest;
//
//import com.example.restapi.RestApiApplicationTests;
//import com.example.restapi.model.entity.Article;
//import com.example.restapi.repository.ArticleRepository;
//import org.junit.Assert;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import javax.transaction.Transactional;
//import java.time.LocalDateTime;
//
//
//@RunWith(SpringRunner.class)
//public class ArticleRepositoryTest extends RestApiApplicationTests {
//    @Autowired
//    private ArticleRepository articleRepository;
//
//    @Test
//    public void create(){
//        String title = "Test01";
//        String content = "test01";
//        String createdId = "Admin Lee";
//
//        Article article = new Article();
//        article.setTitle(title);
//        article.setContent(content);
//        article.setCreatedId(createdId);
//        article.setCreatedAt(LocalDateTime.now());
//
//        Article newArticle = articleRepository.save(article);
//
//        Assert.assertNotNull(newArticle);
//        Assert.assertEquals(newArticle.getTitle(), title);
//    }
//
//    @Test
//    @Transactional
//    public void read(){
//
//    }
//
//    @Test
//    @Transactional
//    public void update(){
//
//    }
//
//    @Test
//    @Transactional
//    public void delete(){
//
//    }
//}
