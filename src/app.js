import express from "express";
const app=express();
const port=3000;


app.get("/raj",(req,res)=>{
    res.send("hello <h1>raj</h1>");
})

app.listen(port,()=>{
    console.log(`running on ${port}`);
})