const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('*', {
      target: 'http://localhost:8080',
      changeOrigin: true
    })
  );

//   app.post("/board/", (req, res) => {
//     var userId = req.body.userId;
//     var content = req.body.content;
  
//     const sqlQuery =
//       "INSERT INTO comment (user_id, content) FROM (?,?);";
//     db.query(sqlQuery, [userId, content], (err, result) => {
//       res.send(result);
//     });
//   });

};