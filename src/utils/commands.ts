/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import Konva from 'konva';
import { store } from '@/store';
import { getTransform } from '.';

export interface ICommand {
  execute(): void;
  undo(): void;
  release(): void;
}

export class DrawCommand implements ICommand {
  layer: Konva.Layer;

  line: Konva.Line;

  constructor(layer: Konva.Layer, line: Konva.Line) {
    this.layer = layer;
    this.line = line;
  }

  public execute() {
    this.layer.add(this.line);
  }

  public undo() {
    this.line.remove();
  }

  public release() {}

  public toString() {
    return `Draw: layer=${this.layer.id()}, line=${this.line.id()}`;
  }
}

export class EraseCommand implements ICommand {
  layer: Konva.Layer;

  line: Konva.Line;

  constructor(layer: Konva.Layer, line: Konva.Line) {
    this.layer = layer;
    this.line = line;
  }

  public execute() {
    this.layer.add(this.line);
  }

  public undo() {
    this.line.remove();
  }

  public release() {}

  public toString() {
    return `Erase: layer=${this.layer.id()}, line=${this.line.id()}`;
  }
}

export class TransformCommand implements ICommand {
  shape: Konva.Shape;

  from: Transform;

  to: Transform;

  constructor(shape: Konva.Shape, from: Transform, to: Transform) {
    this.shape = shape;
    this.from = from;
    this.to = to;
  }

  public execute() {
    this.setTransform(this.to);
  }

  public undo() {
    this.setTransform(this.from);
  }

  public setTransform(trs: Transform) {
    this.shape.setAttrs(trs);
  }

  public release() {}

  public toString() {
    const fromTrans = this.from;
    const toTrans = this.to;
    return `Transform: shape=${this.shape.id()} from=(${fromTrans.x}, ${
      fromTrans.y
    }) to=(${toTrans.x}, ${toTrans.y})`;
  }
}

export class ClearCommand implements ICommand {
  layer: Konva.Layer;

  nodes: Konva.Node[];

  constructor(layer: Konva.Layer) {
    this.layer = layer;
    this.nodes = [];
  }

  /**
   * Hide lines and images from the layer and track what was hidden for undo recovery.
   */
  public execute() {
    const lines = this.layer.find('Line');
    this.nodes = [...lines];

    this.nodes.forEach((node) => node.hide());
  }

  /**
   * Add everything that was previously hidden back onto the layer
   */
  public undo() {
    this.nodes.forEach((node) => node.show());
  }

  /**
   * Destroy everything that was hidden
   */
  public release() {
    // TODO: If we undo() and then release() we end up incorrectly wiping the nodes.
  }

  public toString() {
    return `Clear: layer=${this.layer.id()}`;
  }
}
