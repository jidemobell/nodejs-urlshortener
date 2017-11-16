const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 8080;
const urlRegex = require('url-regex');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://jidemobell:pooc1234@ds157325.mlab.com:57325/nodejs-urlshorten'
//const dbUrl= `mongodb://${process.env.USER}:${process.env.PASS}@${process.env.HOST}:${process.env.DBPORT}/${process.env.DB}`
app.use(bodyParser.urlencoded({extended:true}))

const queryCollection = (collection,toAppend)=>{
    if(collection.find({number:toAppend}).count()>0){
        return true;
    }else{
        return false;
    }
}




app.get('/home/:url(*)',(req,res)=>{
    let toAppend = Math.floor(Math.random()*1000);
    let urlCollection = db.collection('urlCollection');
    let entry = req.params.url;

    console.log(toAppend);
    if(urlRegex({exact:true}).test(entry) && !queryCollection(urlCollection,toAppend)){
        console.log('I am a good url: ')
        console.log('url: '+ entry)
        urlCollection.insert({
            number: toAppend,
            original_url: entry,
            short_url: "localhost:8080/" + toAppend,
        })
      //  db.close();
        res.json({
            original_url: entry,
            short_url: "localhost:8080/" + toAppend,
        })
    }else{
        console.log('that url is invalid')
        res.json({error : 'provide a valid URL'})
    }
    
})


app.get('/:shortUrl',(req,res)=>{
    console.log('I am here');
    let urlCollection = db.collection('urlCollection')
    console.log('url search param is '+ req.params.shortUrl)
    console.log('localhost:8080/' + req.params.shortUrl)
    
    urlCollection.find({
        number:Number(req.params.shortUrl)
    },{_id:0,number:0,short_url:0}).toArray(function(error,document){
                 if(error) {
                    res.send('URL not in our database');
                    console.error(error);
                   // db.close();
                 }else{
                    console.log(document[0].original_url);
                    res.redirect(200, document[0].original_url);
                  //  db.close();
                 }
                 
             
    })
   
})


MongoClient.connect(dbUrl,(err,data)=>{
    if(err) console.log('database connectiion error')
    db = data;
    app.listen(port,()=>{
        console.log("This is a node js app running on port "+ port)
     })

})

