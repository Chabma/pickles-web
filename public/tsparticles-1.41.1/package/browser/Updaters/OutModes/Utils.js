import { getRangeValue } from "../../Utils";
export function bounceHorizontal(data) {
  if (
    !(
      (
        data.outMode === "bounce" /* bounce */ ||
        data.outMode === "bounce-horizontal" /* bounceHorizontal */ ||
        data.outMode === "bounceHorizontal" ||
        data.outMode === "split"
      ) /* split */
    )
  ) {
    return;
  }
  const velocity = data.particle.velocity.x;
  let bounced = false;
  if (
    (data.direction === "right" /* right */ &&
      data.bounds.right >= data.canvasSize.width &&
      velocity > 0) ||
    (data.direction === "left" /* left */ &&
      data.bounds.left <= 0 &&
      velocity < 0)
  ) {
    const newVelocity = getRangeValue(
      data.particle.options.bounce.horizontal.value
    );
    data.particle.velocity.x *= -newVelocity;
    bounced = true;
  }
  if (!bounced) {
    return;
  }
  const minPos = data.offset.x + data.size;
  if (data.bounds.right >= data.canvasSize.width) {
    data.particle.position.x = data.canvasSize.width - minPos;
  } else if (data.bounds.left <= 0) {
    data.particle.position.x = minPos;
  }
  if (data.outMode === "split" /* split */) {
    data.particle.destroy();
  }
}
export function bounceVertical(data) {
  if (
    data.outMode === "bounce" /* bounce */ ||
    data.outMode === "bounce-vertical" /* bounceVertical */ ||
    data.outMode === "bounceVertical" ||
    data.outMode === "split" /* split */
  ) {
    const velocity = data.particle.velocity.y;
    let bounced = false;
    if (
      (data.direction === "bottom" /* bottom */ &&
        data.bounds.bottom >= data.canvasSize.height &&
        velocity > 0) ||
      (data.direction === "top" /* top */ &&
        data.bounds.top <= 0 &&
        velocity < 0)
    ) {
      const newVelocity = getRangeValue(
        data.particle.options.bounce.vertical.value
      );
      data.particle.velocity.y *= -newVelocity;
      bounced = true;
    }
    if (!bounced) {
      return;
    }
    const minPos = data.offset.y + data.size;
    if (data.bounds.bottom >= data.canvasSize.height) {
      data.particle.position.y = data.canvasSize.height - minPos;
    } else if (data.bounds.top <= 0) {
      data.particle.position.y = minPos;
    }
    if (data.outMode === "split" /* split */) {
      data.particle.destroy();
    }
  }
}
