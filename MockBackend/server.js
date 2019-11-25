const express = require("express");
const app = express();
const session = require("express-session");
const passport = require('passport');//after you session 
const jwt = require('jsonwebtoken');
const mongooseConnect = require('./helper/mongodb')

//Routes includes
const projectsRoutes = require("./routes/project");
const sprintsRoutes = require("./routes/sprint");
const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/task")


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create session for passport
app.use(session({
 secret : "test",
 resave : false,
 saveUninitialized : true
}));

app.use("/auth", authRoutes);
app.use('/projects', passport.authenticate('jwt', {session: false}), require('./routes/project'))
app.use('/projects/:id/sprints/', passport.authenticate('jwt', {session: false}), require('./routes/sprint'))
app.use('/projects/:projectId/sprints/:sprintId/task', passport.authenticate('jwt', {session: false}), require('./routes/task'))

//passport ininitalied after you session is a must
app.use(passport.initialize());
app.use(passport.session());

app.use("/projects", projectsRoutes);
app.use("/projects/:id/sprints/", sprintsRoutes);
app.use("/projects/:projectId/sprints/:sprintId/task", tasksRoutes);

app.get("*", (req, res) => {
  res.status(404).json({message: "Page not found"});
});

app.listen(5000, () => console.log("express running"));
