/*
Terminology:
	Gsheet = Googlesheet (overarching container doc)
	Wsheet = Worksheet (individiual tabs in doc)

	Worksheets will be explicitly labeled as a Wsheet. Unless stated otherwise, all sheets are a Gsheet.
	Todo: relabel all sheets as Gsheets; convention going forward is to name a sheet as a Gsheet.

	Operating assumption: googlesheets may NOT be modified after being linked to the server. The server
		does all modifications and records it. This is to protect the authenticity of the data and safeguards
		the server from crashing.
	Recommendation if you want to modify the sheet after having published it:
		Create a COPY of the sheet you want to use
		Staff may use the ADD_APPROVED_ROWS** function (yet to be implemented) to add rows to EITHER the Partner sheet, or the Student sheet
			This allows the SERVER to know if it has added the data or not, and will store this time in memory
			for use in authentication

TODO:
	HTTPS encryption
	Must add password hashing to both frontend/backend
		https://www.npmjs.com/package/js-sha256
	Workspace length checks + special characters
	Password length checks + special characters
	Email validation based on regex
	Function to restore/reset password... only for the backend
	Lock account creation to only people who are DSEP for now, OR be better at catching bad/null values
	Less worried about doing this in account creation, though it is theoretically possible that someone jams
		the server by using a script to delete the worksheet the server makes immediately, causing potential null
		exceptions. --> TESTED: will be fine. No null exceptions occur if the server attempts to add a row into
		a non-existent wsheet. HOWEVER, must still be careful of getter methods when the clients request data
		upon login.
	Create export functionality
	Student >> Applicant
	Partner >> Reviewer


*/

//setup
const fs = require('fs');


const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./GitIgnore/apis_backend_client_secret.json'); //my secret key

const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5001;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);


server.listen(PORT, () => console.log('Server has started on port ' + PORT));


const hash = require('object-hash');
//CODE HERE:
/*
Global variables ----------------------------------------------
*/
const activeUsers = {};
const loggedUsers = {};
const unfinishedWorkspaces = {};
const unfinishedURLs = {};

/*
Staff Inputs -- Columns
{
  '0': '_xml',
  '1': 'id',
  '2': 'app:edited',
  '3': '_links',
  '4': 'staffemail',
  '5': 'staffpassword',
  '6': 'workspacename',
  '7': 'studentsheeturl',
  '8': 'partnersheeturl',
  '9': 'orgname',
  '10': 'orglink',
  '11': 'timelinedates',
  '12': 'notices',
  '13': 'studentdatasheet',
  '14': 'partnerdatasheet',
  '15': 'studentsheetindex',
  '16': 'selectedcolumnsfromstudentspreadsheet',
  '17': 'studenttopartnermappings',
  '18': 'partnersheetindex',
  '19': 'selectedcolumnsfrompartnerspreadsheet',
  '20': 'rejectedpartners',
  '21': 'rejectedstudents',
  '22': 'starredstudents',
  '23': 'renamedpartnercolumns',
  '24': 'renamedstudentcolumns',
  '25': 'sheetsconfigured',
  '26': 'activatedworkspace',
  '27': 'save',
  '28': 'del'
}
*/

//If any mappings are incorrect, instead of error-breaking, the app should return no values
//JSON.parse values
const staffInputsSheet = ["Staff Inputs", [	//String: credentials
											//configured on creation
											"Staff Email", "Staff Password", "Workspace Name", "Student Sheet URL", "Partner Sheet URL",
											//String: navbar banner name & link
											//configurable in Staff/ConfigureBanner
											"Org Name", "Org Link",
											//Dict: key: deadline type, value: date
											//configurable in Staff/ConfigureSheets
											"Timeline Dates",
											//Dict: homepage, key=(Timestamp), values=(title, message)
											//configurable in home
											"Notices",
											//String: names of the tab containing application data for Partner/Student 
											//configurable in Staff/ConfigureSheets
											"Student Data Tab Name", "Partner Data Tab Name",
											//List of strings: values of the gsheet columns to use for indexing upon retrieval
											//configurable in Staff/ConfigureSheets
											"Student Sheet Index", "Selected Columns from Student Spreadsheet", "Student to Partner Mappings",
											//List of strings: values of the gsheet columns to use for indexing upon retrieval
											//configurable in Staff/ConfigureSheets
											"Partner Sheet Index", "Selected Columns from Partner Spreadsheet",
											//List of strings: emails (partner/student sheet indexer) of prescreened individuals
											//configurable in Staff/Screening
											"Rejected Partners", "Rejected Students", "Starred Students",
											//Dict: renamed columns for user display on client-side, key=gsheet column values, values=renamed values
											//configurable in Staff/ConfigureSheets
											"Renamed Partner Columns", "Renamed Student Columns",
											//Boolean: values based on whether partner/student sheets have been configured and if workspace is active
											//configured in Staff/ConfigureSheets and Staff/
											"Sheets Configured", "Activated Workspace"]];
const studentInputsSheet = ["Student Inputs", ["Student Email", "Student Password", "Student Name", "Confirmation if Accepted"]];
const partnerInputsSheet = ["Partner Inputs", ["Partner Email", "Partner Password", "Partner Name", "Project Name", "Project Hash Identifier", "Application Reviews"]];



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
	writeWorkspaceData();
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
	writeURLData();
}


/*
Function to write the workspaceDictionary into memory, replacing it if it already exists.
*/
function writeWorkspaceData(){
		fs.writeFile("./data/workspaceDictionary.json", JSON.stringify(workspaceDictionary, null, 4), (err) => {
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
function writeURLData(){
		fs.writeFile("./data/urlDictionary.json", JSON.stringify(urlDictionary, null, 4), (err) => {
		    if (err) {
		        console.error(err);
		        return;
		    };
		    console.log("File has been created");
		});
	}


function updateURLData(url, timestamp){
	urlDictionary[url] = timestamp;
	writeURLData();
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
		delete loggedUsers[socket.id];
		console.log('a user disconnected:' + socket.id + "... now length of activeUsers is: " + Object.keys(activeUsers).length);
	});

	//-------- NavigationBar.js --------

	socket.on('loggedout', function(){
		delete loggedUsers[socket.id];

		console.log('a user logged out:' + socket.id + "... now length of activeUsers is: " + Object.keys(activeUsers).length);
	});

	//-------- Login.js --------

	//if made it to loginSubmitted, then we know that the workspace was correct, and we now have group info
	//not a problem if someone tries to spoof email and workspace -- without password they can't access info
	//to extend to gmail login, just wrap everything below in its own function and make sure data parameters are the same
	//or cp it and modify
	socket.on("loginSubmitted", function(data){
		let workspace = data.workspace;
		let group = data.group;
		let email = data.email;
		let password = data.password;


		let staffURL = workspaceDictionary[workspace];
		let staffSheet = new GoogleSpreadsheet(staffURL);

		staffSheet.useServiceAccountAuth(creds, function (err) {

			staffSheet.getInfo(function(err){
			let staffIndex = getWsheetIndex(staffSheet, staffInputsSheet[0]);

				if(staffIndex !== null && compareURLHash(staffURL, staffSheet) === true){
				 	staffSheet.getRows(staffIndex, function (err, rows){
					  	let columns = {};
					  	var count = 0;
					    for (const key in rows[0]){
					    	columns[count] = key;
					    	count = count + 1;
					    }
					    //use as key for now
					    console.log(columns);

					    if(group === "Staff"){
							if(rows[0][columns[5]]===password && rows[0][columns[4]]===email){
								//HOWE: you must do this for Student and Partner
								delete activeUsers[socket.id];
								loggedUsers[socket.id] = [workspace, group, email];

								let orgName = rows[0][columns[9]];
								let orgLink = rows[0][columns[10]];

								socket.emit("loginValidation", {valid: true, bannerStuff: [orgName, orgLink]});		
							} else{
								socket.emit("loginValidation", {valid: false});
							}
					    } else if(group==="Student"){
					    	let studentURL = rows[0][columns[7]];
					    	let studentSheet = new GoogleSpreadsheet(studentURL);
							studentSheet.useServiceAccountAuth(creds, function (err) {
								studentSheet.getInfo(function(err){
									//check if sheet has been configured
									//check if the sheet has not been tampered with
									//need to compare where the email index is
									//check if the passwords match

									//send student data over... look into student sheets
								});
							});

						} else if(group==="Partner"){
							let partnerURL = rows[0][columns[8]];
							let partnerSheet = new GoogleSpreadsheet(partnerURL);
							partnerSheet.useServiceAccountAuth(creds, function (err) {
								partnerSheet.getInfo(function(err){
									//check if sheet has been configured
									//check if the sheet has not been tampered with
									//need to compare where the email index is
									//check if the passwords match

									//send partner data over... look into partner sheets
								});
							});
						}
					});
				} else{
					//fails upon modified sheet
					socket.emit("loginValidation", {valid: false});
				}
			});
		});
	});

	//not sure where this is
	//HOWE PROBABLY CAN DELETE?
	//will need to revise so as that email isn't the only thing that we're checking on
	//this will probably need to be the authentication token
	socket.on("gLoginSubmitted", function(data){
		//function needed to check the workspace name
		//function needed to check if person exists in the workspace name for said group

		loggedUsers[socket.id] = data.email;
		delete activeUsers[socket.id];


		//function needed to get the email corresponding to the authentication token
		console.log('Connection has been STORED! USING SOCKET.ID: ' + socket.id);
		console.log("length of activeUsers is: " + Object.keys(activeUsers).length);


		// activeUsers[socket.id] = [socket, data.email]
		console.log('from loggedin socket listener: ' + data.email);
		sendPartnerSpreadsheet(socket, data.email);

	});

	socket.on('workspaceSubmitted', function(data){
		if(workspaceDictionary[data.workspace]){
			socket.emit("workspaceValidation", {valid: true});
			console.log("Entered workspaceSubmitted");
		}else{
			socket.emit("workspaceValidation", {valid: false});
		}
	});
 
	//-------- StaffLanding.js --------

		//-------- BannerConfigurations.js --------
	socket.on("configureBanner", function(data){
		console.log("Inside configureBanner")
		//-------- Set data variables
		let orgName = data.orgName;
		let orgURL = "//" + data.orgURL;

		//--------Set workspace variables
		let user = loggedUsers[socket.id];

		let workspace = user[0];
		let group = user[1];
		let email = user[2];

		let staffURL = workspaceDictionary[workspace];
		let staffSheet = new GoogleSpreadsheet(staffURL);

		staffSheet.useServiceAccountAuth(creds, function (err) {

			staffSheet.getInfo(function(err){
			let staffIndex = getWsheetIndex(staffSheet, staffInputsSheet[0]);

				if(staffIndex !== null && compareURLHash(staffURL, staffSheet) === true){
				 	staffSheet.getRows(staffIndex, function (err, rows){
					  	let columns = {};
					  	var count = 0;
					    for (const key in rows[0]){
					    	columns[count] = key;
					    	count = count + 1;
					    }

					    //just a check
					    if(group === "Staff"){
							let orgStuff = {"Org Name": orgName, "Org Link": orgURL};
							
							setTimeout(function(){
	  							getWsheetAndApply(staffSheet, staffInputsSheet[0], modifyStaffCredentials(orgStuff));
	  							setTimeout(function(){
	  								staffSheet.getInfo(function(err){
		  								urlDictionary[staffURL] = hash(staffSheet);
	  								});
	  							}, 2000);
							}, 0)

					    } 
					});
				}

			});
		});
	});





	//-------------- CreateStep1.js --------------
	socket.on("createStep1_p1", function(data){
		let urlStaff = data.url;

		checkSheetSharing("sheetShared", urlStaff, socket);

	});

	socket.on("createStep1_p2", function(data){
		let sharing = data.sharing;
		let urlStaff = data.url;
		let name = data.name;

		console.log("Sharing: " + sharing);
		console.log("Name: " + name);
		console.log("URL: " + urlStaff);

		let workspaceOK = null;
		let staffOK = null;


		if(checkWorkspaceAvailability(name, socket)){
			socket.emit("workspaceStatus", {ok: true, msg: "The workspace name is available!"});
			workspaceOK = true;
		}else{
			socket.emit("workspaceStatus", {ok: false, msg: "This workspace name cannot be used."});
			workspaceOK = false;
		}

		staffOK = urlConditions("urlStatus", urlStaff, sharing, socket);

		console.log("workspaceOK: " + workspaceOK);
		console.log("staffOK: " + staffOK);
		console.log(workspaceOK && staffOK);

		if(staffOK && workspaceOK){
			unfinishedWorkspaces[name] = [socket.id, [parseURL(urlStaff), "temp student", "temp partner"]];
			socket.emit("approved", {msg: "Workspace and URL both valid!"})


			console.log("the workspace stuff created from step1 is...")
			console.log(unfinishedWorkspaces[name]);
		} else{
			//delete the URL saved from URL Conditions
			//this may be important if someone forgot to share privileges, and needs to resubmit after sharing
			//if the unfinishedURLs wasn't deleted, then it's taken in memory, and no one can access it anymore
			//problem because delete for unfinishedURL would never have been called
			delete unfinishedURLs[parseURL(staffURL)];
			//unfinishedWorkspaces has nothing in it yet
		}



	});


	//-------------- CreateStep2.js --------------


	socket.on("createStep2_p1", function(data){
		let urlPartner = data.urlPartner;
		let urlStudent = data.urlStudent;

		checkSheetSharing("partnerShared", urlPartner, socket);
		checkSheetSharing("studentShared", urlStudent, socket);

	});

	socket.on("createStep2_p2", function(data){
		let partnerSharing = data.partnerSharing;
		let urlPartner = data.urlPartner;
		let studentSharing = data.studentSharing;
		let urlStudent = data.urlStudent;
		let name = activeUsers[socket.id];

		console.log("urlPartner: " + urlPartner);
		console.log("urlStudent: " + urlStudent);
		console.log("Name: " + name);

		let partnerOK = urlConditions("partnerStatus", urlPartner, partnerSharing, socket);
		let studentOK = urlConditions("studentStatus", urlStudent, studentSharing, socket);

		if(urlPartner === urlStudent){
			socket.emit("duplicate", {msg: "The URLs you've entered are identical. They must be unique."})
		}


		if(partnerOK && studentOK && (parseURL(urlPartner) !== parseURL(urlStudent))
			&& (parseURL(urlPartner) !== "fakeURL" && parseURL(urlStudent) !== "fakeURL") ){
			let prevs = unfinishedWorkspaces[name];
			let socketID = prevs[0];
			let urls = prevs[1];

			//update urls values
			urls[1] = parseURL(urlStudent);
			urls[2] = parseURL(urlPartner);

			unfinishedWorkspaces[name] = [socketID, urls];
			socket.emit("approved", {msg: "Both URLs are valid!"})

			console.log("the workspace stuff created from step2 is...")
			console.log(unfinishedWorkspaces[name]);
		}
		else{
			delete unfinishedURLs[parseURL(urlPartner)];
			delete unfinishedURLs[parseURL(urlStudent)];
		}
	});

	//-------------- CreateStep3.js --------------
	socket.on("createStep3_p1", function(data){
	    let email = data.email;
	    let password = data.password;
	    let password2 = data.password2;

	    let emailOK = null;
	    let passwordOK = null;

	    //server-sided checks
	    //check if valid email
	    if(true){
	    	emailOK = true;
	    }
	    else{
	      console.log("Invalid email address.")
	      emailOK = false;
	    }


    	if(password===password2){
    		//HOWE
        	//check if passwords contain no special characters
	        if(true){
	        	socket.emit("createStep3_p1", {email: email, password: password, password2: password2});
	        	passwordOK = true;
	        }
	        else{
	        	console.log("Password contains invalid characters.")
	        	passwordOK = false;
	        }
	    }
	    else{
    		console.log("Your passwords didn't match!");
    		passwordOK = false;
	    }

	    if(emailOK && passwordOK){
	    	socket.emit("confirmation", {msg: "Email and passwords are good! You're ready to go!"});
	    	//function stuff to transfer the data in the unfinished dictionaries
	    	//into the actual dictionaries workspaceDictionary, urlDictionary
		

			let name = activeUsers[socket.id];
			let urls = unfinishedWorkspaces[name][1];

			let staffURL = urls[0];
			let studentURL = urls[1];
			let partnerURL = urls[2];
			//should create the persistence layers Staff Inputs in staffURL

			console.log("Entering setupStaffSheet...");


			let staffData = {"Workspace Name": name, "Staff Email": email, "Staff Password": password,
								"Student Sheet URL": studentURL, "Partner Sheet URL": partnerURL,
								"Org Name": "Applica", "Org Link": "#"};
			
			//Delete any existing sheets with important names...
			deleteSheetsForInitialization(staffURL);
			deleteSheetsForInitialization(studentURL);
			deleteSheetsForInitialization(partnerURL);

			//make sure this block runs together
			setTimeout(function(){
				//HOWE
				//when these sheets are setup, their url must be recorded, as I do below.
				//urlDictionary[urls] below should be removed after
				setupStaffSheet(staffURL, staffData, false);
				setupStudentSheet(studentURL, {}, false);
				setupPartnerSheet(partnerURL, {}, false);

				setTimeout(function(){
					//timeouts set to 0 here because they're already wrapped into a timeout
					updateURLHash(staffURL, 0);
					updateURLHash(studentURL, 0);
					updateURLHash(partnerURL, 0);

					workspaceDictionary[name] = staffURL;
					writeWorkspaceData();
				}, 2500);
			}, 1000);


	
			//removes unfinished urls after transferring them to urlDictionary
			delete unfinishedURLs[staffURL];
			delete unfinishedURLs[studentURL];
			delete unfinishedURLs[partnerURL];    	
			//removes unfinished workspace because it should now have been transferred to workspaceDictionary
			delete unfinishedWorkspaces[name];
	    }

	})



//End of socket listeners ----------------------------------------------
});


//Start of socket helper functions ----------------------------------------------

//HOWE: MUST call this whenever a method mutates a googlesheet STAFFINPUTSSHEET
//set timeout=0 if you want .getInfo() immediately
function updateURLHash(url, timeout){
	let gsheet = new GoogleSpreadsheet(url);

	gsheet.useServiceAccountAuth(creds, function (err) {
		setTimeout(function(){
			gsheet.getInfo(function(err){
				// urlDictionary[url] = gsheet.info.updated;
				console.log(gsheet);
				urlDictionary[url] = hash(gsheet);
				writeURLData();
			});
		}, timeout);
	});
};

//IMPORTANT: gsheet parameter must already have called .getInfo() from outside the function call
//function to compareURLTimes of any sheet you are trying to access
//if the times do not match, abort accessing the sheet to prevent the server from crashing
function compareURLHash(url, gsheet){
	console.log("inside compareURLHash");

	if(urlDictionary[url] === hash(gsheet) ){
		console.log("urlDictionary matched");
		return true;
	} else{
		return false;		
	}
}


function checkURL(url){
	let regex = new RegExp("(?<=.com/spreadsheets/d/).*/");
	let test1 = regex.test(url);
	if(test1){
		let match = regex.exec(url)[0];
		if(match.length === 45){
			return true;
		}
	}
	return false;
}


function parseURL(url){
	let regex = new RegExp("(?<=.com/spreadsheets/d/).*/");

	if(checkURL(url)){
		let match = regex.exec(url)[0];
		let matchFinal = match.substring(0, match.length - 1);
		// console.log(matchFinal);
		return matchFinal;
	} else{
		return "fakeURL";
	}
}


//this will store ANY url recently submitted into a temporary memory space, which is cleared on disconnect
function unusedURL(urlUnparsed, sid){
	let url = parseURL(urlUnparsed);
	console.log("inside unusedURL. The URL is: " + url);
	console.log(urlDictionary[url]);
	if(urlDictionary[url]){
		return false;
	} else{
		if(unfinishedURLs[url] === undefined){
			unfinishedURLs[url] = 1; //this is just a filler value
			return true;
		}

		let name = activeUsers[sid];
		let urls;

		//any URL entered on second page cannot equal the staffURL associated with the workspace recently made
		if(unfinishedWorkspaces[name] !== undefined){
			urls = unfinishedWorkspaces[name][1];
			let staffURL = urls[0]

			if(url !== staffURL){
				unfinishedURLs[url] = 1; //this is just a filler value
				return true;
			}//else proceed to return false, because url (which is either student/partner) = staffURL, which is bad
		}
		return false;
	}
}


function urlConditions(event, url, sharing, socket){
	let urlOK = null;

	if (checkURL(url)){
		//checks if any of the URLs were recently used
		if(unusedURL(url, socket.id)){
			//Howe
			//sharing is based on client values which were initially passed on from Server. Theoretically susceptible to attack
			//INSTEAD, it may be better to store these into memory somehow (new or current dictionary?) and load them instead
			//not important right now. will get back to later as an optimization.
			if(sharing === true){
				//Has not officially been stored into memory yet. Sheet sharing privileges must first be verified
				socket.emit(event, {ok: true, msg: "URL looks good!"});
				urlOK = true;
				console.log("URL looks good!");
			} else{
				socket.emit(event, {ok: false, msg: "URL has not been shared privileges."})
				urlOK = false;
				console.log("URL has not been shared privileges.")
			}
		} else{
			socket.emit(event, {ok: false, msg: "URL has already been used."})
			urlOK = false;
			console.log("URL has already been used.")
		}
	} else{
		socket.emit(event, {ok: false, msg: "URL is invalid! Make sure it's a valid link or properly formatted."});
		urlOK = false;
		console.log("URL is invalid! Make sure it's a valid link or properly formatted.");
	}
	return urlOK;
}


//Called for socket emissions in CreateStep1.js
//Checks gsheet for sharing privileges... FURTHERMORE deletes any existing sheets
function checkSheetSharing(event, url, socket){
	let gsheet = new GoogleSpreadsheet(parseURL(url));
	console.log("In checkSheetSharing");
	console.log("URL in checkSheetSharing is: " + url);

	gsheet.useServiceAccountAuth(creds, function (err) {
	  gsheet.getRows(1, function (err, rows){
	  	if(rows !== undefined){
	  		socket.emit(event, {shared: true, url: url});
	  	} else{
	  		socket.emit(event, {shared: false, url: url});
	  	}

	  });
		
	});
}


function deleteSheetsForInitialization(url){	
	let gsheet = new GoogleSpreadsheet(url);

	gsheet.useServiceAccountAuth(creds, function (err) {
		gsheet.getInfo(function (err) {

			for(const ws of gsheet.worksheets){
				if(ws.title === staffInputsSheet[0]){
					ws.del();
				}
				if(ws.title === studentInputsSheet[0]){
					ws.del();
				}
				if(ws.title === partnerInputsSheet[0]){
					ws.del();
				}
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


function persistenceCreated(gSheet, addSheetsList, firstCalled){
	//addSheetsList will be structured as: [wsName, [headers for wsName]];

	let wsName = addSheetsList[0];
	let headersArray = addSheetsList[1];
	console.log(wsName);

	console.log(headersArray);
	for(const ws of gSheet.worksheets){
		// console.log("For loop inside persistenceCreated: " + ws);
		if(ws.title === wsName){
			return true;
		}
	}

	if(firstCalled === false){
		console.log("Added headers to worksheet: " + headersArray);
		gSheet.addWorksheet({title: wsName, headers: headersArray}, function(err){});
	}

	return false;
}

//see if sheets will setup without timeout
//NOTE: accesses and modifies sheet, must record new timestamp in urlDictionary
// setupStaffSheet(staffURL, {email: email, password: password, studentURL: studentURL, partnerURL: partnerURL});
function setupStaffSheet(staffURL, data, firstCalled){
	let staffGsheet = new GoogleSpreadsheet(staffURL);

	// Authenticate with the Google Spreadsheets API.
	staffGsheet.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  staffGsheet.getInfo(function (err) {
	  	console.log("Inside setupStaffSheet");

	  	if (!persistenceCreated(staffGsheet, staffInputsSheet, firstCalled)){
	  		console.log("Staff Inputs is being created");

	  		//more efficient means of ensuring that the server isn't being spammed
	  		setTimeout(function(){
	  			setupStaffSheet(staffURL, data, true);
	  		}, 1000);
	  	} else{
		  	//Adding data to the worksheet!
	  		console.log("Staff Inputs has been created");;
	  		
	  		getWsheetAndApply(staffGsheet, staffInputsSheet[0], applyCredentials(data));
	  	}

	  });
	});
}

//see if sheets will setup without timeout
//NOTE: accesses and modifies sheet, must record new timestamp in urlDictionary
//data not configured in this stage
function setupStudentSheet(studentURL, data, firstCalled){
	let studentGsheet = new GoogleSpreadsheet(studentURL);

	// Authenticate with the Google Spreadsheets API.
	studentGsheet.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  studentGsheet.getInfo(function (err) {
	  	console.log("Inside setupStudentSheet");

	  	if (!persistenceCreated(studentGsheet, studentInputsSheet, firstCalled)){
	  		console.log("Student Inputs is being created");
	  	} else{
	  		console.log("Student Inputs has been created")
	  	}

	  });
	});
}

//see if sheets will setup without timeout
//NOTE: accesses and modifies sheet, must record new timestamp in urlDictionary
//data not configured in this stage
function setupPartnerSheet(partnerURL, data, firstCalled){
	let partnerGsheet = new GoogleSpreadsheet(partnerURL);

	// Authenticate with the Google Spreadsheets API.
	partnerGsheet.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  partnerGsheet.getInfo(function (err) {
	  	console.log("Inside setupStaffSheet");

	  	//hashed identifier for the visualizations... created out of hashing the partner's email with their password + three URLs
	  	if (!persistenceCreated(partnerGsheet, partnerInputsSheet, firstCalled)){
	  		console.log("Partner Inputs is being created");
	  	} else{
	  		console.log("Partner Inputs has been created")
	  	}

	  });
	});
}


//HOWE
function populatePartnerSheet(partnerURL, data){
//if persistenceCreated, AND has headers
}


function modifyStaffSheet(){

}


//function that retrieves the desired wSheet from the gsheet for you to apply a function on.
function getWsheetAndApply(gsheet, wsheetName, funcToApply){
	gsheet.getInfo(function(err){
		/*
			id - the URL/id as returned from google
			title - the title of the document
			updated - last updated timestamp
			author - auth info in an object
			name - author name
			email - author email
			worksheets - an array of SpreadsheetWorksheet objects
		*/
		let worksheets = gsheet.worksheets;

		console.log("above for loop");
		for(const worksheet of worksheets){
			if(worksheet !== null || worksheet !== undefined){
				console.log(worksheet.title);
				//ensures no null errors
				if(worksheet.title === wsheetName){

					console.log(worksheet);

					funcToApply(worksheet);
				}
			}
		}
	});
}


function applyCredentials(data){
	console.log(data);
	let keyVals = data;

	addRowToSheet = (wsheet) =>{
  		//need to check if adding rows will automatically expand the spreadsheet, or if the amount of space needs to be specified first
		wsheet.addRow(keyVals, function(err){});
	}
	return addRowToSheet;
}


function modifyStaffCredentials(data){
	console.log(data);
	let keyVals = data;

	//ws === wsheet
	//Pay attention to the pattern
	modifyCredentials = (ws) =>{
		console.log("Inside modify credentials");
		// let rowCount = ws.rowCount;
		let colCount = ws.colCount;

  		let options = {"min-row": 1, "max-row": 2, "return-empty": true};
  		ws.getCells(options, function(err, cells){

  			console.log(cells);


  			let indexer = 0;
  			let toApply = [];

  			//go through headers
  			for (const placeholder in cells){
  				let cell = cells[indexer];

  				//if the cell.value exists in the keyVals
  				if(cell.row === 1 && keyVals[cell.value]){
	  				console.log("iteration: " + indexer);

  					let saveIndex = [indexer, cell];

  					toApply.push(... [saveIndex]);
  				}
  				indexer = indexer + 1;
  			}

  			console.log("The list of things to apply");
  			console.log(toApply);
  			for(count = 0; count<toApply.length; count++){
  				//IMPORTANT: must add by colCount*rowNumber!
  				let index = toApply[count][0] + colCount*1;
  				let cell = toApply[count][1];

  				cells[index].setValue(keyVals[cell.value], function callback(){
  					console.log("the credential should have been modified by now");
  				});
  			}

  		});
	}

	return modifyCredentials;
}

//IMPORTANT: gsheet parameter must already have called .getInfo() from outside the function call
function getWsheetIndex(gsheet, wsheetName){

		let count = 0;

		for(const wsheet of gsheet.worksheets){
			count = count + 1;
			if(wsheet.title == wsheetName){
				return count;
			}
		}
		return null;
}


function getCells(){

}


//End of socket helper functions ----------------------------------------------
//Beginning of maybe useful legacy code


//for use in the actual staff page
//only accesses gsheet, legacy code
function getColumns(gsheet, wsheet, somefunc){
	let temp = {}

	// Authenticate with the Google Spreadsheets API.
	gsheet.useServiceAccountAuth(creds, function (err) {
		gsheet.getInfo(function(err){

			/*
				id - the URL/id as returned from google
				title - the title of the document
				updated - last updated timestamp
				author - auth info in an object
				name - author name
				email - author email
				worksheets - an array of SpreadsheetWorksheet objects
			*/


		});

	  // Get all of the rows from the spreadsheet.
	  sheet.getRows(1, function (err, rows) {

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
}






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





//------
var partnerColumns = {};

//to be instantiated during server startup
//then whenever 
function getPartnerColumns(){
	console.log("Calling from getPartnerColumns");
	let temp = {}


	//NOTE: not partnerSheet, but we'll just call it that
	let partnerSheet = new GoogleSpreadsheet(staff);
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


	    let index = 5
	    //partnerColumns now has a value
	    console.log("Values for row")
	    console.log(rows[0])
	    console.log("Value for row at index " + index);
		console.log(rows[0][partnerColumns[index]]);
		console.log("Partner Columns List")
		console.log(partnerColumns);


	  });

	  // partnerSheet.getCells(1, {}, function(){
	  // 	console.log(partnerSheet);
	  // });

	  partnerSheet.getInfo(function(err){
	  	let ws = partnerSheet.worksheets[0];
	  	console.log("Worksheet below:");
	  	console.log(ws);

	  	//linear search of cells where the row and column are a match
	  	//or indexing based on a mapping of where you want your cell to be found wrt the actual number of rows and columns in sheet
	  	let options = {"max-row": 1, "return-empty": true};
	  	// let options = {};
	  	ws.getCells(options, function(err, cells){
	  		console.log("Get cells");
	  		//just cells means that you are printing out ALL the cells, cells[1] is the FIRST cell, including the HEADER row!
	  		console.log("cell 0");
	  		console.log(cells[0]);

	  		console.log("cell 1");
	  		console.log(cells[1]);
	  	});


	  })

	  //need to get a worksheet, then access the cells

	  

	  // let x = partnerSheet.getCells(1);
	  // console.log(x);
});

} getPartnerColumns();





//IMPORTANT: gsheet parameter must already have called .getInfo() from outside the function call
function getCellsFromRow(){

}

//belongs in setup partnersheets, should be stored as a dictionary for later use
function getHeaderColumnIndices(gsheet, wsheetName){
	let index = getWsheetIndex(gsheet, wsheetName);
	let ws = gsheet.worksheets[index];

  	let options = {"max-row": 1, "return-empty": true};
	ws.getCells(options, function(err, cells){

		let indexer = 0;
		let headers = {}
		for(const cell in cells){
			if(cell.value!==""){
				headers[cell.value] = indexer;
			}
			indexer = indexer + 1;
		}
		//at the end, should have the index of the headers... this should be an emission
	});
}

function getRowNumberFromKey(rows){

}

function numColumns(rows){
	return Object.keys(rows[0]).length-6;
}




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

} //updatePartnerSheets();



