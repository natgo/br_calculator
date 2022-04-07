"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const ocr_space_api_wrapper_1 = require("ocr-space-api-wrapper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompt = require("prompt-sync")();
async function getBR() {
    try {
        const response = await axios_1.default.get("http://localhost:8111/indicators");
        console.log(response);
        return response;
    }
    catch (error) {
        let input = "";
        while (input.search(/\d{1,2}\.0|\d{1,2}\.3|\d{1,2}\.7/g)) {
            input = prompt("Input BR: ");
        }
        const output = parseFloat(input);
        return output;
    }
}
const brb = getBR();
async function main() {
    const file = (0, fs_1.readFileSync)("./wk2022-03-30.csv", "utf-8");
    //var csv is the CSV file with headers
    function csvJSON(csv) {
        const lines = csv.split("\n");
        const result = [];
        const headers = lines[0].split(",");
        for (let i = 1; i < lines.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj = {
                name: "",
                rb_br: 0,
                cls: ""
            };
            const currentline = lines[i].split(",");
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }
        //return result; //JavaScript object
        return result; //JSON
    }
    const arr = csvJSON(file);
    const ress = arr.filter(air);
    function air(vehicle) {
        return vehicle.cls === "Aviation";
    }
    const sel = ress.filter(filterhighbr);
    async function filterhighbr(vehicle) {
        return vehicle.rb_br <= await brb;
    }
    try {
        console.log("querying");
        const res1 = await (0, ocr_space_api_wrapper_1.ocrSpace)("ss.png", { OCREngine: 2 });
        console.log(res1);
        const aray = res1.ParsedResults[0].ParsedText.split("\n");
        console.log(aray);
        let inter = [];
        const result = [];
        aray.forEach((ele) => {
            let element = ele.replace(/\s/g, "_");
            if (element == "Spitfire_Mk_la") {
                element = "Spitfire_Mk_Ia";
            }
            if (element[0] == "*") {
                element = element.substring(1, element.length) + "_(USSR)";
            }
            if (element == "Ki-44-1") {
                element = "Ki-44-I";
            }
            if (element == "LBf_109_E-7") {
                element = "Bf_109_E-7_(Japan)";
            }
            if (element[element.length - 1] == ".") {
                console.log(element);
                element = element.substring(0, element.length - 2);
                for (let index = 0; index < sel.length; index++) {
                    const ement = sel[index];
                    if (ement.name.search(element) === 0) {
                        if (ement.name[ement.name.length - 1] === ")") {
                            console.log("keikattu");
                        }
                        else {
                            const object = {
                                name: ement.name,
                                br: ement.rb_br,
                            };
                            inter.push(object);
                        }
                    }
                }
                inter.sort(function (a, b) {
                    const y = a.br;
                    const x = b.br;
                    return y - x;
                });
                console.log(inter);
                result.push(inter[0]);
                inter = [];
            }
            else {
                for (let index = 0; index < sel.length; index++) {
                    const elemen = sel[index];
                    if (elemen.name == element) {
                        const object = {
                            name: elemen.name,
                            br: elemen.rb_br,
                        };
                        result.push(object);
                    }
                }
            }
        });
        result.sort(function (a, b) {
            const y = a.br;
            const x = b.br;
            return x - y;
        });
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}
main();
