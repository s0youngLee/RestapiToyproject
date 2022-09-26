//package com.example.restapi.restApiTest;
//
//import com.example.restapi.RestApiApplicationTests;
//import com.example.restapi.model.entity.Board;
//import com.example.restapi.repository.BoardRepository;
//import org.junit.Assert;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import javax.transaction.Transactional;
//
//@RunWith(SpringRunner.class)
//public class BoardRepositoryTest extends RestApiApplicationTests {
//    @Autowired
//    private BoardRepository boardRepository;
//
//    @Test
//    public void create(){
//        String boardTitle = "BoardTest01";
//        String createdId = "Admin Lee";
//
//        Board board = new Board();
//        board.setBoardTitle(boardTitle);
//        board.setCreatedId(createdId);
//
//        Board newBoard = boardRepository.save(board);
//
//        Assert.assertNotNull(newBoard);
//        Assert.assertEquals(newBoard.getBoardTitle(), boardTitle);
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
