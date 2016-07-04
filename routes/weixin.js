var express = require('express');
var router = express.Router();
var URL = require('url');
var crypto = require('crypto');
var select = require('xpath.js');
var dom = require('xmldom').DOMParser;


var token = "zhengrenkun"; //微信验证token
var weixinhao="gh_c5424fbd0ab4";


router.get('/', function(req, res, next) {
    var arg = URL.parse(req.url, true).query;
    console.log(arg);
    console.log("body------"+req.body);
    if(isFromWeixin(arg)){
        console.log("99999");
        if (false){//如果url带有echostr参数，说明是微信接入验证。
            res.send(arg["echostr"]);
            console.log("0000");
        }else {
            console.log("1111");
            console.log(req.body.toString());


        }
    }else {
        console.log("22222");
        res.send("erro");
    }
});
router.post('/', function(req, res,next) {
    var arg = URL.parse(req.url, true).query;
    console.log(arg);

    var arr = [];
    req.on("data",function(data){
        arr.push(data);
    });
    req.on("end",function(){
        var data= Buffer.concat(arr).toString();
        console.log("data------"+data);
            console.log(result);
            res.send(messageHandler(data));//微信消息处理
            console.log(result);

    })
});
function messageHandler(data) {
    var doc = new dom().parseFromString(data);
    var FromUserName=select(doc, "//FromUserName").firstChild.data,
        ToUserName=select(doc, "//ToUserName").firstChild.data,
        CreateTime=select(doc, "//CreateTime").firstChild.data,
        MsgType=select(doc, "//MsgType").firstChild.data,
        result;
    console.log(FromUserName);
    switch(MsgType)
    {
        case "text":
            result="<xml>"+
                    "<ToUserName><![CDATA["+FromUserName+"]]></ToUserName>"+
                    "<FromUserName><![CDATA["+ToUserName+"]]></FromUserName>"+
                    "<CreateTime>12345678</CreateTime>"+
                    "<MsgType><![CDATA[text]]></MsgType>"+
                    "<Content><![CDATA[wocao]]></Content>"+
                    "</xml>";

            break;
        case "image":

            break;
        case "voice":

            break;
        case "video":

            break;
        case "shortvideo":

            break;
        case "location":

            break;
        case "link":

            break;
        default:
            ;
    }

    result="<xml>"+
        "<ToUserName><![CDATA["+FromUserName+"]]></ToUserName>"+
        "<FromUserName><![CDATA["+ToUserName+"]]></FromUserName>"+
        "<CreateTime>"+data.getTime()+"</CreateTime>"+
        "<MsgType><![CDATA[text]]></MsgType>"+
        "<Content><![CDATA[wocao]]></Content>"+
        "</xml>";
    console.log(result);
    return result;
}

//通过对签名的效验，来判断此条消息的真实性,是否来自微信。
function isFromWeixin(arg) {
    var signature = arg["signature"],
        timestamp = arg["timestamp"],
        nonce = arg["nonce"],
        echostr = arg["echostr"];

    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = [token,timestamp,nonce];
    array.sort();
    var str = array.toString().replace(/,/g,"");

    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str,'utf-8').digest("hex");

    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(code===signature){
        console.log("true");
        return true;

    }else{
        console.log("false");
        return  false;
    }
}
module.exports = router;
