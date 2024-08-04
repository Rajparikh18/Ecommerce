import express from "express";
const app=express();
const port=3000;

const nums=18;
app.get("/api/raj",(req,res)=>{
    res.json({nums:nums});
})

app.listen(port,()=>{
    console.log(`running on ${port}`);
})