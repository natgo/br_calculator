"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var ocr_space_api_wrapper_1 = require("ocr-space-api-wrapper");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        //var csv is the CSV file with headers
        function csvJSON(csv) {
            var lines = csv.split("\n");
            var result = [];
            var headers = lines[0].split(",");
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var currentline = lines[i].split(",");
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }
                result.push(obj);
            }
            //return result; //JavaScript object
            return result; //JSON
        }
        function air(vehicle) {
            return vehicle.cls === "Aviation";
        }
        function filterhighbr(vehicle) {
            return vehicle.rb_br <= 3.3;
        }
        function filterlowbr(vehicle) {
            return vehicle.rb_br >= 2.3;
        }
        var file, contents, arr, res, sel, set, res1, aray, result_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = (0, fs_1.readFileSync)("./wk2022-03-30.csv", "utf-8");
                    try {
                        contents = file;
                    }
                    catch (err) {
                        console.log("There has been an error parsing your JSON.");
                        console.log(err);
                    }
                    arr = csvJSON(contents);
                    res = arr.filter(air);
                    sel = res.filter(filterhighbr);
                    set = sel.filter(filterlowbr);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log("querying");
                    return [4 /*yield*/, (0, ocr_space_api_wrapper_1.ocrSpace)("ss.png", { OCREngine: 2 })];
                case 2:
                    res1 = _a.sent();
                    console.log(res1);
                    aray = res1.ParsedResults[0].ParsedText.split("\n");
                    console.log(aray);
                    result_1 = [];
                    aray.forEach(function (ele) {
                        var element = ele.replace(/\s/g, "_");
                        if (element == "Spitfire_Mk_la") {
                            element = "Spitfire_Mk_Ia";
                        }
                        if (element == "*P-63A-5") {
                            element = "P-63A-5_(USSR)";
                        }
                        if (element == "Ki-44-1") {
                            element = "Ki-44-I";
                        }
                        if (element == "LBf_109_E-7") {
                            element = "Bf_109_E-7_(Japan)";
                        }
                        if (element[element.length - 1] == ".") {
                            console.log(element);
                        }
                        else {
                            for (var index = 0; index < set.length; index++) {
                                var elemen = set[index];
                                if (elemen.name == element) {
                                    var object = {
                                        name: elemen.name,
                                        br: elemen.rb_br
                                    };
                                    result_1.push(object);
                                }
                            }
                        }
                    });
                    result_1.sort(function (a, b) {
                        var y = a.br;
                        var x = b.br;
                        return x - y;
                    });
                    console.log(result_1);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
