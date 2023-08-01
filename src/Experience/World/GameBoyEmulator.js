import * as THREE from "three";
import Experience from "../Experience.js";
import EventEmitter from "../Utils/EventEmitter.js";
import Gameboy from "../../PollenBoy/main.js";

export default class GameBoyEmulator extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.init();
  }

  init() {
    // https://github.com/nectarboy/gameboy/blob/main/index.html
    const nanaCanvas = document.createElement("canvas"),
      ctx = nanaCanvas.getContext("2d"); //document.getElementById("nanacanvas");
    nanaCanvas.width = 160;
    nanaCanvas.height = 144;

    const nanawrap = document.getElementById("nanawrap");
    const nanaStat = document.getElementById("nanastat");
    const nanaFin = document.getElementById("nanafin");
    const nanaPause = document.getElementById("nanapause");
    const nanaReset = document.getElementById("nanareset");

    nanawrap.appendChild(nanaCanvas);
    const nanaExportSave = document.getElementById("nanaexportsave");
    const nanaImportSave = document.getElementById("nanaimportsave");
    const nanaPallete = document.getElementById("nanapallete");
    const nanaCustomPallete = document.getElementById("nanacustompallete");
    const nanaVolume = document.getElementById("nanavolume");
    const nanaPitchShift = document.getElementById("nanapitchshift");
    const gb = new Gameboy();
    const palletes = {
      // I made these but mfs dont like em ... (rightfully so)
      mono: ["ffffff", "bbbbbb", "666666", "000000"],
      grey: ["A5A5A5", "7F7F7F", "4C4C4C", "333333"],
      leafy: ["54bc31", "225a13", "122817", "0c2514"],
      crimson: ["E04545", "B71745", "771100", "3D0E24"],
      "wocky slush": ["75BC64", "639E64", "42603F", "21382A"],
      pastel: ["FFA8DC", "FF60AA", "CC53AB", "A0468E"],

      // Other ppl's palletes !
      juice: ["dec69c", "a55aff", "942994", "003973"], // w.atwiki.jp/yychr
      choco: ["ffe4c2", "dca456", "a9604c", "422936"], // lospec.com/palette-list/gb-chocolate
      kirby: ["f7bef7", "e78686", "7733e7", "2c2c96"], // lospec.com/palette-list/kirby-sgb
      sheep: ["f9fbf3", "e4c179", "bc7967", "292039"], // lospec.com/palette-list/sheepsheep
      yoshi: ["e2f3e4", "94e344", "46878f", "332c50"], // lospec.com/palette-list/kirokaze-gameboy
      mist: ["c4f0c2", "5ab9a8", "1e606e", "2d1b00"], // lospec.com/palette-list/mist-gb
      starbug: ["8be5ff", "608fcf", "7550e8", "622e4c"], // lospec.com/palette-list/wish-gb
      moonlight: ["5fc75d", "36868f", "203671", "0f052d"], // lospec.com/palette-list/moonlight-gb
      manga: ["ffffff", "4aedff", "ff8acd", "b03e80"], // lospec.com/palette-list/mangavania
      cream: ["fff6d3", "f9a875", "eb6b6f", "7c3f58"], // lospec.com/palette-list/ice-cream-gb

      // My sister made these :3
      "mono piink": ["FFFFFF", "FFD1E6", "CD9BBB", "603651"],
      "strawberry kisses": ["FFF1C9", "FFC4E9", "FF6B90", "A3427B"],
      "cotton candy": ["FFC4E9", "B2E5FF", "A35984", "2779A5"],
      "eeeye candyyy": ["FFD191", "9ACC99", "FF7270", "2779A5"],
      "candy cane": ["FFFFFF", "40DB1A", "FF4C4C", "D81717"],
    };
    // Default pallete
    const defaultPallete = "leafy";
    gb.AttachCanvas(nanaCanvas);

    function SetButtonImg(button, img) {
      button.style.backgroundImage = "url(" + img.src + ")";
    }

    // Gameboy

    function Start() {
      gb.Start();
      SetButtonImg(nanaPause, images.pause);
    }

    // Palletes

    // Fill in the pallete list in DOM
    {
      var keys = Object.keys(palletes);
      for (var i = 0; i < keys.length; i++) {
        var name = keys[i];

        var option = document.createElement("option");
        // Option properties
        option.value = name;
        option.innerHTML = name;

        nanaPallete.appendChild(option);

        // Default selection
        if (name !== defaultPallete) continue;
        nanaPallete.childNodes[i + 1].selected = true;
      }

      nanaPallete.onchange = function () {
        gb.SetPallete(palletes[nanaPallete.value]);
        this.blur(); // It aint annoying now uwu
      };
    }

    // Custom pallete
    nanacustompallete.onclick = function () {
      gb.SetPallete([
        prompt("Input color 0 (white) example: 'ff0069':"),
        prompt("Input color 1 (lite grey):"),
        prompt("Input color 2 (dark grey):"),
        prompt("Input color 3 (black):"),
      ]);
    };

    // Default settings
    gb.SetFPS(60); // 120 is performant but 60 is smoother
    gb.bootromEnabled = false;
    gb.SetPallete(palletes[defaultPallete]);

    const defaultVolume = 0.05;
    gb.SetVolume(defaultVolume);
    gb.EnableSound();

    gb.DisableAlphaBlend();
    gb.SetAlphaBlend(0.7);

    gb.keyboardEnabled = true;

    // Images
    const images = {};
    images.play = new Image();
    //images.play.src = "img/button_play.png";

    images.pause = new Image();
    //images.pause.src = "img/button_pause.png";

    images.reset = new Image();
    //images.reset.src = "img/button_reset.png";

    // Status text
    var statTimeout = null;

    const statFadeMs = 1300;
    const longStatFadeMs = 1800;

    function SetStatMsg(msg, fade = statFadeMs) {
      nanaStat.innerHTML = msg;

      clearTimeout(statTimeout);
      statTimeout = setTimeout(ClearStatMsg, fade);
    }

    function ClearStatMsg() {
      nanaStat.innerHTML = "";
    }

    // Sound sliders
    nanaVolume.value = defaultVolume;
    nanaVolume.oninput = function () {
      this.blur();
      if (this.value == 0) gb.DisableSound();
      else if (!gb.soundenabled) gb.EnableSound();

      gb.SetVolume(parseFloat(this.value));
    };

    nanaPitchShift.oninput = function () {
      this.blur();
      gb.SetPitchShift(parseFloat(this.value));
    };

    // Pause / play button
    SetButtonImg(nanaPause, images.pause); // Default

    nanaPause.onclick = function () {
      if (!gb.cpu.hasRom) return;

      try {
        var paused = gb.TogglePause();

        if (paused) {
          SetButtonImg(this, images.play);
          SetStatMsg("paused !");
        } else {
          SetButtonImg(this, images.pause);
          SetStatMsg("");
        }
      } catch (e) {
        SetStatMsg(e, longStatFadeMs);
      }
    };

    // Reset button
    SetButtonImg(nanaReset, images.reset);

    nanaReset.onclick = function () {
      if (!confirm("are you sure you wanna reset ?")) return;

      if (gb.cpu.crashed) {
        SetButtonImg(nanaPause, images.play);
      }

      gb.Reset();

      SetStatMsg("reset !");

      // This helps with crashes
    };

    // Save importing
    function ReadSaveFile(file) {
      var fr = new FileReader();

      fr.onload = function () {
        var data = new Uint8Array(fr.result);

        try {
          gb.InsertSram(data); // This may throw an error
          Start();

          SetStatMsg("save loaded :)");
        } catch (e) {
          SetStatMsg(e, longStatFadeMs);
        }
      };

      fr.readAsArrayBuffer(file);
    }

    nanaImportSave.onchange = function (e) {
      var file = e.target.files[0];
      if (!file) return;

      ReadSaveFile(file);
    };

    // Save exporting
    nanaExportSave.onclick = function () {
      try {
        var data = gb.GetSramArray();

        // Save to user drive
        var blob = new Blob([new Uint8Array(data)], {
          type: "application/octet-stream",
        });
        saveAs(blob, lastreadFilename + ".sav");
      } catch (e) {
        SetStatMsg(e, longStatFadeMs);
      }
    };

    // Rom file input
    var lastreadFilename = "rom";

    function ReadRomFile(file) {
      var fr = new FileReader();

      fr.onload = function () {
        var rom = new Uint8Array(fr.result);
        console.log("Read file!");
        //try {
        gb.InsertRom(rom); // This may throw an error
        Start();
        console.log("Started!");

        //}
        //catch (e) {
        //	SetStatMsg (e, longStatFadeMs);
        //}
      };

      fr.readAsArrayBuffer(file);
    }

    nanaFin.onchange = (e) => {
      var file = e.target.files[0];
      console.log("uploaded!");
      if (!file) return;

      lastreadFilename = file.name.split(".")[0]; // Remove file extension
      
      this.trigger('cartLoad');

      setTimeout(() => {
        ReadRomFile(file);
      }, 5000);
    };

    const texture = new THREE.CanvasTexture(nanaCanvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    //-------- ----------
    // GEOMETRY, MATERIAL, MESH
    //-------- ----------
    const geo = new THREE.PlaneGeometry(1.85, 1.68);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.mesh = new THREE.Mesh(geo, material);
    this.scene.add(this.mesh);
  }

  update() {
    if (this.mesh && this.mesh.material)
      this.mesh.material.map.needsUpdate = true;
  }
}
