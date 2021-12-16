package main

import (
	"SpotBoiler/onlineChat"
	"flag"
	"fmt"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":14487", "http service address")

var staticfs = http.FileServer(http.Dir("./template/"))

func serveHome(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)

	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "./template/screen.html")
}

func main() {
	flag.Parse()
	hub := onlineChat.NewHub()
	go hub.Run()
	http.Handle("/page/", http.StripPrefix("/page/", staticfs))
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		onlineChat.ServeWs(hub, w, r)
	})
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		fmt.Println("ListenAndServe err: ", err, " *addr: ", *addr)
	}
}
