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
  let res = arr.filter(air);
  function air(vehicle: { cls: string; }) {
    return vehicle.cls === "Aviation";
  }
  let sel = res.filter(filterhighbr);
  function filterhighbr(vehicle: { rb_br: number; }) {
    return vehicle.rb_br <= 3.3;
  }
  function filterlowbr(vehicle: { rb_br: number; }) {
    return vehicle.rb_br >= 2.3;
  }
  let set = sel.filter(filterlowbr);
  try {
    console.log("querying");
    const res1 = await ocrSpace("ss.png", { OCREngine: 2 });
    console.log(res1);
    let aray = res1.ParsedResults[0].ParsedText.split("\n");
    console.log(aray);
    let result = [];
    aray.forEach((ele: string) => {
      let element = ele.replace(/\s/g,"_");
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
      } else {
        for (let index = 0; index < set.length; index++) {
          const elemen = set[index];
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
