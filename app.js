const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https');
const { json } = require('express/lib/response');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html')
})

//POST for our success route
app.post('/', function(req, res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    // console.log(firstName);
    // console.log(lastName);
    // console.log(email);

    //we need to pass our object as a javascript object to Mailchimp
    //the format in which MailChimp API expects data
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    //Now we have our JSON data, this is what we're going to send to Mailchimp

    //we want to post data to an external resource

    const url = "https://us14.api.mailchimp.com/3.0/lists/954803f297" //mailchimp endpoint

    const options = {
        method: "POST",
        auth: "Sambhavi:4503e093b5ceb09fb8f28575eff92b1-us14"//for authentication
        
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200)
            res.sendFile(__dirname+'/success.html')
        else
            res.sendFile(__dirname+ '/failure.html')

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    //sending the object that we want to send,
    request.write(jsonData);
    request.end();
});



//POST for failure route
app.post('/failure', function(req, res){
    res.redirect('/')
})

app.listen(3000, function () {
    console.log("The server is running at port 3000");
})

