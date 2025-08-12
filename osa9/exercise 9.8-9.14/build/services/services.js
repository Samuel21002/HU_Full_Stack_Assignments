"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diagnoses_1 = __importDefault(require("../data/diagnoses"));
const patients_1 = __importDefault(require("../data/patients"));
const getAllDiagnosis = () => {
    return diagnoses_1.default;
};
const getAllPatients = () => {
    return patients_1.default;
};
exports.default = {
    getAllDiagnosis,
    getAllPatients,
};
