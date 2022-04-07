import axios from "axios";
import { readFileSync } from "fs";
import { ocrSpace } from "ocr-space-api-wrapper";

async function main() {
  var file = readFileSync("./wk2022-03-30.csv", "utf-8"),
    contents: string;
  try {
    contents = file;
  } catch (err) {
    console.log("There has been an error parsing your JSON.");
    console.log(err);
  }
  //var csv is the CSV file with headers
  function csvJSON(csv: string) {
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
  let arr = csvJSON(contents);
  let ress = arr.filter(air);
  function air(vehicle: { cls: string; }) {
    return vehicle.cls === "Aviation";
  }
  let sel = ress.filter(filterhighbr);
  function filterhighbr(vehicle: { rb_br: number; }) {
    //axios
    //.get('http://localhost:8111/indicators')
    //.then(res => {
    //  console.log(`statusCode: ${res.status}`)
    //  console.log(res)
    //})
    //.catch(error => {
    //  console.error(error)
    //})
    //console.log(res);
    
    return vehicle.rb_br <= 3.7;
  }
  try {
    console.log("querying");
    const res1 = await ocrSpace("ss.png", { OCREngine: 2 });
    console.log(res1);
    let aray = res1.ParsedResults[0].ParsedText.split("\n");
    console.log(aray);
    let inter = [];
    let result = [];
    aray.forEach((ele: string) => {
      let element = ele.replace(/\s/g,"_");
      if (element == "Spitfire_Mk_la") {
        element = "Spitfire_Mk_Ia";
      }
      if (element[0] == "*") {
        element = element.substring(1,element.length) + "_(USSR)";
      }
      if (element == "Ki-44-1") {
        element = "Ki-44-I";
      }
      if (element == "LBf_109_E-7") {
        element = "Bf_109_E-7_(Japan)";
      }
      if (element[element.length - 1] == ".") {
        console.log(element);
        element = element.substring(0,element.length-2);
        for (let index = 0; index < sel.length; index++) {
          const ement = sel[index];
          if (ement.name.search(element) === 0) {
            if (ement.name[ement.name.length-1] === ")") {
              console.log("keikattu");
            } else {
              let object = {
                name: ement.name,
                br: ement.rb_br,
              };
              inter.push(object);
            }
          }
        }
        inter.sort(function (a, b) {
          let y = a.br;
          let x = b.br;
          return y - x;
        });
        console.log(inter);
        result.push(inter[0]);
        inter = [];
      } else {
        for (let index = 0; index < sel.length; index++) {
          const elemen = sel[index];
          if (elemen.name == element) {
            let object = {
              name: elemen.name,
              br: elemen.rb_br,
            };
            result.push(object);
          }
        }
      }
    });
    result.sort(function (a, b) {
      let y = a.br;
      let x = b.br;
      return x - y;
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
main();
