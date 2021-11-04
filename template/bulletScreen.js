
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
        var bullet = $("<div>"); 
        //生成一条弹幕 
        bullet.text(obj.from + ': ' + obj.msg); 
        //将输入框内容放置到div中 
        bullet.addClass("bullet"); 
        //为bullet这个div添加样式bullet 
        bullet.css("top",Math.round(Math.random()*500)); 
        //随机设置弹幕位置 
        bullet.css("left","1600px"); 
        bullet.css("font-size",Math.round(Math.random()*60)+12+"px"); 
        bullet.css("color","rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")"); 
        bullet.animate({ 
            left:-1000//此处视为bug，应该随着弹幕的长短而变化 
            // 越大越慢
        }, Math.round(Math.random()*9000)+3000,"linear", function(){ 
            bullet.remove(); 
        //当运动结束时，删除弹幕 
        }); 
        
        $(".content")[0] && $(".content").append(bullet);
    }
    ws.onerror = function(evt) {
        print("ERROR: " + evt.data);
    } 

    document.getElementById("send") && (document.getElementById("send").onclick = function(evt) {
        if (!ws) {
            return false;
        }

        msg='{"data_list":[{"from": "'+ input_from.value +'" , "msg":"' + input.value + '","to":"' + input_to.value+'"}] }'
        ws.send(msg);
        alert('弹幕已发送成功，请留意大屏幕')
        return false;
    });
  
});