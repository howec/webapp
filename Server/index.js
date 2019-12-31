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
	writeData(workspaceDictionary);

}

/*
Function to write the workspaceDictionary into memory, replacing it if it already exists.
*/
function writeData(dict){
		fs.writeFile("./data/workspaceDictionary.json", JSON.stringify(dict, null, 4), (err) => {
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

	//add user (using socket.id) as an entry in a json file with all stored
	// activeUsers[socket.id] = "associated entries";
	console.log('We have a new connection!!! ' + socket.id);
	console.log('user socket id is: ' + socket.id + "... length of activeUsers is: " + Object.keys(activeUsers).length);

	socket.on('disconnect', function(){
		delete activeUsers[socket.id];
		console.log('a user disconnected:' + socket.id + "... now length of activeUsers is: " + Object.keys(activeUsers).length);
	});

	socket.on('loggedout', function(){
		delete activeUsers[socket.id];
		console.log('a user logged out:' + socket.id + "... now length of activeUsers is: " + Object.keys(activeUsers).length);
	});

	//tdl
	socket.on('FINALLY', function(data){
		console.log(data.msg + " SocketID is: " + socket.id);
	});

	socket.on('workspaceSubmitted', function(data){
		//to change!!!
		if(data.workspace == "NAME"){
			socket.emit("workspaceValidation", {valid: true});
			console.log("Entered workspaceSubmitted");
		}else{
			socket.emit("workspaceValidation", {valid: false});
		}
	});



	//will need to revise so as that email isn't the only thing that we're checking on
	//this will probably need to be the authentication token
	socket.on("loggedin", function(data){
		//function needed to check the workspace name
		//function needed to check if person exists in the workspace name for said group

		activeUsers[socket.id] = data;
		//function needed to get the email corresponding to the authentication token
		console.log('Connection has been STORED! USING SOCKET.ID: ' + socket.id);
		console.log("length of activeUsers is: " + Object.keys(activeUsers).length);


		// activeUsers[socket.id] = [socket, data.email]
		console.log('from loggedin socket listener: ' + data.email);
		sendPartnerSpreadsheet(socket, data.email);
 
	});



	socket.on("createWorkspace", function(data){

		let name = data["name"];
		let url = data["url"];
		if(checkWorkspaceAvailability(data)){
			workspaceDictionary[data] = "enter the url of the staff sheet here";

			//create Staff login credentials
				//username, password, password again
				//send the email to verify
			//need to check validity of url
			//need to ask user to share their url to the google-email
			//need to create/delete a sheet as a test
			//set up the STAFF sheet, but then set up PARTNERS and STUDENTS
			//need to create/delete sheets as test for PARTNERS and STUDENTS



			console.log("sdjalksdjas " + data + workspaceDictionary);
			writeData(workspaceDictionary);	
			socket.emit("workspaceStatus", {msg: "The workspace has been created!"});
		}

		socket.emit("workspaceStatus", {msg: "This workspace name has already been taken."});

	});


	socket.on("login", function(data){
		//if valid login, then emit "access" to client and link socket to the scoped info within respective sheets
	});


	socket.on("loginSubmitted", function(data){
		console.log("Form has been submitted. workspace:" + data.workspace);
		console.log("Form has been submitted. group:" + data.group);
		console.log("Form has been submitted. email: " + data.email);
		console.log("Form has been submitted. password: " + data.password);

		//if match... assume true for now
		socket.emit("loginValidation", {valid: false});

	});


});

//End of socket events ----------------------------------------------

function selectedEntries(selections, data){
	let selectedData = {};

	for(const x in selections){
		selectedData[x] = data[x];
	}

	return selectedData;
}



/*
Verify user upon login attempt. Does not modify any globals.
Instead, the function configures scope variables for a user as referenced by Socket.
*/
function loginStaffPartner(category ){

}


function checkWorkspaceAvailability(workspaceName){
	console.log("Name of the passed in workspace: " + workspaceName);
	if (workspaceDictionary[workspaceName] == undefined){
		console.log("This workspace name is available!");		
		return true;
	}
	console.log("This workspace has already been created.");
	return false;
}



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




function parseURL(url){

	//to implement
	//look inside the corresponding JSON provided

	return url;
}

function setPartnerSpreadsheetURL(url){
	partnerSheet = new GoogleSpreadsheet(parseURL(url));
}

function setStudentSpreadsheetURL(url){
	studentSheet = new GoogleSpreadsheet(parseURL(url));
}

function setStaffSpreadsheetURL(url){
	staffSheet = new GoogleSpreadsheet(parseURL(url));
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













