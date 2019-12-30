import React, { Component } from 'react';


class Document extends React.Component {
	constructor(props){
		super(props);
		console.log("In Document");
		console.log(this.props.data);

		 // this.getHeader = this.getHeader.bind(this);
		 // this.getRowsData = this.getRowsData.bind(this);
		 // this.getKeys = this.getKeys.bind(this);

	}

	getKeys = function(){
		 return Object.keys(this.props.data[0]);
		
	 }
	 
	getHeader = function(){
		 var keys = this.getKeys();
		 return keys.map((key, index)=>{
		 return <th key={key}>{key.toUpperCase()}</th>
		 })
		
	 }
	 
	getRowsData = function(){
		 var items = this.props.data;
		 var keys = this.getKeys();
		 // return items.map((row, index)=>{
		 // return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
		 // })
		
	 }


  createDocument = (arg) =>{
  	if(arg != null){
	  	let navbar = [];

	  	console.log("in createDocument");

	  	console.log(this.props.data);
	 //  	for(const x of this.props.data[0]){
		// 	console.log(x);
		// }
	  	// 	console.log(x);
	  	// 	// navbar.push(

			 //  //         <li className="nav-item" key = {name}>
			 //  //           <a className="nav-link" onClick = {func}>{name}</a>
			 //  //         </li>
	  	// 	// 	);
	  	// }

	  	return navbar;
  }

  }

	 
	render() {
		return (
			 <div>
			 	<h1> FILLER HERE </h1>
			 	{this.createDocument(this.props.data)}
			 </div> 
		 );
	 }
}



export default Document;



