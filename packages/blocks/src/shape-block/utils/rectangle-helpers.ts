// https://github.com/tldraw/tldraw/blob/24cad6959f59f93e20e556d018c391fd89d4ecca/packages/tldraw/src/state/shapes/RectangleUtil/rectangleHelpers.ts
// Credits to tldraw

import { Utils } from './utils.js';
import { Vec } from './vec.js';
import { getShapeStyle } from './shape-style.js';
import type { ShapeStyles } from '../../__internal__/index.js';

import PF from 'perfect-freehand';
import type { getStroke as getStrokeType } from 'perfect-freehand';
import * as DPF from 'perfect-freehand';
const getStrokePoints = DPF.getStrokePoints;
const getStroke = PF as unknown as typeof getStrokeType;

function getRectangleDrawPoints(
  id: string,
  style: ShapeStyles,
  size: number[]
) {
  const styles = getShapeStyle(style);

  const getRandom = Utils.rng(id);

  const sw = styles.strokeWidth;

  // Dimensions
  const w = Math.max(0, size[0]);
  const h = Math.max(0, size[1]);

  // Random corner offsets
  const offsets = Array.from(Array(4)).map(() => {
    return [getRandom() * sw * 0.75, getRandom() * sw * 0.75];
  });

  // Corners
  const tl = Vec.add([sw / 2, sw / 2], offsets[0]);
  const tr = Vec.add([w - sw / 2, sw / 2], offsets[1]);
  const br = Vec.add([w - sw / 2, h - sw / 2], offsets[2]);
  const bl = Vec.add([sw / 2, h - sw / 2], offsets[3]);

  // Which side to start drawing first
  const rm = Math.round(Math.abs(getRandom() * 2 * 4));

  // Corner radii
  const rx = Math.min(w / 4, sw * 2);
  const ry = Math.min(h / 4, sw * 2);

  // Number of points per side
  const px = Math.max(8, Math.floor(w / 16));
  const py = Math.max(8, Math.floor(h / 16));

  // Inset each line by the corner radii and let the freehand algo
  // interpolate points for the corners.
  const lines = Utils.rotateArray(
    [
      Vec.pointsBetween(Vec.add(tl, [rx, 0]), Vec.sub(tr, [rx, 0]), px),
      Vec.pointsBetween(Vec.add(tr, [0, ry]), Vec.sub(br, [0, ry]), py),
      Vec.pointsBetween(Vec.sub(br, [rx, 0]), Vec.add(bl, [rx, 0]), px),
      Vec.pointsBetween(Vec.sub(bl, [0, ry]), Vec.add(tl, [0, ry]), py),
    ],
    rm
  );

  // For the final points, include the first half of the first line again,
  // so that the line wraps around and avoids ending on a sharp corner.
  // This has a bit of finesse and magic—if you change the points between
  // function, then you'll likely need to change this one too.

  const points = [...lines.flat(), ...lines[0]].slice(
    5,
    Math.floor((rm % 2 === 0 ? px : py) / -2) + 3
  );

  return {
    points,
  };
}

function getDrawStrokeInfo(id: string, style: ShapeStyles, size: number[]) {
  const { points } = getRectangleDrawPoints(id, style, size);
  const { strokeWidth } = getShapeStyle(style);
  const options = {
    size: strokeWidth,
    thinning: 0.65,
    streamline: 0.3,
    smoothing: 1,
    simulatePressure: false,
    last: true,
  };
  return { points, options };
}

export function getRectanglePath(
  id: string,
  style: ShapeStyles,
  size: number[]
) {
  const { points, options } = getDrawStrokeInfo(id, style, size);
  const stroke = getStroke(points, options);
  return Utils.getSvgPathFromStroke(stroke);
}

export function getRectangleIndicatorPathTDSnapshot(
  id: string,
  style: ShapeStyles,
  size: number[]
) {
  const { points, options } = getDrawStrokeInfo(id, style, size);
  return Utils.getSvgPathFromStrokePoints(getStrokePoints(points, options));
}
