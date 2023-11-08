import express from "express";
import { addClient } from "../controllers/addClient";
import { addDog } from "../controllers/addDog";
import { addNote } from "../controllers/addNote";
import { getClients } from "../controllers/getClients";
import { getClient } from "../controllers/getClient";
import { getDog } from "../controllers/getDog";
import { getNotes } from "../controllers/getNotes";
import { editNote } from "../controllers/editNote";
import { getDogTags } from "../controllers/getDogTags";
import { addTrainerTag } from "../controllers/addTrainerTag";
import { removeTag } from "../controllers/removeTag";
import { getTrainerTags } from "../controllers/getTrainerTags";
import { deleteTrainerTag } from "../controllers/deleteTrainerTag";
import { addDogTag } from "../controllers/addDogTag";
import { deleteDogTag } from "../controllers/deleteDogTag";

export const router = express.Router();

router.post("/clients/add", addClient);
router.post("/dogs/add", addDog);
router.get("/dog/:dogId", getDog);
router.get("/dog/:dogId/notes", getNotes);
router.get("/dog/:dogId/tags", getDogTags);
router.delete("/dog/:dogId/tags", deleteDogTag);
router.post("/dog/:dogId/tags/", addDogTag);
router.get("/:trainerId/tags", getTrainerTags);
router.post("/:trainerId/tags", addTrainerTag);
router.delete("/:trainerId/tags", deleteTrainerTag);

router.post("/notes/add", addNote);
router.patch("/notes/edit", editNote);
router.get("/clients/:trainerId", getClients);
router.get("/client/:clientId", getClient);
