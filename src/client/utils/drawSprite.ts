export const drawSprite = (dist: string, name: string, pos: Array2d, scale: Array2d, heading: number, color: Array4d, layer?: number) => {
  const resolution = mp.game.graphics.getScreenActiveResolution(0, 0)
  const textureResolution = mp.game.graphics.getTextureResolution(dist, name)
  const _scale = [
    (scale[0] * textureResolution.x) / resolution.x,
    (scale[1] * textureResolution.y) / resolution.y
  ]

  if (mp.game.graphics.hasStreamedTextureDictLoaded(dist)) {
    if (typeof layer === 'number') mp.game.graphics.set2dLayer(layer)
    mp.game.graphics.drawSprite(dist, name,
      pos[0] - 0.05, pos[1] - 0.05,
      _scale[0], _scale[1],
      heading,
      color[0], color[1], color[2], color[3],
      false
    )
  } else mp.game.graphics.requestStreamedTextureDict(dist, true)
}