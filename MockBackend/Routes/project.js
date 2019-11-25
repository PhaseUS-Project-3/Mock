const express = require('express');
const router = express.Router();
const Users = require("../models/User");
const getUserId = require("../auth/utils");
//Mock
let {Projects} = require("../Data.js");
//---------------------------------
//  random hex string generator
var randHex = function(len) {
  var maxlen = 8,
      min = Math.pow(16,Math.min(len,maxlen)-1) 
      max = Math.pow(16,Math.min(len,maxlen)) - 1,
      n   = Math.floor( Math.random() * (max-min+1) ) + min,
      r   = n.toString(16);
  while ( r.length < len ) {
     r = r + randHex( len - maxlen );
  }
  return r;
};
//---------------------------------
// fetch all projects
router.get('/', async (req,res) => {
	try{
		res.json({Projects});
	}catch(err){
		res.json({message: err});
	}
});
// fetch specified project
router.get('/:projectId', async (req,res) => {
	try{
		console.log(Projects[0]._id)
		const index = Projects.findIndex(e => e._id === req.params.projectId)
		if(index === -1){
			res.status(404).json({message: "Item not found"});
		}else{
			res.json(Projects[index]);
		}
	}catch(err){
		res.json({message: err});
	}
});
//create a project
router.post('/newproject', async (req, res) => {
	try{
		const userId = "123456789012345678901234" //getUserId(req);
		console.log("before")
		let newProject = {
			_id: randHex(24),
			name: req.body.name,
			owner: userId,
			sprints: req.body.sprints,
			createdAt: "2017",
			updatedAt: "2019"
		};
		Projects.push(newProject);
		await Users.update(
			{ _id: userId },
			{ $push: { projects: newProject._id } }
			);
		res.redirect("/projects")
	}catch(err){
		res.json({message: err});
	}
});

router.put('/:projectId', async (req,res) => {
	try{
		let updateBody = {};
		req.body.newName? updateBody.name = req.body.newName: updateBody;
		req.body.sprints? updateBody.sprints = req.body.sprints: updateBody;
		let index =  Projects.findIndex(e => e._id === req.params.projectId);
		if(index === -1){
			res.status(404).json({message: "Item not found"});
		}else{

			Projects[index].name = updateBody.name;
			Projects[index].sprints = updateBody.sprints;
			const project = Projects[index];
			res.json({message: "Item Updated", project: project});
		}
	}catch(err){
		res.json({message: err});
	}
});

router.delete('/:projectId', async (req,res) => {
	try{
		let index =  Projects.findIndex(e => e._id === req.params.projectId) 
		if(index === -1){
			res.status(404).json({message: "Item not found"});
		}else{
			const project = Projects.splice(index, 1);
			res.json({message: "Item Deleted", project});
		}
	}catch(err){
		res.json({message: err});
	}
});



module.exports = router