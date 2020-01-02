//setup
const fs = require('fs');



const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./GitIgnore/apis_backend_client_secret.json'); //my secret key

const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(router);


server.listen(PORT, () => console.log('Server has started on port ' + PORT));

//CODE HERE:
/*
Global variables ----------------------------------------------
*/
const activeUsers = {};
const unfinishedWorkspaces = {};
const unfinishedURLs = {};

/*
Load the workspaceDictionary into memory upon WebApp initialization.
If no workspaceDictionary is found, then create an empty dictionary and store it in memory.
*/
let workspaceDictionary;
try{
	var contents = fs.readFileSync('./data/workspaceDictionary.json', 'utf8');
	workspaceDictionary = JSON.parse(contents);
}catch(error){
	console.log(error);
	workspaceDictionary = {};
	writeWorkspaceData(workspaceDictionary);
}

/*
Load the urlDictionary into memory upon WebApp initialization.
If no urlDictionary is found, then create an empty dictionary and store it in memory.
*/
let urlDictionary;
try{
	var contents = fs.readFileSync('./data/urlDictionary.json', 'utf8');
	urlDictionary = JSON.parse(contents);
}catch(error){
	console.log(error);
	urlDictionary = {};
	writeURLData(urlDictionary);
}


/*
Function to write the workspaceDictionary into memory, replacing it if it already exists.
*/
function writeWorkspaceData(dict){
		fs.writeFile("./data/workspaceDictionary.json", JSON.stringify(dict, null, 4), (err) => {
		    if (err) {
		        console.error(err);
		        return;
		    };
		    console.log("File has been created");
		});
	}


/*
Function to write the urlDictionary into memory, replacing it if it already exists.
*/
function writeURLData(dict){
		fs.writeFile("./data/urlDictionary.json", JSON.stringify(dict, null, 4), (err) => {
		    if (err) {
		        console.error(err);
		        return;
		    };
		    console.log("File has been created");
		});
	}





/*
Sockets events ----------------------------------------------
*/
io.on('connection', function(socket){
	activeUsers[socket.id] = null;

	//add user (using socket.id) as an entry in a json file with all stored
	// activeUsers[socket.id] = "associated entries";
	console.log('We have a new connection!!! ' + socket.id);
	console.log('user socket id is: ' + socket.id + "... length of activeUsers is: " + Object.keys(activeUsers).length);



	socket.on('disconnect', function(){
		let name = activeUsers[socket.id];
		let urls;

		if(unfinishedWorkspaces[name] !== undefined){
			urls = unfinishedWorkspaces[name][1];

			//removes any unfinished urls upon disconnect
			delete unfinishedURLs[urls[0]];
			delete unfinishedURLs[urls[1]];
			delete unfinishedURLs[urls[2]];
		}


		//removes any unfinished workspaces upon disconnect
		delete unfinishedWorkspaces[name];
		delete activeUsers[socket.id];
		console.log('a user disconnected:' + socket.id + "... now length of activeUsers is: " + Object.keys(activeUsers).length);
	});

	//-------- NavigationBar.js --------

	socket.on('loggedout', function(){
		delete activeUsers[socket.id];
		console.log('a user logged out:' + socket.id + "... now length of activeUsers is: " + Object.keys(activeUsers).length);
	});

	//-------- Login.js --------

	//not sure where this actually is
	socket.on("login", function(data){
		//if valid login, then emit "access" to client and link socket to the scoped info within respective sheets
	});

	//not sure where this actually is
	socket.on("loginSubmitted", function(data){
		console.log("Form has been submitted. workspace:" + data.workspace);
		console.log("Form has been submitted. group:" + data.group);
		console.log("Form has been submitted. email: " + data.email);
		console.log("Form has been submitted. password: " + data.password);

		//if match... assume true for now
		socket.emit("loginValidation", {valid: false});

	});

	//not sure where this is
	//HOWE PROBABLY CAN DELETE?
	//will need to revise so as that email isn't the only thing that we're checking on
	//this will probably need to be the authentication token
	socket.on("loggedin", function(data){
		//function needed to check the workspace name
		//function needed to check if person exists in the workspace name for said group

		activeUsers[socket.id] = data.email;
		//function needed to get the email corresponding to the authentication token
		console.log('Connection has been STORED! USING SOCKET.ID: ' + socket.id);
		console.log("length of activeUsers is: " + Object.keys(activeUsers).length);


		// activeUsers[socket.id] = [socket, data.email]
		console.log('from loggedin socket listener: ' + data.email);
		sendPartnerSpreadsheet(socket, data.email);
 
	});


	//HOWE tdl... not sure where this is
	socket.on('FINALLY', function(data){
		console.log(data.msg + " SocketID is: " + socket.id);
	});

	socket.on('workspaceSubmitted', function(data){
		//HOWE to change!!!
		if(data.workspace == "NAME"){
			socket.emit("workspaceValidation", {valid: true});
			console.log("Entered workspaceSubmitted");
		}else{
			socket.emit("workspaceValidation", {valid: false});
		}
	});
 



//-------------- CreateStep1.js --------------
	socket.on("createStep1_p1", function(data){
		let urlStaff = parseURL(data.url);

		checkSheetSharing("sheetShared", urlStaff, socket);

	});

	socket.on("createStep1_p2", function(data){
		let sharing = data.sharing;
		let urlStaff = parseURL(data.url);
		let name = data.name;

		console.log("Sharing: " + sharing);
		console.log("Name: " + name);
		console.log("URL: " + urlStaff);

		let workspaceOK = null;
		let staffOK = null;


		if(checkWorkspaceAvailability(name,socket)){
			socket.emit("workspaceStatus", {ok: true, msg: "The workspace name is available!"});
			workspaceOK = true;
		}else{
			socket.emit("workspaceStatus", {ok: false, msg: "This workspace name cannot be used."});
			workspaceOK = false;
		}


		staffOK = urlConditions("urlStatus", urlStaff, sharing, socket);


		if(staffOK && workspaceOK){
			unfinishedWorkspaces[name] = [socket.id, [urlStaff, "temp student", "temp partner"]];
			unfinishedURLs[urlStaff] = name;
			socket.emit("approved", {msg: "Workspace and URL both valid!"})


			console.log("the workspace stuff created from step1 is...")
			console.log(unfinishedWorkspaces[name]);
		}



	});


//-------------- CreateStep2.js --------------


	socket.on("createStep2_p1", function(data){
		let urlPartner = parseURL(data.urlPartner);
		let urlStudent = parseURL(data.urlStudent);

		checkSheetSharing("partnerShared", urlPartner, socket);
		checkSheetSharing("studentShared", urlStudent, socket);

	});

	socket.on("createStep2_p2", function(data){

		let partnerSharing = data.partnerSharing;
		let urlPartner = parseURL(data.urlPartner);
		let studentSharing = data.studentSharing;
		let urlStudent = parseURL(data.urlStudent);
		let name = activeUsers[socket.id];

		console.log("urlPartner: " + urlPartner);
		console.log("urlStudent: " + urlStudent);
		console.log("Name: " + name);

		let partnerOK = urlConditions("partnerStatus", urlPartner, partnerSharing, socket);
		let studentOK = urlConditions("studentStatus", urlStudent, studentSharing, socket);


		if(partnerOK && studentOK){
			let prevs = unfinishedWorkspaces[name];
			let socketID = prevs[0];
			let urls = prevs[1];

			urls[1] = urlStudent;
			urls[2] = urlPartner;

			unfinishedWorkspaces[name] = [socketID, urls];
			unfinishedURLs[urlStudent] = name;
			unfinishedURLs[urlPartner] = name;
			socket.emit("approved", {msg: "Both URLs are valid!"})

			console.log("the workspace stuff created from step2 is...")
			console.log(unfinishedWorkspaces[name]);
		}
	});

//-------------- CreateStep3.js --------------




//End of socket listeners ----------------------------------------------
});


//Start of socket helper functions ----------------------------------------------

//Howe... will need to use the variable: unfinishedURLs
function unusedURL(url){
	return true;
}

//HOWE
function checkURL(url){
	return true;
}

//HOWE
function parseURL(url){
	return url;
}



//Called for socket emissions in CreateStep1.js
function checkSheetSharing(event, url, socket){
	let doc = new GoogleSpreadsheet(url);

	doc.useServiceAccountAuth(creds, function (err) {
	  doc.getRows(1, function (err, rows){

	  	if(rows != undefined){
	  		socket.emit(event, {shared: true});
	  	} else{
	  		socket.emit(event, {shared: false});
	  	}

	  });
	});
}


//Called for socket emissions in CreateStep1.js
function checkWorkspaceAvailability(name, sock){
	console.log("Name of the passed in workspace: " + name);
	if (workspaceDictionary[name] == undefined){
		if(unfinishedWorkspaces[name] == undefined || sock.id==unfinishedWorkspaces[name][0]){
			console.log("This workspace name is available!");	
			unfinishedWorkspaces[name] = [sock.id, ["temp staff", "temp student", "temp partner"]];
			console.log(unfinishedWorkspaces[name]);

			activeUsers[sock.id] = name;

			return true;
		}
	}
	console.log("This workspace has already been created.");
	return false;
}


function urlConditions(event, url, sharing, socket){
	let urlOK = null;

	//HOWE
	//Even though we already know if a URL is good or not from part1, this generates the error message for the client
	if (checkURL(url)){
		//HOWE
		//need to check if the url has not been used before
		if(unusedURL(url)){
			//HOWE
			//need to check if the url has been activated and shared with the google email
			//need to create/delete a sheet as a test?
			if(sharing == true){
				socket.emit(event, {ok: true, msg: "URL looks good!"});
				urlOK = true;
				//has not officially been stored into memory yet. Sheet sharing privileges must first be verified
			} else{
				socket.emit(event, {ok: false, msg: "URL has not been shared privileges."})
				urlOK = false;
			}
		} else{
			socket.emit(event, {ok: false, msg: "URL has already been used."})
			urlOK = false;
		}
	} else{
		socket.emit(event, {ok: false, msg: "URL is invalid! Make sure it's a valid link or properly formatted."});
		urlOK = false;
	}

	return urlOK;

}



//End of socket helper functions ----------------------------------------------


// let partner = '1X2udtqxCNpha3V0GV26Gmz0mADe_W6lfZW_z4YzOTcI';
let partner = '1G_va7huCsZGj-iVrk6Ki0PYo9UGE05cGIlfsunrG3Sg';
let student = '1GXGJV1FfcUeIGk8T6_G6EUmKcLTSfQWxck1TX2k9-tw';
let staff = '18ugcQrxTlo2I3MzTrfMLPLI4HYAVNRnwFaF54KI7jZA';


//Need functionality to load a json file containing relevant info for that directory



//stored
var partnerSheet = '';
var studentSheet = '';
var staffSheet = '';

setPartnerSpreadsheetURL(partner);
setStaffSpreadsheetURL(staff);


function setPartnerSpreadsheetURL(url){
	partnerSheet = new GoogleSpreadsheet(parseURL(url));

	// console.log(partnerSheet === {});
}

function setStudentSpreadsheetURL(url){
	studentSheet = new GoogleSpreadsheet(parseURL(url));
}

function setStaffSpreadsheetURL(url){
	staffSheet = new GoogleSpreadsheet(parseURL(url));
}


function sendStaffSpreadsheet(sock, email){
	// Authenticate with the Google Spreadsheets API.

	staffSheet.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  staffSheet.getRows(1, function (err, rows) {
	    // console.log(rows);
		  	console.log("LOOKLOOK the sheet is: " + JSON.stringify(staffSheet));
		  	console.log("LOOKLOOK the sheet.info is: " + JSON.stringify(staffSheet.info));

	  });
	});

}


function sendPartnerSpreadsheet(sock, email){
	// Authenticate with the Google Spreadsheets API.

	partnerSheet.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  partnerSheet.getRows(1, function (err, rows) {
	    // console.log(rows);

	    //HOWE LOOK HERE
	    //TODO: add functionality to send to SPECIFIC socket!!!!
	    //that means I need to know WHO is calling this function

	    // for (var k = 0; k<rows.length; k++){
	    // 	console.log(rows[k]);
	    // }

	    var position = null;
	    for (const x in rows){
	    	if(rows[x]["emailaddress"] == email){
	    		position = x;
	    	}
	    }

	    //function to select the columns specified by the Staff sheet
	    let selectedStuff = {};
	    let temp = {};
	    // let selectedColumns = getSelectedColumns()
	    // console.log(rows[position]);
	    var count = 0;
		for (const key in rows[0]){
	    	temp[count] = key;
	    	count = count + 1;
	    }
	    partnerColumns = temp;
		console.log("I've been called inside SendPartnerSpreadsheet");
		console.log(rows[0][partnerColumns[7]]);
		console.log(partnerColumns);

	    sock.emit("sendingattempt", {attempt: rows[position]});


	  });
	});

}



function sendStudentSpreadsheet(){
	// Authenticate with the Google Spreadsheets API.
	studentSheet.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  studentSheet.getRows(1, function (err, rows) {
	    // console.log(rows);
	  });
	});
} 



//------
var partnerColumns = {};

//to be instantiated during server startup
//then whenever 
function getPartnerColumns(){
	let temp = {}

	// Authenticate with the Google Spreadsheets API.
	partnerSheet.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  partnerSheet.getRows(1, function (err, rows) {

	  	var count = 0;
	    for (const key in rows[0]){
	    	temp[count] = key;
	    	count = count + 1;
	    }
	    partnerColumns = temp;

	    //partnerColumns now has a value
		console.log("I've been called");
		console.log(rows[0][partnerColumns[7]]);
		console.log(partnerColumns);
	  });
	});
} getPartnerColumns();




function updatePartnerSheets(){

	// Authenticate with the Google Spreadsheets API.
	partnerSheet.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  partnerSheet.getInfo(function (err, data) {

	  	function persistenceCreated(wsName){
	  		let headersArray;

	  		if(wsName == "Partner Values"){
	  			headersArray = ["Project", "Lead", "Hash Identifier", "Hashed Username", "Hashed Password", "Interested Apps", "Interviewed Apps", "Accepted Apps", "Waitlisted Apps", "Rejected Apps"]
	  		}

	  		for(const ws of data.worksheets){
	  			if(ws.title == wsName){
	  				return true;
	  			}
	  		}
	  		//need to check if adding rows will automatically expand the spreadsheet, or if the amount of space needs to be specified first
	  		partnerSheet.addWorksheet({title: wsName, headers: headersArray}, function(err){
	  			//fill in code to put 

	  		});
	  		return false;
	  	}


	  	if (persistenceCreated("Partner Values")){
	  		console.log("Should be entered now that it's created");

	  		//fill in code to replace values

	  	}

	  	console.log(data.worksheets[0].title);

	  });
	});

} updatePartnerSheets();



function updateStaffSheets(){

	// Authenticate with the Google Spreadsheets API.
	staffSheet.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  staffSheet.getInfo(function (err, data) {

	  	function persistenceCreated(wsName){
	  		let headersArray;
	  		if (wsName == "Staff Values"){
	  			headersArray = ["Selected Spreadsheet Columns", "Updates"];
	  		}

	  		if(wsName == "References"){
	  			headersArray == ["URL", "Purpose", "Workspace Name"]
	  		}

	  		for(const ws of data.worksheets){
	  			if(ws.title == wsName){
	  				return true;
	  			}
	  		}
	  		//need to check if adding rows will automatically expand the spreadsheet, or if the amount of space needs to be specified first
	  		staffSheet.addWorksheet({title: wsName, headers: headersArray}, function(err){
	  			//fill in code to put 

	  		});
	  		return false;
	  	}

	  	if (persistenceCreated("Staff Values")){
	  		console.log("Should be entered now that it's created");
	  		//fill in code to replace values
	  	}

	  	if (persistenceCreated("References")){
	  		console.log("Should be entered now that it's created");
	  		//fill in code to replace values
	  	}

	  	console.log("262 " + data.worksheets[0].title);

	  });
	});
} updateStaffSheets();













