const express = require("express");
const { auth } = require("../middlewares/auth");
const { requestSend, acceptConnection, requestRemove, getAllRequests } = require("../controllers/Connections");
const Router = express.Router();

Router.post("/request-sent/:userId", auth, requestSend);
Router.post("/accept-request/:userId", auth, acceptConnection);
Router.post("/remove-request/:userId",auth,requestRemove);
Router.get("/get-all-request",auth,getAllRequests)

module.exports = Router;