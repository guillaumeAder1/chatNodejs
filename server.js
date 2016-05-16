var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affich� au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});



// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
var nbrUser = 0;
var userList = [];
var conversation = [];

io.sockets.on('connection', function (socket) {

    console.log('Un client est connecte !');
	socket.emit("message", "msg from server");


	socket.on("msgName", function(msgName){
		console.log(msgName)

	})

	socket.on("newText", function(newText){
		console.log(newText)
		conversation.push(newText)
		socket.broadcast.emit("newMsg", newText);
	})

	socket.on("newUser", function(newUser){
		nbrUser += 1;
		socket.emit("updateCounter", nbrUser)
		socket.broadcast.emit("updateCounter", nbrUser)


		userList.push(newUser)
		socket.broadcast.emit("foreignUser", newUser)
        console.log(userList)
	})
    socket.on("disconnect-user", function(user){

        console.log(user);

        nbrUser -= 1;
        socket.emit("updateCounter", nbrUser)
        socket.broadcast.emit("updateCounter", nbrUser)

        if(userList.indexOf(user) != -1){
            var index = userList.indexOf(user);
            userList.splice(index, 1)
        }

        console.log(user + "  disconnected")
        user.left = true;
        u = {
            left: true,
            name: user
        }
        socket.broadcast.emit("user-left", u);
        console.log(userList)

    })
    socket.on("onblur", function(user, status){

        console.log("user " + user + " is " + status)
    });

});


server.listen(8080);
