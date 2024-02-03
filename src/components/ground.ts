import { Mesh, Scene } from '@babylonjs/core'
import groundBasicMaterial from './materials/groundBasicMaterial'

export const loadGround = (scene: Scene) => {
  const ground = Mesh.CreateGroundFromHeightMap(
    'ground',
    '/materials/forest-ground-flowers/yt1mz9ra_4k_displacement.png',
    200,
    200,
    2000,
    -5,
    5,
    scene,
    false,
  )

  ground.material = groundBasicMaterial({ scene })
  ground.receiveShadows = true

  return { ground }
}
