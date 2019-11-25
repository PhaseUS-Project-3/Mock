const express = require('express');
const router = express.Router();
let  {Projects, Sprints} = require("../Data");
const Users = require("../models/User");
const getUserId = require("../auth/utils");
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
		res.json({Sprints});
	}catch(err){
		res.json({message: err});
	}
});
// fetch specified project
router.get('/:sprintId', async (req,res) => {
	try{
		const index = Projects.findIndex(e => e._id === req.params.sprintId);
		if(index === -1){
			res.status(404).json({message: "Item not found"});
		}else{
			res.json({sprint});
		}
	}catch(err){
		res.json({message: err});
	}
});
//create a project
router.post('/newsprint', async (req, res) => {

		const projectId = req.originalUrl.match(/[0-9A-Fa-f]{24}/)[0];
		let userId = "123456789012345678901234" //getUserId(req); 
		let newSprint = {
			_id: randHex(24),
			name: req.body.name,
			users: [],
			tasks: [],
			start_date: "2017-03-17 11:59",
			end_date: "2017-03-17 11:59",
			project_id: projectId
		};
		const index = Projects.findIndex(e => e._id === projectId);
		if(index === -1){
			res.status(404).json({message: "Project not found"});
		}
		Projects[index].sprints.push({sprint: newSprint._id, tasks: []});
		Sprints.push(newSprint);
		res.redirect("/projects/"+projectId+"/sprints")

});

router.put('/:sprintId', async (req,res) => {
	try{
		let updateBody = {};

		req.body.newName? updateBody.name = req.body.newName: updateBody;
		//update date
		req.body.newStartDate? updateBody.start_date = req.body.newStartDate: updateBody;
		req.body.newEndDate? updateBody.end_date = req.body.newEndDate: updateBody;
		
		//update user
		req.body.newUsers? updateBody.users = req.body.newUsers: updateBody;

		//update task
		req.body.newTask? updateBody.tasks = req.body.newTask: updateBody;

		const path = req.originalUrl.split('/sprints/')
		const sprintId = path[1]
		const projectId = path[0].match(/[0-9A-Fa-f]{24}/)[0];
		const projectIndex = Projects.findIndex(e => e._id === projectId);
		const sprintIndex = Sprints.findIndex(e => e._id === sprintId);

		if(projectIndex === -1 || sprintIndex === -1){
			res.status(404).json({message: "Project/sprint not found"});
		}else {
			for(key of Object.keys(updateBody)){
				Sprints[sprintIndex][key] = updateBody[key];
			}
			const sprint = Sprints[sprintIndex]
			res.json({message: "Item Updated", sprint});
		}

	}catch(err){
		res.json({message: err});
	}
});

router.delete('/:sprintId', async (req,res) => {
	try{
		const path = req.originalUrl.split('/sprints/')
		const sprintId = path[1]
		const projectId = path[0].match(/[0-9A-Fa-f]{24}/)[0];

		const index = Sprints.findIndex(e => e._id === req.params.sprintId);
		if(index === -1){
			res.status(404).json({message: "Item not found"});
		}
		else {
			const sprint = Sprints[index]
			Sprints.splice(index, 1);
			res.json({message: "Item Deleted", sprint});
		}
	}catch(err){
		res.json({message: err});
	}
});

module.exports = router