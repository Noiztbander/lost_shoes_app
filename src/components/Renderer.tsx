"use client";

import { useEffect, useRef } from "react";
import {
  AbstractMesh,
  ArcRotateCamera,
  AssetContainer,
  Color4,
  CubeTexture,
  Engine,
  Mesh,
  Scene,
  SceneLoader,
  Vector3,
  Color3,
  ShadowGenerator,
  ParticleHelper,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF/index.js";

import { loadCameraPipeline, loadLensEffects } from "./camera.utils";
import { loadLightEnvironment } from "./lights";
import { loadGround } from "./ground";
import { nightAmbience } from "./sounds";

import "./renderer.css";

const ASSET_URL = "/cleats.gltf.64814f6ab733bd79d41e.gltf";

const meshVisiblities: Record<string, boolean> = {
  cutLowCtrl: false,
  cutMidCtrl: true,
  soleMetalCtrl: true,
  soleMoldedCtrl: false,
  soleTurfCtrl: false,
  outsoleMetalSilver: false,
  outsoleMetalSilverChrome: true,
  soleMetalGround: true,
  soleMoldedGround: false,
  soleTurfGround: false,
  heelRunbird: false,
  heelCustom: false,
  heelText: false,
};

const getParentMeshes = (mesh: AbstractMesh): Mesh[] => {
  const parentMeshes: Mesh[] = [];

  let currentMesh = mesh;
  while (true) {
    const parentMesh = currentMesh.parent as Mesh | undefined;
    if (!parentMesh) {
      break;
    }

    currentMesh = parentMesh;
    parentMeshes.push(parentMesh);
  }

  return parentMeshes;
};

const getAllMeshes = (assetContainer: AssetContainer): AbstractMesh[] => {
  const allMeshes: Record<string, AbstractMesh> = {};

  for (const mesh of assetContainer.meshes) {
    allMeshes[mesh.id] = mesh;

    for (const parentMesh of getParentMeshes(mesh)) {
      allMeshes[parentMesh.id] = parentMesh;
    }
  }

  return Object.values(allMeshes);
};

const loadAsset = (scene: Scene, url: string): Promise<AssetContainer> =>
  new Promise<AssetContainer>((resolve, reject) => {
    SceneLoader.LoadAssetContainer(
      url,
      undefined,
      scene,
      (assetContainer) => {
        resolve(assetContainer);
      },
      undefined,
      (_scene, message) => {
        reject(message);
      }
    );
  });

const loadEnvironment = (
  scene: Scene,
  environmentTexture: string
): Promise<CubeTexture> =>
  new Promise<CubeTexture>((resolve) => {
    const hdrTexture = CubeTexture.CreateFromPrefilteredData(
      environmentTexture,
      scene
    );

    hdrTexture.onLoadObservable.add(() => {
      scene.environmentTexture = hdrTexture;

      resolve(hdrTexture);
    });
  });

const cleanMeshes = (containers: AssetContainer[]) => {
  for (const container of containers) {
    const allMeshes = getAllMeshes(container);

    for (const mesh of allMeshes) {
      const isEnabled = meshVisiblities[mesh.id] ?? true;
      mesh.setEnabled(isEnabled);
    }
  }
};

const useRenderer = (canvasRef: { current: HTMLCanvasElement | null }) => {
  useEffect(() => {
    const effect = async () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const engine = new Engine(canvas);

      const scene = new Scene(engine);

      scene.clearColor = new Color4(0, 0, 0, 1);

      engine.runRenderLoop(() => {
        scene.render();
      });

      const camera = new ArcRotateCamera(
        "myCamera",
        2,
        1,
        60,
        Vector3.Zero(),
        scene
      );

      camera.lowerBetaLimit = 0.1;
      camera.upperBetaLimit = (Math.PI / 2) * 0.9;
      camera.lowerRadiusLimit = 30;
      camera.upperRadiusLimit = 50;
      camera.useAutoRotationBehavior = true;

      loadCameraPipeline(scene, camera);
      loadLensEffects(scene, camera);
      nightAmbience(scene);
      loadGround(scene);
      const { light } = loadLightEnvironment({ scene, camera, engine });

      // Fog
      scene.fogMode = Scene.FOGMODE_EXP;
      scene.fogColor = new Color3(0, 0, 0);
      scene.fogDensity = 0.006;

      // Rain
      ParticleHelper.CreateAsync("rain", scene, false).then((set) => {
        set.start();
        set.systems[0].emitRate = 1;
        set.systems[0].minEmitPower = 100;
        set.systems[0].maxSize = 10;
        set.systems[0].minScaleY = 1;
      });

      camera.attachControl();

      const leftShoeContainer = await loadAsset(scene, ASSET_URL);
      const rightShoeContainer = await loadAsset(scene, ASSET_URL);

      const leftShoeMesh = leftShoeContainer.meshes[0];
      const rightShoeMesh = rightShoeContainer.meshes[0];

      leftShoeMesh.position = new Vector3(0, -0.8, -10);
      rightShoeMesh.position = new Vector3(0, -1.5, 10);
      rightShoeMesh.scaling = new Vector3(-1, 1, -1);
      rightShoeMesh.rotation = new Vector3(0, 0.1, 0);

      // Shadows
      const shadowGenerator = new ShadowGenerator(1024, light);
      shadowGenerator.addShadowCaster(leftShoeMesh);
      shadowGenerator.addShadowCaster(rightShoeMesh);
      shadowGenerator.useExponentialShadowMap = true;

      cleanMeshes([leftShoeContainer, rightShoeContainer]);

      leftShoeContainer.addAllToScene();
      rightShoeContainer.addAllToScene();
    };

    effect();
  }, [canvasRef]);
};

const Renderer = () => {
  const canvasRef = useRef(null);

  useRenderer(canvasRef);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Renderer;
