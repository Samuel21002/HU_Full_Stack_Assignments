"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_1 = __importDefault(require("../services/services"));
const loginRouter = (0, express_1.Router)();
loginRouter.get("/ping", (_req, res) => {
    console.log("someone pinged here");
    res.send("pong");
});
loginRouter.get("/diagnoses", (_req, res) => {
    res.json(services_1.default.getAllDiagnosis());
});
loginRouter.get("/patients", (_req, res) => {
    res.json(services_1.default.getAllPatients());
});
exports.default = loginRouter;
