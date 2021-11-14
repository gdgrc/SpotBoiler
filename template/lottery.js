// 展示获取到的弹幕并加入抽奖池
var lottery_arr = [];
var lottery_contrast_arr = [];
var medal_level_min = 1,
    medal_level_max = 20,
    user_level_min = 1,
    user_level_max = 60,
    danmaku_setting,
    pass = 0;

function getlotteryList(res) {

    return lottery_arr
}

// 普通模式
function lotteryPureFilter(res) {
    var index = $.inArray(res.uid, lottery_contrast_arr)
    if (index == -1) {
      
        lottery_arr.push([res.uid, res.name, res.medal_name, res.medal_level]);
        lottery_contrast_arr.push(res.uid);
       
        console.log('%c 【' + res.name + '[ uid: ' + res.uid + ' ]】成为了新的抽奖队伍成员', "color: green");
        //					console.log(lottery_arr)
        //					$('.arr_list').remove();
        //					var arr_list = '<div class="arr_list" style="font-size: 12px;">' + lottery_arr + '</div>';
        //					$('.lottery_pool').eq(0).prepend(arr_list);
    } else {
        lottery_arr[index]=[res.uid, res.name, res.medal_name, res.medal_level]
        
        console.log('%c 【' + res.name + '[ uid: ' + res.uid + ' ]】已经在等待抽奖的队伍中了！', "color: red");
    }
}
function lotteryFilter(res) {
  
    //	console.log(res.uid);
    var danmaku_content = '<div class="danmu"><div class="fans-medal-item level-' + res.medal_level +
        '"><span class="label">' + res.medal_name + '</span><span class="level">' + res.medal_level +
        '</span></div><div class="level-' + res.medal_level +
        '" style="display: inline-block;"><span class="level" style="padding-left: 4px;">' + res.name +
        '   :</span>   ' +
        res.text + '</div></div>'
    $('.danmaku_content').eq(0).append(danmaku_content);
    $('.danmaku_content').eq(0).scrollTop($('.danmaku_content')[0].scrollHeight);
    if ($(".danmu").length >= 15) { // 限制显示条数，防卡
        $(".danmu").eq(0).remove()
    }


  
    if ($.inArray(res.uid, lottery_contrast_arr) == -1) {
        var lottery_join =
            '<div class="lottory"><span style="padding-right: 4px;">非洲人</span><div class="fans-medal-item level-' +
            res.medal_level +
            '"><span class="label">' + res.medal_name + '</span><span class="level">' + res.medal_level +
            '</span></div><span style="padding-left: 4px; color: blue;">' + res.name +
            '</span><span style="padding-left: 4px;"> 加入了拉低中奖率的队伍</span></div>'
        $('.lottery_content').eq(0).append(lottery_join);
        $('.lottery_content').eq(0).scrollTop($('.lottery_content')[0].scrollHeight);
        lottery_arr.push([res.uid, res.name, res.medal_name, res.medal_level]);
        lottery_contrast_arr.push(res.uid);
        if ($(".lottory").length >= 15) {
            $(".lottory").eq(0).remove()
        }
        console.log('%c 【' + res.name + '[ uid: ' + res.uid + ' ]】成为了新的抽奖队伍成员', "color: green");
        //					console.log(lottery_arr)
        //					$('.arr_list').remove();
        //					var arr_list = '<div class="arr_list" style="font-size: 12px;">' + lottery_arr + '</div>';
        //					$('.lottery_pool').eq(0).prepend(arr_list);
    } else {
        console.log('%c 【' + res.name + '[ uid: ' + res.uid + ' ]】已经在等待抽奖的队伍中了！', "color: red");
    }
    $('.lottery_member').remove();
    $('.lottery_info').eq(0).prepend('<div class="lottery_member" style="color: blue; ">当前非洲人的数量为：' +
        lottery_contrast_arr.length + '</div>');
}


window.addEventListener("load", function(evt) {
    
    $('.clean').eq(0).bind('click', function () { // 清空弹幕抽奖池
        console.log("good clean")
        $('.danmaku_content').eq(0).empty();
        $('.lottery_info').eq(0).empty();
        $('.lottery_content').eq(0).empty();
        lottery_arr = [];
        lottery_contrast_arr = [];
    })
    $('.storage_clean').eq(0).bind('click', function () { // 清空中奖名单
        $('.winner_list').eq(0).empty();
        sessionStorage.clear();
    })

    var boomEle = document.getElementById("boom")
    if(boomEle!=null){
        boomEle.onclick = function (evt) {

            console.log('good boom')
            if (lottery_arr.length) {
                var lucky_numarr = [];
                var lucky_numarrnew = [];
                var winners_arr = [];
                var winners_contrast = [];
                for (var i = 0; i < lottery_arr.length; i++) {
                    lucky_numarr.push(i);
                }
                //				console.log(lucky_numarr);
                lucky_numarr.sort(function () {
                    return 0.5 - Math.random(); //返回随机正负值  
                });

                function randomSort(arr, newArr) {
                    // 如果原数组arr的length值等于1时，原数组只有一个值，其键值为0
                    // 同时将这个值push到新数组newArr中
                    if (arr.length == 1) {
                        newArr.push(arr[0]);
                        return newArr; // 相当于递归退出
                    }
                    // 在原数组length基础上取出一个随机数
                    var random = Math.ceil(Math.random() * arr.length) - 1;
                    // 将原数组中的随机一个值push到新数组newArr中
                    newArr.push(arr[random]);
                    // 对应删除原数组arr的对应数组项
                    arr.splice(random, 1);
                    return randomSort(arr, newArr);
                }
                for (var i = 0; i < lucky_numarr.length; i++) {
                    randomSort(lucky_numarr, lucky_numarrnew);
                }
                console.log(lucky_numarrnew);
                var winner_amount = $('#winner_amount').val() || 1;
                if (winner_amount % 1 != 0 || winner_amount <= 0 || winner_amount > lottery_arr.length) {
                    return alert('无效的抽奖人数');
                }
                var storage_name = '';
                var lucky_dogs;
                
                lucky_dogs = '<div class="lottory">萌萌兽被水淹没，不知所措，经过不断摸索，摸到了下面几条弹幕_(:з」∠)_<br />';
                for (var i = 0; i < winner_amount; i++) {
                    if (!lottery_arr[lucky_numarrnew[i]]) {
                        alert('哎呀~没人来交易了……');
                        continue;
                    } else if ($.inArray(lottery_arr[lucky_numarrnew[i]][0], winners_contrast) != -
                        1) {
                        if (winner_amount >= lottery_arr.length) {
                            return alert('出错了，去重后设置的中奖人数大于参加抽奖的人数');
                        }
                        winner_amount++;
                        continue;
                    } else if (sessionStorage.getItem(lottery_arr[lucky_numarrnew[i]][0])) { // 多次中奖处理机制
                        alert('命运石之门选中了【' + lottery_arr[lucky_numarrnew[i]][1] + '】' + '\n' +
                            '但是你已经过了！' +
                            '\n' +
                            '喜新厌旧的萌萌兽并不想跟你交易第二次' +
                            '\n' + '点击确定换个人交易_(:з」∠)_');
                        winner_amount++;
                        continue;
                    } else if (lottery_arr[lucky_numarrnew[i]]) {
                        winners_contrast.push(lottery_arr[lucky_numarrnew[i]][0]);
                        sessionStorage.setItem(lottery_arr[lucky_numarrnew[i]][0], lottery_arr[
                            lucky_numarrnew[
                                i]][1]);
                        lucky_dogs += '<div class="fans-medal-item level-' + lottery_arr[
                                lucky_numarrnew[i]][3] +
                            '"><span class="label">' + lottery_arr[lucky_numarrnew[i]][2] +
                            '</span><span class="level">' + lottery_arr[
                                lucky_numarrnew[i]][3] +
                            '</span></div><span style="padding-left: 4px;"></span><span style="padding-left: 4px; color: blue;">' +
                            lottery_arr[lucky_numarrnew[i]][1] + ' [ uid: ' +
                            lottery_arr[lucky_numarrnew[i]][0] + ' ] :</span> ' + lottery_arr[
                                lucky_numarrnew[i]]
                            [4] + '</span><br />';
                        storage_name += '<span>' + lottery_arr[lucky_numarrnew[i]][1] +
                            ' | </span>';
                    }
                }
                lucky_dogs += '<span style="padding-left: 4px;">是直接打死还是走程序？</span></div>';
                if (storage_name) {
                    $('.lottory').remove();
                    $('.lottery_content').eq(0).append(lucky_dogs);
                    $('.winner_list').eq(0).append(storage_name);
                }
                //			lottery_arr.splice(lucky_num, 1);	
            } else {
                alert('抽奖列表为空');
            }

        };
    }
  
});
