const express = require('express');


const {randomBytes} = require('crypto');
const cors = require('cors');
const app = express();
const axios = require('axios');
app.use(cors());


const  commentsById = {};

app.use(express.urlencoded({extended: true}));

app.use(express.json())

app.get('/', (req, res) => {
res.send('it is work') 	
});

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsById[req.params.id] || []) 	
 });

app.post('/posts/:id/comments', async (req, res) => {
const id = randomBytes(4).toString('hex') 	
const {content} = req.body;

const comments = commentsById[req.params.id] || [];

comments.push({id , content , status: 'pending'})

commentsById[req.params.id] = comments;

await axios.post('http://localhost:5000/event',{
    type: 'commentCreat',
    data: {
        id , content ,
        postId : req.params.id, 
        status :'pending'
        
    }
})

res.status(201).send(comments);

 });

 app.post('/event', async (req, res)=>{
    const {type,data} = req.body;
    if (type === 'commentModerate'){
        const {postId , id , status , content} = data;
        const comments = commentsById[postId];
        const comment = comments.find(comment=>{
            return comment.id = id
        })
        comment.status = status;
        await axios.post('http://localhost:5000/event',{
            type: 'commentUpdated',
            data: {
                id ,
                content ,
                postId ,
                status 
            }
        
        })
    }
   
    res.send({})
}) 

 app.listen(3500, () => {
     console.log(`Server started on 3500`);
 });