import {
  colorToRgb,
  getDistance,
  getDistances,
  getRangeValue,
  getStyleFromRgb,
  isPointInside,
} from "../../Utils";
import { Absorber } from "./Options/Classes/Absorber";
import { Vector } from "../../Core";
export class AbsorberInstance {
  constructor(absorbers, container, options, position) {
    var _a, _b, _c;
    this.absorbers = absorbers;
    this.container = container;
    this.initialPosition = position
      ? Vector.create(position.x, position.y)
      : undefined;
    if (options instanceof Absorber) {
      this.options = options;
    } else {
      this.options = new Absorber();
      this.options.load(options);
    }
    this.dragging = false;
    this.name = this.options.name;
    this.opacity = this.options.opacity;
    this.size =
      getRangeValue(this.options.size.value) * container.retina.pixelRatio;
    this.mass =
      this.size * this.options.size.density * container.retina.reduceFactor;
    const limit = this.options.size.limit;
    this.limit = {
      radius:
        limit.radius *
        container.retina.pixelRatio *
        container.retina.reduceFactor,
      mass: limit.mass,
    };
    this.color =
      (_a = colorToRgb(this.options.color)) !== null && _a !== void 0
        ? _a
        : {
            b: 0,
            g: 0,
            r: 0,
          };
    this.position =
      (_c =
        (_b = this.initialPosition) === null || _b === void 0
          ? void 0
          : _b.copy()) !== null && _c !== void 0
        ? _c
        : this.calcPosition();
  }
  attract(particle) {
    const container = this.container;
    const options = this.options;
    if (options.draggable) {
      const mouse = container.interactivity.mouse;
      if (mouse.clicking && mouse.downPosition) {
        const mouseDist = getDistance(this.position, mouse.downPosition);
        if (mouseDist <= this.size) {
          this.dragging = true;
        }
      } else {
        this.dragging = false;
      }
      if (this.dragging && mouse.position) {
        this.position.x = mouse.position.x;
        this.position.y = mouse.position.y;
      }
    }
    const pos = particle.getPosition();
    const { dx, dy, distance } = getDistances(this.position, pos);
    const v = Vector.create(dx, dy);
    v.length =
      (this.mass / Math.pow(distance, 2)) * container.retina.reduceFactor;
    if (distance < this.size + particle.getRadius()) {
      const sizeFactor =
        particle.getRadius() * 0.033 * container.retina.pixelRatio;
      if (
        (this.size > particle.getRadius() &&
          distance < this.size - particle.getRadius()) ||
        (particle.absorberOrbit !== undefined &&
          particle.absorberOrbit.length < 0)
      ) {
        if (options.destroy) {
          particle.destroy();
        } else {
          particle.needsNewPosition = true;
          this.updateParticlePosition(particle, v);
        }
      } else {
        if (options.destroy) {
          particle.size.value -= sizeFactor;
        }
        this.updateParticlePosition(particle, v);
      }
      if (this.limit.radius <= 0 || this.size < this.limit.radius) {
        this.size += sizeFactor;
      }
      if (this.limit.mass <= 0 || this.mass < this.limit.mass) {
        this.mass +=
          sizeFactor *
          this.options.size.density *
          container.retina.reduceFactor;
      }
    } else {
      this.updateParticlePosition(particle, v);
    }
  }
  resize() {
    const initialPosition = this.initialPosition;
    this.position =
      initialPosition &&
      isPointInside(initialPosition, this.container.canvas.size)
        ? initialPosition
        : this.calcPosition();
  }
  draw(context) {
    context.translate(this.position.x, this.position.y);
    context.beginPath();
    context.arc(0, 0, this.size, 0, Math.PI * 2, false);
    context.closePath();
    context.fillStyle = getStyleFromRgb(this.color, this.opacity);
    context.fill();
  }
  calcPosition() {
    var _a, _b;
    const container = this.container;
    const percentPosition = this.options.position;
    return Vector.create(
      (((_a =
        percentPosition === null || percentPosition === void 0
          ? void 0
          : percentPosition.x) !== null && _a !== void 0
        ? _a
        : Math.random() * 100) /
        100) *
        container.canvas.size.width,
      (((_b =
        percentPosition === null || percentPosition === void 0
          ? void 0
          : percentPosition.y) !== null && _b !== void 0
        ? _b
        : Math.random() * 100) /
        100) *
        container.canvas.size.height
    );
  }
  updateParticlePosition(particle, v) {
    var _a;
    if (particle.destroyed) {
      return;
    }
    const container = this.container;
    const canvasSize = container.canvas.size;
    if (particle.needsNewPosition) {
      particle.position.x = Math.floor(Math.random() * canvasSize.width);
      particle.position.y = Math.floor(Math.random() * canvasSize.height);
      particle.velocity.setTo(particle.initialVelocity);
      particle.absorberOrbit = undefined;
      particle.needsNewPosition = false;
    }
    if (this.options.orbits) {
      if (particle.absorberOrbit === undefined) {
        particle.absorberOrbit = Vector.create(0, 0);
        particle.absorberOrbit.length = getDistance(
          particle.getPosition(),
          this.position
        );
        particle.absorberOrbit.angle = Math.random() * Math.PI * 2;
      }
      if (particle.absorberOrbit.length <= this.size && !this.options.destroy) {
        const minSize = Math.min(canvasSize.width, canvasSize.height);
        particle.absorberOrbit.length =
          minSize * (1 + (Math.random() * 0.2 - 0.1));
      }
      if (particle.absorberOrbitDirection === undefined) {
        particle.absorberOrbitDirection =
          particle.velocity.x >= 0 ? "clockwise" : "counter-clockwise";
      }
      const orbitRadius = particle.absorberOrbit.length;
      const orbitAngle = particle.absorberOrbit.angle;
      const orbitDirection = particle.absorberOrbitDirection;
      particle.velocity.x = 0;
      particle.velocity.y = 0;
      const updateFunc = {
        x: orbitDirection === "clockwise" ? Math.cos : Math.sin,
        y: orbitDirection === "clockwise" ? Math.sin : Math.cos,
      };
      particle.position.x =
        this.position.x + orbitRadius * updateFunc.x(orbitAngle);
      particle.position.y =
        this.position.y + orbitRadius * updateFunc.y(orbitAngle);
      particle.absorberOrbit.length -= v.length;
      particle.absorberOrbit.angle +=
        ((((_a = particle.retina.moveSpeed) !== null && _a !== void 0
          ? _a
          : 0) *
          container.retina.pixelRatio) /
          100) *
        container.retina.reduceFactor;
    } else {
      const addV = Vector.origin;
      addV.length = v.length;
      addV.angle = v.angle;
      particle.velocity.addTo(addV);
    }
  }
}
