import axios from "axios";
import { readFileSync } from "fs";
import { ocrSpace } from "ocr-space-api-wrapper";
import lookup from "./lookup";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompt = require("prompt-sync")();

async function getBR(ress: { name: string; rb_br: number; cls: string }[]) {
  try {
    const response = await axios.get("http://localhost:8111/indicators");
    console.log(response.data.type);
    if (response.data.type === "he-177a-5") {
      return 6.0;
    }
    if (response.data.type === "z_1007_bis_serie3") {
      return 2.7;
    }
    if (response.data.type === "z_1007_bis_serie5") {
      return 3.0;
    }
    if (response.data.type === "b-17e") {
      return 4.7;
    }
    if (response.data.type === "leo_451_early") {
      return 3.0;
    }
    if (response.data.type === "mb_175t") {
      return 3.3;
    }
    return 4.7;
  } catch (error) {
    let input = "";
    while (input.search(/\d{1,2}\.0|\d{1,2}\.3|\d{1,2}\.7/g)) {
      input = prompt("Input BR: ");
    }
    const output = parseFloat(input);
    return output;
  }
}

async function main(): Promise<void> {
  const file = readFileSync("./wk2022-03-30.csv", "utf-8");

  function csvJSON(csv: string) {
    const lines = csv.split("\n");

    const result: { name: string; rb_br: number; cls: string }[] = [];

    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = {
        name: "",
        rb_br: 0,
        cls: "",
      };
      const currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }
    return result;
  }
  const arr = csvJSON(file);

  const ress = arr.filter(air);

  function air(vehicle: { cls: string }): boolean {
    return vehicle.cls === "Aviation";
  }
  const brb: number = await getBR(ress);
  const sel = ress.filter(filterhighbr);
  function filterhighbr(vehicle: { rb_br: number }) {
    return vehicle.rb_br <= brb + 1;
  }
  try {
    const res1 = await ocrSpace("ss.png", { OCREngine: 2 });
    const aray = res1.ParsedResults[0].ParsedText.split("\n");
    console.log(aray);
    let inter: { name: string; br: number }[] = [];
    const result: { name: string; br: number }[] = [];
    aray.forEach((ele: string) => {
      let element = ele.replace(/\s/g, "_");
      element = lookup(element);
      if (
        element[element.length - 2] == "." &&
        element[element.length - 1] == "."
      ) {
        console.log(element);
        element = element.substring(0, element.length - 2);
        for (let index = 0; index < sel.length; index++) {
          const ement = sel[index];
          if (ement.name.search(element) === 0) {
            if (ement.name[ement.name.length - 1] === ")") {
              // empty
            } else {
              const object = {
                name: ement.name,
                br: ement.rb_br,
              };
              inter.push(object);
            }
          }
        }
        inter.sort((a, b) => a.br - b.br);
        console.log(inter);
        result.push(inter[0]);
        inter = [];
      } else {
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
    result.sort((a, b) => b.br - a.br);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
main();
