"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Fixed import
const routes_1 = __importDefault(require("./controllers/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:5173" })); // Applied directly
const PORT = 3001;
app.use("/api/", routes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on : http://localhost:${PORT}`);
});
