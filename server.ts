import http from "http";
import { app } from "./app";

const PORT = process.env.port || 5000;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
