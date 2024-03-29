"use strict";
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    return (
      kind === "a"
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var _Plugins_engine;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugins = void 0;
class Plugins {
  constructor(engine) {
    _Plugins_engine.set(this, void 0);
    __classPrivateFieldSet(this, _Plugins_engine, engine, "f");
    this.plugins = [];
    this.interactorsInitializers = new Map();
    this.updatersInitializers = new Map();
    this.interactors = new Map();
    this.updaters = new Map();
    this.presets = new Map();
    this.drawers = new Map();
    this.pathGenerators = new Map();
  }
  getPlugin(plugin) {
    return this.plugins.find((t) => t.id === plugin);
  }
  addPlugin(plugin) {
    if (!this.getPlugin(plugin.id)) {
      this.plugins.push(plugin);
    }
  }
  getAvailablePlugins(container) {
    const res = new Map();
    for (const plugin of this.plugins) {
      if (!plugin.needsPlugin(container.actualOptions)) {
        continue;
      }
      res.set(plugin.id, plugin.getPlugin(container));
    }
    return res;
  }
  loadOptions(options, sourceOptions) {
    for (const plugin of this.plugins) {
      plugin.loadOptions(options, sourceOptions);
    }
  }
  getPreset(preset) {
    return this.presets.get(preset);
  }
  addPreset(presetKey, options, override = false) {
    if (override || !this.getPreset(presetKey)) {
      this.presets.set(presetKey, options);
    }
  }
  addShapeDrawer(type, drawer) {
    if (!this.getShapeDrawer(type)) {
      this.drawers.set(type, drawer);
    }
  }
  getShapeDrawer(type) {
    return this.drawers.get(type);
  }
  getSupportedShapes() {
    return this.drawers.keys();
  }
  getPathGenerator(type) {
    return this.pathGenerators.get(type);
  }
  addPathGenerator(type, pathGenerator) {
    if (!this.getPathGenerator(type)) {
      this.pathGenerators.set(type, pathGenerator);
    }
  }
  getInteractors(container, force = false) {
    let res = this.interactors.get(container);
    if (!res || force) {
      res = [...this.interactorsInitializers.values()].map((t) => t(container));
      this.interactors.set(container, res);
    }
    return res;
  }
  addInteractor(name, initInteractor) {
    this.interactorsInitializers.set(name, initInteractor);
  }
  getUpdaters(container, force = false) {
    let res = this.updaters.get(container);
    if (!res || force) {
      res = [...this.updatersInitializers.values()].map((t) => t(container));
      this.updaters.set(container, res);
    }
    return res;
  }
  addParticleUpdater(name, initUpdater) {
    this.updatersInitializers.set(name, initUpdater);
  }
}
exports.Plugins = Plugins;
_Plugins_engine = new WeakMap();
