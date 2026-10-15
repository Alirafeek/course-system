const express =require("express")
const app =express()
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcrypt")
const session=require("express-session")
const port=process.env.port||3000
require ("dotenv").config()
app.use(cors())
app.use(session({
    secret:"courses-key",
    resave:false,
    saveUninitialized:false
}))
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Database Conectetd")
})

.catch((error)=>{
 console.log("Database not Conected",error.message)
})

const studentSchema=new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    age:Number,
    course:String,
    password:String,
})

const Student=mongoose.model("Student",studentSchema)
app.get("/",(req,res)=>{

 res.sendFile(__dirname+"/index.html")
})
app.post("/students",async(req,res)=>{
 try{
    const passwordv=await bcrypt.hash(req.body.password,10)
    const student=await Student.create({
    name:String,
    phone:req.body.phone,
    email:req.body.email,
    age:req.body.age,
    course:req.body.course,
    password:passwordv,
    })
    res.json({
        message:"Student already registrated",
        student:student
    })
 }
 catch(error){
    res.status(500).json({
        message:"something erorr"
    })
 }
 
})
   
app.post("/login",async(req,res)=>{
 try{
    const {email,password}=(req.body)
    const student=await Student.findOne({email:email})
    if(!student){
        return res.send(
            `<h1>email or password is incorrect</h1>`
        )
    
    }
    const passwordc=await bcrypt.compare(password,student.password)
    if(!passwordc){
        return res.send(
            `<h1> password is incorrect</h1>`
        )
    }
    req.session.studentId=student._id
    res.redirect("/records_vedios.html")
 }
 catch(error){
    res.status(500).json({
        message:"something erorr"
    })
 }
 
})

app.get("/me",async(req,res)=>{
    try{
        if(!req.session.studentId){
            return res.status(401).json({
                message:"not login"
            })
        }
        const student=await Student.findById(req.session.studentId).select("-password")
        if(!student){
            return res.status(404).json({
                message:"student not found"
            })
        }
        res.json(student)
    }
    catch(error){
        res.status(500).json({
            message:"something error"
        })
    }
})



app.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login.html")
    })
})






app.listen(port,()=>{
 console.log("server running")
})