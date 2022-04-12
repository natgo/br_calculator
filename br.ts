export default function br(vehicle:string) {
  if (vehicle === "he-177a-5") {
    return 6.0;
  }
  if (vehicle === "z_1007_bis_serie3") {
    return 2.7;
  }
  if (vehicle === "z_1007_bis_serie5") {
    return 3.0;
  }
  if (vehicle === "b-17e") {
    return 4.7;
  }
  if (vehicle === "leo_451_early") {
    return 3.0;
  }
  if (vehicle === "mb_175t") {
    return 3.3;
  }
  return 4.7;
}