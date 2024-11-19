import express from "express";
import UserController from '../controllers/usersController.js';
import ClientController from '../controllers/ClientController.js';
import ServiceController from '../controllers/ServiceController.js';
import TypeOfServiceController from '../controllers/TypeOfServiceController.js';
import { checkToken } from "../services/checkTokenService.js";
import { loginUser } from "../services/loginUser.js";
import hourController from "../controllers/HourController.js";

const router = express.Router();

//'http://localhost:3000/users/list/client/name?name=Gabriel'
router
    .get("/users/list/all",checkToken, UserController.listAllUsers)
    .get("/users/city", checkToken, UserController.listUsersByCity)
    // .get("/users/:id", checkToken, UserController.acessPrivateRoute)
    .get("/users/list/:id", checkToken, UserController.listUsersById)

    .get("/users/list/client/all", checkToken, ClientController.listAllClients)
    .get("/users/list/client/phone", checkToken, ClientController.listClientByPhone)
    .get("/users/list/client/name", checkToken, ClientController.listClientByName)
    .get("/users/list/client/:id", checkToken, ClientController.listClientById)

    .get("/services/list/all", checkToken, ServiceController.listAllServices)
    .get("/services/list/name", checkToken, ServiceController.listServiceByName)
    .get("/services/list/:id", checkToken, ServiceController.listServiceById)
    .get("/services/list/status", checkToken, ServiceController.listServiceByStatus)

    .get("/typeOfService/list/all", checkToken, TypeOfServiceController.listAllTypesOfService)
    .get("/typeOfService/list/name", checkToken, TypeOfServiceController.listTypeOfServiceByName)
    .get("/typeOfService/list/:id", checkToken, TypeOfServiceController.listTypeOfServiceById)
    
    .get("/hour/list/all", checkToken, hourController.listAllHours)
    .get("/hour/list/day", checkToken, hourController.listHourByDay)
    .get("/hour/list/:id", checkToken, hourController.listHourById)


    .post("/users/login", loginUser)

    .post("/users/create", checkToken, UserController.registerUser)
    .post("/users/create/client", ClientController.registerClient)
    .post("/services/create", checkToken, ServiceController.registerService)
    .post("/typeOfService/create", checkToken, TypeOfServiceController.registerTypeOfService)
    .post("/hour/create", hourController.registerHour)
    
    .post("/passwordChange", checkToken, UserController.changePassword)

    .put("/users/update/:id", checkToken, UserController.updateUser)
    .put("/services/update/:id", checkToken, ServiceController.updateService)
    .put("/clients/update/:id", checkToken, ClientController.updateClient)
    .put("/typeOfService/update/:id", checkToken, TypeOfServiceController.updateTypeOfService)
    .put("/hour/update/:id", checkToken, hourController.updateHour)


    .delete("/users/delete/:id", checkToken, UserController.deleteUser)
    .delete("/users/delete/client/:id", checkToken, ClientController.deleteClient)
    .delete("/services/delete/:id", checkToken, ServiceController.deleteService)
    .delete("/typeOfService/delete/:id", TypeOfServiceController.deleteTypeOfService)
    .delete("/hour/delete/:id", hourController.deleteHour)


export default router;