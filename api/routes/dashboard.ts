import express from "express";
import { addClient } from "../controllers/addClient";
import { addDog } from "../controllers/addDog";
import { addNote } from "../controllers/addNote";
import { getClients } from "../controllers/getClients";

export const router = express.Router();

router.post("/clients/add", addClient);
router.post("/dogs/add", addDog);
router.post("/notes/add", addNote);
router.get("/clients", getClients);
