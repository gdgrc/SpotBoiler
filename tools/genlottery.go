package main

import (
	"fmt"
	"math/rand"
	"time"
)

/*
// 展示获取到的弹幕并加入抽奖池
var lottery_arr = [
    ['A','A','',''],
    ['B','B','',''],
    ['C','C','',''],
    ['D','D','',''],
    ['E','E','',''],
    ['F','F','',''],
    ['G','G','',''],
    ['H','H','',''],
    ['J','J','',''],
    ['K','K','',''],
    ['L','L','',''],
    ['M','M','',''],
    ['N','N','',''],
    ['O','O','',''],
    ['P','P','',''],
    ['Q','Q','',''],
    ['R','R','',''],
    ['S','S','',''],
    ['T','T','',''],
    ['U','U','',''],
    ['V','V','',''],
    ['W','W','',''],
    ['Z','Z','',''],
    ['X','X','',''],
    ['X','X','',''],
];
var lottery_contrast_arr = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W','Z','X'
];
*/
func RandString(len int) string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	bytes := make([]byte, len)
	for i := 0; i < len; i++ {
		b := r.Intn(26) + 65
		bytes[i] = byte(b)
	}
	return string(bytes)
}
func main() {
	uidList := map[string]bool{}
	s := "var lottery_arr = ["
	for i := 0; i < 150; i++ {
		rs := RandString(5)
		if _, ok := uidList[rs]; ok {
			continue
		}

		if i > 0 {
			s += ",\n"
		}
		s += fmt.Sprintf("\t['%s','%s','','']", rs, rs)
		uidList[rs] = true
	}
	s += "\n];\n"

	s += "var lottery_contrast_arr = ["
	i := 0
	for v, _ := range uidList {
		if i > 0 {
			s += ","
		}
		s += fmt.Sprintf("'%s'", v)
		i = i + 1
	}
	s += "\n];"
	fmt.Println(s)
}
