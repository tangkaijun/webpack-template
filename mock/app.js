const path = require('path');
const express = require('express');
const mockjs = require('express-mockjs');
const app = express();
const port = 8090 ;


app.use('/api',mockjs(path.join(__dirname,'api')));

app.listen(port,function(){
	console.log(`listening on http://localhost:${port}/api`);
});
