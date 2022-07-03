import { colorToRgb, getDistances, getStyleFromRgb } from "../../Utils";
import { Vector } from "../../Core";
export function drawPolygonMask(context, rawData, stroke) {
  const color = colorToRgb(stroke.color);
  if (!color) {
    return;
  }
  context.beginPath();
  context.moveTo(rawData[0].x, rawData[0].y);
  for (const item of rawData) {
    context.lineTo(item.x, item.y);
  }
  context.closePath();
  context.strokeStyle = getStyleFromRgb(color);
  context.lineWidth = stroke.width;
  context.stroke();
}
export function drawPolygonMaskPath(context, path, stroke, position) {
  context.translate(position.x, position.y);
  const color = colorToRgb(stroke.color);
  if (!color) {
    return;
  }
  context.strokeStyle = getStyleFromRgb(color, stroke.opacity);
  context.lineWidth = stroke.width;
  context.stroke(path);
}
export function parsePaths(paths, scale, offset) {
  var _a;
  const res = [];
  for (const path of paths) {
    const segments = path.element.pathSegList;
    const len =
      (_a =
        segments === null || segments === void 0
          ? void 0
          : segments.numberOfItems) !== null && _a !== void 0
        ? _a
        : 0;
    const p = {
      x: 0,
      y: 0,
    };
    for (let i = 0; i < len; i++) {
      const segment =
        segments === null || segments === void 0 ? void 0 : segments.getItem(i);
      const svgPathSeg = window.SVGPathSeg;
      switch (
        segment === null || segment === void 0 ? void 0 : segment.pathSegType
      ) {
        case svgPathSeg.PATHSEG_MOVETO_ABS:
        case svgPathSeg.PATHSEG_LINETO_ABS:
        case svgPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
        case svgPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
        case svgPathSeg.PATHSEG_ARC_ABS:
        case svgPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
        case svgPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS: {
          const absSeg = segment;
          p.x = absSeg.x;
          p.y = absSeg.y;
          break;
        }
        case svgPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
          p.x = segment.x;
          break;
        case svgPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
          p.y = segment.y;
          break;
        case svgPathSeg.PATHSEG_LINETO_REL:
        case svgPathSeg.PATHSEG_MOVETO_REL:
        case svgPathSeg.PATHSEG_CURVETO_CUBIC_REL:
        case svgPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
        case svgPathSeg.PATHSEG_ARC_REL:
        case svgPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
        case svgPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL: {
          const relSeg = segment;
          p.x += relSeg.x;
          p.y += relSeg.y;
          break;
        }
        case svgPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
          p.x += segment.x;
          break;
        case svgPathSeg.PATHSEG_LINETO_VERTICAL_REL:
          p.y += segment.y;
          break;
        case svgPathSeg.PATHSEG_UNKNOWN:
        case svgPathSeg.PATHSEG_CLOSEPATH:
          continue;
      }
      res.push({
        x: p.x * scale + offset.x,
        y: p.y * scale + offset.y,
      });
    }
  }
  return res;
}
export function calcClosestPtOnSegment(s1, s2, pos) {
  const { dx, dy } = getDistances(pos, s1);
  const { dx: dxx, dy: dyy } = getDistances(s2, s1);
  const t = (dx * dxx + dy * dyy) / (dxx ** 2 + dyy ** 2);
  const res = {
    x: s1.x + dxx * t,
    y: s1.x + dyy * t,
    isOnSegment: t >= 0 && t <= 1,
  };
  if (t < 0) {
    res.x = s1.x;
    res.y = s1.y;
  } else if (t > 1) {
    res.x = s2.x;
    res.y = s2.y;
  }
  return res;
}
export function segmentBounce(start, stop, velocity) {
  const { dx, dy } = getDistances(start, stop);
  const wallAngle = Math.atan2(dy, dx);
  const wallNormal = Vector.create(Math.sin(wallAngle), -Math.cos(wallAngle));
  const d = 2 * (velocity.x * wallNormal.x + velocity.y * wallNormal.y);
  wallNormal.multTo(d);
  velocity.subFrom(wallNormal);
}
