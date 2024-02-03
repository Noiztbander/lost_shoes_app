import {
  PBRMetallicRoughnessMaterial,
  Scene,
  Texture,
} from '@babylonjs/core'

const groundBasicMaterial = ({ scene }: { scene: Scene }) => {
  const pbr = new PBRMetallicRoughnessMaterial('pbrMaterial', scene)
  pbr.baseTexture = new Texture(
    '/materials/forest-ground-flowers/yt1mz9ra_4k_diffuse.png',
    scene,
  )
  pbr.metallicRoughnessTexture = new Texture(
    '/materials/forest-ground-flowers/yt1mz9ra_4k_roughness.png',
    scene,
  )

  pbr.normalTexture = new Texture(
    '/materials/forest-ground-flowers/yt1mz9ra_2k_normal.png',
    scene,
  )
  pbr._ambientTexture = new Texture(
    '/materials/forest-ground-flowers/yt1mz9ra_4k_ao.png',
    scene,
  )

  pbr.emissiveTexture = new Texture(
    '/materials/forest-ground-flowers/yt1mz9ra_4k_gloss.png',
    scene,
  )

  pbr.metallic = 3

  return pbr
}
export default groundBasicMaterial
