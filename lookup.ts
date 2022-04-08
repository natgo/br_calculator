export default function lookup(element: string): string {
  if (element == "Spitfire_Mk_la") {
    element = "Spitfire_Mk_Ia";
  }
  if (element[0] == "*") {
    element = element.substring(1, element.length) + "_(USSR)";
  }
  if (element == "Ki-44-1") {
    element = "Ki-44-I";
  }
  if (element == "Ki-44-11") {
    element = "Ki-44-II";
  }
  if (element == "Ki-61-11 Kai") {
    element = "Ki-61-II Kai";
  }
  if (element == "LBf_109_E-7") {
    element = "Bf_109_E-7_(Japan)";
  }
  if (element == "OSpitfire_Mk_V.") {
    element = "Spitfire_Mk_Vb/trop_(Italy)";
  }
  if (element == "Bf_110_G7") {
    element = "Bf_110_C-7";
  }
  if (element == "B-25)-20") {
    element = "B-25J-20";
  }
  if (element == "SE_F4U-1A'") {
    element = "F4U-1A_(Japan)";
  }
  return element;
}
