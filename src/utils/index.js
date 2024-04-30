const express = require('express')
const app = express()

const db = require('../db/dbconection');
require('dotenv').config();

const HostelBoys = require('../modals/user.modal');

app.post('/', async(req,res) =>{
    try {
       const data = req.data;
       const newdata = new HostelBoys(data);
       const responce = await newdata.save();
       console.log('data save');
       res.status(200).json(responce);

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }
})

app.get('/Student', async(req,res) =>{
    try {
        const data = await HostelBoys.find();
        console.log('data fetched');
        res.status(200).json(data);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
  });