var fns = []
function registerBulletFn(fn){
    fns.push(fn)
}

var visitorId = ""

const fpPromise = new Promise((resolve, reject) => {
const script = document.createElement('script')
script.onload = resolve
script.onerror = reject
script.async = true
script.src = 'https://cdn.jsdelivr.net/npm/'
    + '@fingerprintjs/fingerprintjs@3/dist/fp.min.js'
document.head.appendChild(script)
})
.then(() => FingerprintJS.load())

// Get the visitor identifier when you need it.
fpPromise
.then(fp => fp.get())
.then(result => {
    // This is the visitor identifier:
    visitorId= result.visitorId
    
})


window.addEventListener("load", function(evt) {
    
    var output = document.getElementById("output");
    var input = document.getElementById("input");
    var input_to = document.getElementById("input_to");
    var input_from = document.getElementById("input_from");
    var ws;
    var print = function(message) {
        var d = document.createElement("div");
        d.innerHTML = message;
        output.appendChild(d);
    };
    var p_roomid="5225"
    ws = new WebSocket("ws://" + document.location.host +"/ws?roomid=" + p_roomid + "&username=xaavvcc");
    ws.onopen = function(evt) {
            
    }
    ws.onclose = function(evt) {
        
        ws = null;
    }
    ws.onmessage = function(evt) {
        //取出输入框内容
        
        var obj = JSON.parse(evt.data) 
        console.log(evt.data)
        var bullet = $("<div>"); 
        //生成一条弹幕 
        bullet.text("@" + obj.fromName + ': ' + obj.msg); 
        //将输入框内容放置到div中 
        bullet.addClass("bullet"); 
        //为bullet这个div添加样式bullet 
        bullet.css("top",Math.round(Math.random()*500)); 
        //随机设置弹幕位置 
        bullet.css("left","1600px"); 
        bullet.css("font-size",Math.round(Math.random()*52)+20+"px"); 
        bullet.css("color","rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")"); 
        bullet.animate({ 
            left:-1000//此处视为bug，应该随着弹幕的长短而变化 
            // 越大越慢
        }, Math.round(Math.random()*2000)+10000,"linear", function(){ 
            bullet.remove(); 
        //当运动结束时，删除弹幕 
        }); 

        var bulletData = {
            //cmd: body.cmd,
              //color: body.info[0][3],
              uid: obj.from,
              name: obj.fromName,
              //admin: body.info[2][2],
              //vip: body.info[2][3],
              //svip: body.info[2][4],
              text:"tezt",
              medal_name:  "没勋章",
              medal_level:  "0",
              //user_level: body.info[4][0],
              //guard: body.info[7],
              roomid: p_roomid,
        }
        for (var i=0;i<fns.length;i++)
        { 
            fns[i](bulletData)
        }
        //lotteryFilter(bulletData) 
        $(".content")[0] && $(".content").append(bullet);
    }
    ws.onerror = function(evt) {
        print("ERROR: " + evt.data);
    } 

    document.getElementById("send") && (document.getElementById("send").onclick = function(evt) {
        if (!ws) {
            return false;
        }
        msg = {"data_list":[{"fromName":input_from.value,"from":visitorId,"msg":input.value,"to":input_to.value}] } //visitorId
        
        //msg='{"data_list":[{"fromName": "' +   input_from.value+ '", "from": "'+ visitorId +'" , "msg":"' + input.value + '","to":"' + input_to.value+'"}] }'
        ws.send(JSON.stringify(msg));
        alert('弹幕已发送成功，请留意大屏幕')
        return false;
    });
  
});