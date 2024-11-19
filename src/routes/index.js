import express from "express";
import router from "./allRoutes.js";


/** Essa função é responsável por configurar as rotas do 
 * aplicativo Express. */
const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({ titulo: "Trabalho Android" })
    })

    app.use(
        express.json(),
        router


    )
}

export default routes