const express = require("express");
const path=require('path');
const cookieParser=require("cookie-parser");
const URL = require("./models/url");
const {connectToMongoDB}=require("./connection");

const app=express();
const PORT=8001;

const urlRoute=require('./routes/url')
const staticRoute=require("./routes/staticRouter")
const userRoute=require("./routes/user");

const { restrictToLoggedInUserOnly, checkAuth } = require("./middlewares/auth");

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(()=> console.log("MongoDB connected"));

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
 
//SSR
// app.get("/test",async(req,res)=>{
//     const allUrls = await URL.find({});
//     return res.render('home',{
//         urls: allUrls,
//     });
// });


app.use('/url',restrictToLoggedInUserOnly,urlRoute);
app.use("/",checkAuth,staticRoute);
app.use("/user",userRoute);

app.get('/url/:shortId', async (req,res) =>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
        shortId
        },
        {$push: {
        visitHistory:{
            timestamp: Date.now(),
        },
    },
}
);
res.redirect(entry.redirectURL);
})



app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));