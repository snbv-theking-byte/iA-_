import type { RadarNode, HoveredNodeInfo } from "./radar.types";
import { eventBus } from "../../systems/eventBus";

export class RadarEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodes: RadarNode[];
  private animFrameId: number = 0;
  private angle: number = 0;
  private selectedNodeId: string | null = null;
  private hoveredNode: RadarNode | null = null;
  private onHoverChange: (info: HoveredNodeInfo | null) => void;
  private onSelectNode: (node: RadarNode) => void;
  private isPaused: boolean = false;
  private sweepSpeed: number = 0.015;

  constructor(
    canvas: HTMLCanvasElement,
    nodes: RadarNode[],
    onHoverChange: (info: HoveredNodeInfo | null) => void,
    onSelectNode: (node: RadarNode) => void
  ) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not acquire 2D context");
    this.ctx = context;
    this.nodes = nodes;
    this.onHoverChange = onHoverChange;
    this.onSelectNode = onSelectNode;

    this.initEvents();
  }

  public start() {
    this.resize();
    window.addEventListener("resize", this.handleResize);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.loop();
  }

  public stop() {
    cancelAnimationFrame(this.animFrameId);
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("click", this.handleClick);
  }

  public setSelectedNodeId(id: string | null) {
    this.selectedNodeId = id;
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
  }

  public setSweepSpeed(speed: number) {
    this.sweepSpeed = speed;
  }

  private handleResize = () => {
    this.resize();
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.isPaused = true;
    } else {
      this.isPaused = false;
    }
  };

  private resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private initEvents() {
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("click", this.handleClick);
    this.canvas.addEventListener("mouseleave", () => this.onHoverChange(null));
  }

  private handleMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    let found: RadarNode | null = null;

    for (const node of this.nodes) {
      const nx = node.x * width;
      const ny = node.y * height;
      const dist = Math.hypot(mx - nx, my - ny);

      if (dist <= 14) {
        found = node;
        break;
      }
    }

    this.hoveredNode = found;

    if (found) {
      this.onHoverChange({
        node: found,
        screenX: rect.left + found.x * width,
        screenY: rect.top + found.y * height
      });
      eventBus.emit("radar:node:hovered", found);
    } else {
      this.onHoverChange(null);
      if (this.hoveredNode !== null) {
        eventBus.emit("radar:node:hovered", null);
      }
    }
  };

  private handleClick = () => {
    if (this.hoveredNode) {
      this.selectedNodeId = this.hoveredNode.id;
      this.onSelectNode(this.hoveredNode);
      eventBus.emit("radar:node:selected", this.hoveredNode);
    }
  };

  private loop = () => {
    if (!this.isPaused) {
      const prevAngle = this.angle;
      this.angle = (this.angle + this.sweepSpeed) % (Math.PI * 2);
      if (this.angle < prevAngle) {
        eventBus.emit("radar:pulse:executed", { timestamp: Date.now(), origin: "SWEEP_LEADER" });
      }
    }
    this.render();
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private render() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(width, height) * 0.42;

    this.ctx.clearRect(0, 0, width, height);

    this.drawBackgroundRings(cx, cy, maxRadius);
    this.drawBearingTicks(cx, cy, maxRadius);
    this.drawLinks(cx, cy, width, height);
    this.drawSweep(cx, cy, maxRadius);
    this.drawNodes(width, height);
  }

  private drawBackgroundRings(cx: number, cy: number, maxRadius: number) {
    const ctx = this.ctx;
    ctx.strokeStyle = "rgba(223, 177, 91, 0.18)";
    ctx.lineWidth = 1;

    // Concentric range rings
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (maxRadius / 4) * r, 0, Math.PI * 2);
      ctx.stroke();

      // Range indicators in KM
      ctx.fillStyle = "rgba(223, 177, 91, 0.4)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(`${r * 25} KM`, cx + 4, cy - (maxRadius / 4) * r + 11);
    }

    // Crosshairs
    ctx.strokeStyle = "rgba(223, 177, 91, 0.22)";
    ctx.beginPath();
    ctx.moveTo(cx - maxRadius - 10, cy);
    ctx.lineTo(cx + maxRadius + 10, cy);
    ctx.moveTo(cx, cy - maxRadius - 10);
    ctx.lineTo(cx, cy + maxRadius + 10);
    ctx.stroke();
  }

  private drawBearingTicks(cx: number, cy: number, maxRadius: number) {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(223, 177, 91, 0.6)";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const bearings = [
      { label: "000° N", a: -Math.PI / 2 },
      { label: "090° E", a: 0 },
      { label: "180° S", a: Math.PI / 2 },
      { label: "270° W", a: Math.PI },
      { label: "045° NE", a: -Math.PI / 4 },
      { label: "135° SE", a: Math.PI / 4 },
      { label: "225° SW", a: (3 * Math.PI) / 4 },
      { label: "315° NW", a: -(3 * Math.PI) / 4 }
    ];

    bearings.forEach(({ label, a }) => {
      const tx = cx + Math.cos(a) * (maxRadius + 18);
      const ty = cy + Math.sin(a) * (maxRadius + 18);
      ctx.fillText(label, tx, ty);
    });
  }

  private drawLinks(cx: number, cy: number, width: number, height: number) {
    const ctx = this.ctx;
    this.nodes.forEach((node) => {
      const nx = node.x * width;
      const ny = node.y * height;

      ctx.strokeStyle = "rgba(223, 177, 91, 0.12)";
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  private drawSweep(cx: number, cy: number, maxRadius: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.angle);

    // Sweeping sector gradient
    const sectorAngle = 0.65;
    
    let gradient: CanvasGradient;
    if (typeof ctx.createConicGradient === 'function') {
      gradient = ctx.createConicGradient(-sectorAngle, 0, 0);
      gradient.addColorStop(0, "rgba(223, 177, 91, 0.38)");
      gradient.addColorStop(0.1, "rgba(223, 177, 91, 0.12)");
      gradient.addColorStop(0.25, "rgba(223, 177, 91, 0.0)");
    } else {
      gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
      gradient.addColorStop(0, "rgba(223, 177, 91, 0.3)");
      gradient.addColorStop(1, "rgba(223, 177, 91, 0.0)");
    }

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, maxRadius, -sectorAngle, 0);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();

    // Leading sweep edge line
    ctx.strokeStyle = "#ffd978";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#ffd978";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(maxRadius, 0);
    ctx.stroke();

    ctx.restore();
  }

  private drawNodes(width: number, height: number) {
    const ctx = this.ctx;
    const now = Date.now();

    this.nodes.forEach((node) => {
      const nx = node.x * width;
      const ny = node.y * height;
      const isSelected = this.selectedNodeId === node.id;
      const isHovered = this.hoveredNode?.id === node.id;

      // Pulse ring for active/warning nodes
      const pulseSize = 6 + (Math.sin(now / 300 + (node.id.length * 0.5)) + 1) * 4;

      ctx.save();
      ctx.strokeStyle = isSelected ? "#00f0ff" : node.color;
      ctx.lineWidth = isSelected ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(nx, ny, pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      // Node core
      ctx.fillStyle = isSelected ? "#00f0ff" : node.color;
      ctx.shadowColor = isSelected ? "#00f0ff" : node.color;
      ctx.shadowBlur = isSelected ? 12 : 6;
      ctx.beginPath();
      ctx.arc(nx, ny, isHovered ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Label with high-contrast backing
      ctx.shadowBlur = 0;
      ctx.fillStyle = isSelected ? "#00f0ff" : "rgba(240, 246, 252, 0.9)";
      ctx.font = `${isHovered ? "bold " : ""}10px 'JetBrains Mono', monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(node.name, nx + 12, ny - 2);

      ctx.restore();
    });
  }
}
