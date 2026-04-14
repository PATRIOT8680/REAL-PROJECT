import { rce } from "./rce";

rce.registerServer('createLabel', (text: string, pos: { x, y, z }, font: number, drawDist: number, color: Array4d, dimension: number) => {
  mp.labels.new(
    text, new mp.Vector3(pos.x, pos.y, pos.z),
    {
      los: false,
      font: font,
      drawDistance: drawDist,
      color: color,
      dimension: dimension
    }
  )
})