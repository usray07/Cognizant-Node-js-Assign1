const express = require("express");
const { removeStopwords } = require('stopword')
const bodyParser = require("body-parser");

// New app using express module
const app = express();
app.use(bodyParser.urlencoded({
	extended:true
}));

app.get("/", function(req, res) {
res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    rawStr = req.body.rawStr;
    if(rawStr.length!=0){
        var segsent = sentenceSegmentation(rawStr);
        var segword = wordSegmentation(rawStr);
        var swords = segword.join(', ');
        var rmdstopwords = rmStopwords(segword);
        var uni = noDuplicates(segword);
        var reversed = revWords(segword);
        var numbers = extractNumbers(segword);
        var processed = {ss:segsent,sw:swords,rsp:rmdstopwords,u:uni,rev:reversed,nm:numbers};
        
        res.render('index.pug', processed);
    }
    else{
        res.send('How can I process an Empty string?? So Enter atleast something')
    }

});


app.listen(3000, function(){
console.log("server is running on port 3000");
})

//Sentence Segmentation
function sentenceSegmentation (str) {
    // const sentences = str.split('.');    #built in method
    var buff ='';
    var sentences = [];
    for (var i=0; i<str.length;i++){
        if (str[i] == '.' || str[i]=='!' || str[i]=='?'){
            sentences.push(buff+str[i]); 
            buff='';
        }    
        else{
            buff+=str[i];
        }          
    }
    if (buff!=''){
        sentences.push(buff); // for sentences without proper ending symbol  
    }
    return sentences;
}


//Word Segmentation

function wordSegmentation(str){
    // const sentences = str.split(' ');    #built in method
    var buff =''
    var words =[]
    for (var i=0;i<str.length;i++){
        if (str[i] != '.' && str[i]!='!' && str[i]!='?' && str[i]!= ' '){
            buff+=str[i];
        }
        if (str[i]==' ' || i==str.length-1){
            words.push(buff);
            buff='';
        }
    }
    return words;
}

// Removing Stopwords

function rmStopwords(words){
    const newString = removeStopwords(words).join(' ');

    return newString;
}


//Removing Duplicates

function noDuplicates(words){
    uniques = new Set(words);
    if (words.length==uniques.length)
        return words;
    var uniq = Array.from(uniques);
    ans = uniq.join(' ');
    return ans;
}

//Reversing each word of the Sentence

function revWords(words){
    var reversed =[];
    for(var i=0; i<words.length; i++){
        var rev = "";
        var str = words[i];
        for (var j = str.length - 1; j >= 0; j--) {
            rev += str[j];
        }
        reversed.push(rev);
    }
    return reversed.join(' ');
}

//Extracting Numbers

function extractNumbers(words){
    var numbers = [];
    for(var i=0;i<words.length;i++){
        var num = words[i].match(/(\d+)/);
        if(num!==null)
            numbers.push(num[0]);
    }
    if (numbers.length==0)
        return 'No Numbers in the String'
    return numbers.join(', ');
}

