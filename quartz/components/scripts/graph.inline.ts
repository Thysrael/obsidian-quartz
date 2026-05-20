import type { ContentDetails } from "../../plugins/emitters/contentIndex"
import {
  SimulationNodeDatum,
  SimulationLinkDatum,
  Simulation,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  forceRadial,
  zoomIdentity,
  select,
  drag,
  zoom,
} from "d3"
import { Text, Graphics, Application, Container, Circle } from "pixi.js"
import { Group as TweenGroup, Tween as Tweened } from "@tweenjs/tween.js"
import { registerEscapeHandler, removeAllChildren } from "./util"
import { FullSlug, SimpleSlug, getFullSlug, resolveRelative, simplifySlug } from "../../util/path"
import { D3Config } from "../Graph"

type GraphicsInfo = {
  color: string
  gfx: Graphics
  alpha: number
  active: boolean
}

type NodeData = {
  id: SimpleSlug
  text: string
  tags: string[]
} & SimulationNodeDatum

type SimpleLinkData = {
  source: SimpleSlug
  target: SimpleSlug
}

type LinkData = {
  source: NodeData
  target: NodeData
} & SimulationLinkDatum<NodeData>

type LinkRenderData = GraphicsInfo & {
  simulationData: LinkData
}

type NodeRenderData = GraphicsInfo & {
  simulationData: NodeData
  label: Text
  labelBackground: Graphics
}

const localStorageKey = "graph-visited"
function getVisited(): Set<SimpleSlug> {
  return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"))
}

function addToVisited(slug: SimpleSlug) {
  const visited = getVisited()
  visited.add(slug)
  localStorage.setItem(localStorageKey, JSON.stringify([...visited]))
}

type TweenNode = {
  update: (time: number) => void
  stop: () => void
}

async function renderGraph(graph: HTMLElement, fullSlug: FullSlug) {
  const slug = simplifySlug(fullSlug)
  const visited = getVisited()
  removeAllChildren(graph)

  let {
    drag: enableDrag,
    zoom: enableZoom,
    depth,
    scale,
    repelForce,
    centerForce,
    linkDistance,
    fontSize,
    removeTags,
    showTags,
    focusOnHover,
    enableRadial,
  } = JSON.parse(graph.dataset["cfg"]!) as D3Config
  const configuredDepth = depth

  const data: Map<SimpleSlug, ContentDetails> = new Map(
    Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
      simplifySlug(k as FullSlug),
      v,
    ]),
  )
  const links: SimpleLinkData[] = []
  const tags: SimpleSlug[] = []
  const validLinks = new Set(data.keys())

  const tweens = new Map<string, TweenNode>()
  for (const [source, details] of data.entries()) {
    const outgoing = details.links ?? []

    for (const dest of outgoing) {
      if (validLinks.has(dest)) {
        links.push({ source: source, target: dest })
      }
    }

    if (showTags) {
      const localTags = details.tags
        .filter((tag) => !removeTags.includes(tag))
        .map((tag) => simplifySlug(("tags/" + tag) as FullSlug))

      tags.push(...localTags.filter((tag) => !tags.includes(tag)))

      for (const tag of localTags) {
        links.push({ source: source, target: tag })
      }
    }
  }

  const neighbourhood = new Set<SimpleSlug>()
  const wl: (SimpleSlug | "__SENTINEL")[] = [slug, "__SENTINEL"]
  if (depth >= 0) {
    while (depth >= 0 && wl.length > 0) {
      // compute neighbours
      const cur = wl.shift()!
      if (cur === "__SENTINEL") {
        depth--
        wl.push("__SENTINEL")
      } else {
        neighbourhood.add(cur)
        const outgoing = links.filter((l) => l.source === cur)
        const incoming = links.filter((l) => l.target === cur)
        wl.push(...outgoing.map((l) => l.target), ...incoming.map((l) => l.source))
      }
    }
  } else {
    validLinks.forEach((id) => neighbourhood.add(id))
    if (showTags) tags.forEach((tag) => neighbourhood.add(tag))
  }

  const nodes = [...neighbourhood].map((url) => {
    const text = url.startsWith("tags/") ? "#" + url.substring(5) : (data.get(url)?.title ?? url)
    return {
      id: url,
      text,
      tags: data.get(url)?.tags ?? [],
    }
  })
  const graphData: { nodes: NodeData[]; links: LinkData[] } = {
    nodes,
    links: links
      .filter((l) => neighbourhood.has(l.source) && neighbourhood.has(l.target))
      .map((l) => ({
        source: nodes.find((n) => n.id === l.source)!,
        target: nodes.find((n) => n.id === l.target)!,
      })),
  }

  const nodeLinkCounts = new Map<SimpleSlug, number>()
  for (const link of graphData.links) {
    nodeLinkCounts.set(link.source.id, (nodeLinkCounts.get(link.source.id) ?? 0) + 1)
    nodeLinkCounts.set(link.target.id, (nodeLinkCounts.get(link.target.id) ?? 0) + 1)
  }
  const maxNodeLinkCount = Math.max(...nodeLinkCounts.values(), 1)
  let currentTransform = zoomIdentity

  const width = graph.offsetWidth
  const height = Math.max(graph.offsetHeight, 250)

  // we virtualize the simulation and use pixi to actually render it
  const simulation: Simulation<NodeData, LinkData> = forceSimulation<NodeData>(graphData.nodes)
    .force("charge", forceManyBody().strength(-100 * repelForce))
    .force("center", forceCenter().strength(centerForce))
    .force("link", forceLink(graphData.links).distance(linkDistance))
    .force("collide", forceCollide<NodeData>((n) => nodeRadius(n)).iterations(3))

  const radius = (Math.min(width, height) / 2) * 0.8
  if (enableRadial) simulation.force("radial", forceRadial(radius).strength(0.2))

  // precompute style prop strings as pixi doesn't support css variables
  const cssVars = [
    "--secondary",
    "--tertiary",
    "--gray",
    "--light",
    "--lightgray",
    "--dark",
    "--darkgray",
    "--bodyFont",
  ] as const
  const computedStyleMap = cssVars.reduce(
    (acc, key) => {
      acc[key] = getComputedStyle(document.documentElement).getPropertyValue(key)
      return acc
    },
    {} as Record<(typeof cssVars)[number], string>,
  )

  // calculate color
  const color = (d: NodeData) => {
    const isCurrent = d.id === slug
    if (isCurrent) {
      return computedStyleMap["--secondary"]
    }

    const linkRatio = (nodeLinkCounts.get(d.id) ?? 0) / maxNodeLinkCount
    if (linkRatio >= 0.65) return "#8f5f5f"
    if (linkRatio >= 0.45) return "#8a728f"
    if (linkRatio >= 0.28) return "#647f96"
    if (linkRatio >= 0.14) return "#789070"
    if (visited.has(d.id) || d.id.startsWith("tags/")) return computedStyleMap["--tertiary"]
    return "#7a7f87"
  }

  function nodeRadius(d: NodeData) {
    const numLinks = nodeLinkCounts.get(d.id) ?? 0
    return (d.id === slug ? 4.5 : 2.6) + Math.sqrt(numLinks) * 1.35
  }

  function nodeVisibleAtScale(d: NodeData, zoomScale: number) {
    if (configuredDepth >= 0) return true
    if (d.id === slug) return true

    const linkRatio = (nodeLinkCounts.get(d.id) ?? 0) / maxNodeLinkCount
    const clampedScale = Math.min(Math.max(zoomScale, 0.45), 3)
    const zoomProgress = (clampedScale - 0.45) / 2.55
    const minVisibleRatio = 0.28 * (1 - zoomProgress)
    return linkRatio >= minVisibleRatio
  }

  function updateVisibilityForScale(zoomScale: number) {
    const visibleNodes = new Set<SimpleSlug>()

    for (const node of nodeRenderData) {
      const visible = nodeVisibleAtScale(node.simulationData, zoomScale)
      node.gfx.visible = visible
      node.label.visible = visible
      node.labelBackground.visible = visible
      if (visible) visibleNodes.add(node.simulationData.id)
    }

    for (const link of linkRenderData) {
      link.gfx.visible =
        visibleNodes.has(link.simulationData.source.id) &&
        visibleNodes.has(link.simulationData.target.id)
    }
  }

  function updateLabelCollisions() {
    const shownRects: { left: number; right: number; top: number; bottom: number }[] = []
    const labelsByPriority = [...nodeRenderData]
      .filter((node) => node.label.visible)
      .sort((a, b) => {
        if (a.simulationData.id === slug) return -1
        if (b.simulationData.id === slug) return 1
        if (a.active !== b.active) return a.active ? -1 : 1
        return (
          (nodeLinkCounts.get(b.simulationData.id) ?? 0) -
          (nodeLinkCounts.get(a.simulationData.id) ?? 0)
        )
      })

    for (const node of labelsByPriority) {
      const label = node.label
      const screenX = label.position.x * currentTransform.k + currentTransform.x
      const screenY = label.position.y * currentTransform.k + currentTransform.y
      const labelWidth = label.width * currentTransform.k
      const labelHeight = label.height * currentTransform.k
      const rect = {
        left: screenX - labelWidth / 2 - 4,
        right: screenX + labelWidth / 2 + 4,
        top: screenY - labelHeight * 1.2 - 3,
        bottom: screenY + 3,
      }
      const overlaps = shownRects.some(
        (shown) =>
          rect.left < shown.right &&
          rect.right > shown.left &&
          rect.top < shown.bottom &&
          rect.bottom > shown.top,
      )

      label.alpha = overlaps ? 0 : 1
      node.labelBackground.alpha = label.alpha
      if (!overlaps) shownRects.push(rect)
    }
  }

  function updateLabelBackgrounds() {
    const paddingX = 6 / currentTransform.k
    const paddingY = 3 / currentTransform.k
    const radius = 5 / currentTransform.k

    for (const node of nodeRenderData) {
      const label = node.label
      const bg = node.labelBackground
      const bgWidth = label.width + paddingX * 2
      const bgHeight = label.height + paddingY * 2
      bg.position.set(label.position.x, label.position.y)
      bg.clear()
      bg.roundRect(-bgWidth / 2, -bgHeight * 1.12, bgWidth, bgHeight, radius)
        .fill({ color: computedStyleMap["--light"], alpha: 0.78 })
        .stroke({
          color: node.color,
          alpha: 0.22,
          width: 1 / currentTransform.k,
        })
    }
  }

  let hoveredNodeId: string | null = null
  let hoveredNeighbours: Set<string> = new Set()
  const linkRenderData: LinkRenderData[] = []
  const nodeRenderData: NodeRenderData[] = []
  function updateHoverInfo(newHoveredId: string | null) {
    hoveredNodeId = newHoveredId

    if (newHoveredId === null) {
      hoveredNeighbours = new Set()
      for (const n of nodeRenderData) {
        n.active = false
      }

      for (const l of linkRenderData) {
        l.active = false
      }
    } else {
      hoveredNeighbours = new Set()
      for (const l of linkRenderData) {
        const linkData = l.simulationData
        if (linkData.source.id === newHoveredId || linkData.target.id === newHoveredId) {
          hoveredNeighbours.add(linkData.source.id)
          hoveredNeighbours.add(linkData.target.id)
        }

        l.active = linkData.source.id === newHoveredId || linkData.target.id === newHoveredId
      }

      for (const n of nodeRenderData) {
        n.active = hoveredNeighbours.has(n.simulationData.id)
      }
    }
  }

  let dragStartTime = 0
  let dragging = false

  function renderLinks() {
    tweens.get("link")?.stop()
    const tweenGroup = new TweenGroup()

    for (const l of linkRenderData) {
      let alpha = 1

      // if we are hovering over a node, we want to highlight the immediate neighbours
      // with full alpha and the rest with default alpha
      if (hoveredNodeId) {
        alpha = l.active ? 1 : 0.2
      }

      l.color = l.active ? computedStyleMap["--secondary"] : computedStyleMap["--gray"]
      tweenGroup.add(new Tweened<LinkRenderData>(l).to({ alpha }, 200))
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("link", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderLabels() {
    tweens.get("label")?.stop()
    const tweenGroup = new TweenGroup()

    const defaultScale = 1 / currentTransform.k
    const activeScale = defaultScale * 1.1
    for (const n of nodeRenderData) {
      const nodeId = n.simulationData.id

      if (hoveredNodeId === nodeId) {
        tweenGroup.add(
          new Tweened<Text>(n.label).to(
            {
              alpha: 1,
              scale: { x: activeScale, y: activeScale },
            },
            100,
          ),
        )
      } else {
        tweenGroup.add(
          new Tweened<Text>(n.label).to(
            {
              alpha: n.label.alpha,
              scale: { x: defaultScale, y: defaultScale },
            },
            100,
          ),
        )
      }
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("label", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderNodes() {
    tweens.get("hover")?.stop()

    const tweenGroup = new TweenGroup()
    for (const n of nodeRenderData) {
      let alpha = 1

      // if we are hovering over a node, we want to highlight the immediate neighbours
      if (hoveredNodeId !== null && focusOnHover) {
        alpha = n.active ? 1 : 0.2
      }

      tweenGroup.add(new Tweened<Graphics>(n.gfx, tweenGroup).to({ alpha }, 200))
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("hover", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderPixiFromD3() {
    renderNodes()
    renderLinks()
    renderLabels()
  }

  tweens.forEach((tween) => tween.stop())
  tweens.clear()

  const app = new Application()
  await app.init({
    width,
    height,
    antialias: true,
    autoStart: false,
    autoDensity: true,
    backgroundAlpha: 0,
    preference: "webgpu",
    resolution: window.devicePixelRatio,
    eventMode: "static",
  })
  graph.appendChild(app.canvas)

  const stage = app.stage
  stage.interactive = false

  const labelsContainer = new Container<Text>({ zIndex: 3, isRenderGroup: true })
  const labelBackgroundsContainer = new Container<Graphics>({ zIndex: 2, isRenderGroup: true })
  const nodesContainer = new Container<Graphics>({ zIndex: 2, isRenderGroup: true })
  const linkContainer = new Container<Graphics>({ zIndex: 1, isRenderGroup: true })
  stage.addChild(linkContainer, nodesContainer, labelBackgroundsContainer, labelsContainer)

  for (const n of graphData.nodes) {
    const nodeId = n.id

    const label = new Text({
      interactive: false,
      eventMode: "none",
      text: n.text,
      alpha: 1,
      anchor: { x: 0.5, y: 1.2 },
      style: {
        fontSize: fontSize * 15,
        fill: computedStyleMap["--dark"],
        fontFamily: computedStyleMap["--bodyFont"],
        fontWeight: "600",
      },
      resolution: window.devicePixelRatio * 4,
    })
    label.scale.set(1 / currentTransform.k)
    const labelBackground = new Graphics({ interactive: false, eventMode: "none" })

    let oldLabelOpacity = 0
    const isTagNode = nodeId.startsWith("tags/")
    const isCurrentNode = nodeId === slug
    const radius = nodeRadius(n)
    const nodeColor = isTagNode ? computedStyleMap["--light"] : color(n)
    const gfx = new Graphics({
      interactive: true,
      label: nodeId,
      eventMode: "static",
      hitArea: new Circle(0, 0, radius + 2),
      cursor: "pointer",
    })
      .circle(0, 0, radius + 1.6)
      .fill({ color: computedStyleMap["--light"], alpha: 0.72 })
      .circle(0, 0, radius)
      .fill({ color: nodeColor, alpha: 0.94 })
      .stroke({ width: isCurrentNode ? 2 : 1, color: computedStyleMap["--light"], alpha: 0.9 })
      .on("pointerover", (e) => {
        updateHoverInfo(e.target.label)
        oldLabelOpacity = label.alpha
        if (!dragging) {
          renderPixiFromD3()
        }
      })
      .on("pointerleave", () => {
        updateHoverInfo(null)
        label.alpha = oldLabelOpacity
        if (!dragging) {
          renderPixiFromD3()
        }
      })

    if (isTagNode) {
      gfx.stroke({ width: 2, color: computedStyleMap["--tertiary"] })
    }

    nodesContainer.addChild(gfx)
    labelBackgroundsContainer.addChild(labelBackground)
    labelsContainer.addChild(label)

    const nodeRenderDatum: NodeRenderData = {
      simulationData: n,
      gfx,
      label,
      labelBackground,
      color: color(n),
      alpha: 1,
      active: false,
    }

    nodeRenderData.push(nodeRenderDatum)
  }

  for (const l of graphData.links) {
    const gfx = new Graphics({ interactive: false, eventMode: "none" })
    linkContainer.addChild(gfx)

    const linkRenderDatum: LinkRenderData = {
      simulationData: l,
      gfx,
      color: computedStyleMap["--lightgray"],
      alpha: 1,
      active: false,
    }

    linkRenderData.push(linkRenderDatum)
  }

  if (enableDrag) {
    select<HTMLCanvasElement, NodeData | undefined>(app.canvas).call(
      drag<HTMLCanvasElement, NodeData | undefined>()
        .container(() => app.canvas)
        .subject(() => graphData.nodes.find((n) => n.id === hoveredNodeId))
        .on("start", function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(1).restart()
          event.subject.fx = event.subject.x
          event.subject.fy = event.subject.y
          event.subject.__initialDragPos = {
            x: event.subject.x,
            y: event.subject.y,
            fx: event.subject.fx,
            fy: event.subject.fy,
          }
          dragStartTime = Date.now()
          dragging = true
        })
        .on("drag", function dragged(event) {
          const initPos = event.subject.__initialDragPos
          event.subject.fx = initPos.x + (event.x - initPos.x) / currentTransform.k
          event.subject.fy = initPos.y + (event.y - initPos.y) / currentTransform.k
        })
        .on("end", function dragended(event) {
          if (!event.active) simulation.alphaTarget(0)
          event.subject.fx = null
          event.subject.fy = null
          dragging = false

          // if the time between mousedown and mouseup is short, we consider it a click
          if (Date.now() - dragStartTime < 500) {
            const node = graphData.nodes.find((n) => n.id === event.subject.id) as NodeData
            const targ = resolveRelative(fullSlug, node.id)
            window.spaNavigate(new URL(targ, window.location.toString()))
          }
        }),
    )
  } else {
    for (const node of nodeRenderData) {
      node.gfx.on("click", () => {
        const targ = resolveRelative(fullSlug, node.simulationData.id)
        window.spaNavigate(new URL(targ, window.location.toString()))
      })
    }
  }

  let handleWheelPan: ((event: WheelEvent) => void) | undefined
  if (enableZoom) {
    const canvasSelection = select<HTMLCanvasElement, NodeData>(app.canvas)
    const zoomBehavior = zoom<HTMLCanvasElement, NodeData>()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.25, 4])
      .filter((event) => event.type !== "wheel" || event.ctrlKey || event.metaKey)
      .on("zoom", ({ transform }) => {
        currentTransform = transform
        stage.scale.set(transform.k, transform.k)
        stage.position.set(transform.x, transform.y)
        updateVisibilityForScale(transform.k)

        // keep labels readable while the graph itself zooms
        const labelScale = 1 / transform.k
        const activeNodes = nodeRenderData.filter((n) => n.active).flatMap((n) => n.label)

        for (const label of labelsContainer.children) {
          if (label.visible) {
            label.alpha = 1
            label.scale.set(activeNodes.includes(label) ? labelScale * 1.1 : labelScale)
          }
        }
        updateLabelBackgrounds()
        updateLabelCollisions()
      })

    canvasSelection.call(zoomBehavior)
    const initialTransform = zoomIdentity
      .translate((1 - scale) * width * 0.5, (1 - scale) * height * 0.5)
      .scale(scale)
    canvasSelection.call(zoomBehavior.transform, initialTransform)
    handleWheelPan = (event) => {
      if (event.ctrlKey || event.metaKey) return
      event.preventDefault()
      zoomBehavior.translateBy(
        canvasSelection,
        -event.deltaX / currentTransform.k,
        -event.deltaY / currentTransform.k,
      )
    }
    app.canvas.addEventListener("wheel", handleWheelPan, { passive: false })
  }

  updateVisibilityForScale(currentTransform.k)
  updateLabelCollisions()

  let stopAnimation = false
  function animate(time: number) {
    if (stopAnimation) return
    for (const n of nodeRenderData) {
      const { x, y } = n.simulationData
      if (!x || !y) continue
      n.gfx.position.set(x + width / 2, y + height / 2)
      if (n.label) {
        n.label.position.set(x + width / 2, y + height / 2)
      }
    }
    updateLabelBackgrounds()

    for (const l of linkRenderData) {
      const linkData = l.simulationData
      l.gfx.clear()
      l.gfx.moveTo(linkData.source.x! + width / 2, linkData.source.y! + height / 2)
      l.gfx.lineTo(linkData.target.x! + width / 2, linkData.target.y! + height / 2).stroke({
        alpha: l.alpha * (l.active ? 0.92 : 0.58),
        width: l.active ? 1.6 : 1,
        color: l.color,
      })
    }

    tweens.forEach((t) => t.update(time))
    updateLabelCollisions()
    app.renderer.render(stage)
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
  return () => {
    stopAnimation = true
    if (handleWheelPan) app.canvas.removeEventListener("wheel", handleWheelPan)
    app.destroy()
  }
}

let localGraphCleanups: (() => void)[] = []
let globalGraphCleanups: (() => void)[] = []

function cleanupLocalGraphs() {
  for (const cleanup of localGraphCleanups) {
    cleanup()
  }
  localGraphCleanups = []
}

function cleanupGlobalGraphs() {
  for (const cleanup of globalGraphCleanups) {
    cleanup()
  }
  globalGraphCleanups = []
}

document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
  const slug = e.detail.url
  addToVisited(simplifySlug(slug))

  async function renderLocalGraph() {
    cleanupLocalGraphs()
    const localGraphContainers = document.getElementsByClassName("graph-container")
    for (const container of localGraphContainers) {
      localGraphCleanups.push(await renderGraph(container as HTMLElement, slug))
    }
  }

  await renderLocalGraph()
  const handleThemeChange = () => {
    void renderLocalGraph()
  }

  document.addEventListener("themechange", handleThemeChange)
  window.addCleanup(() => {
    document.removeEventListener("themechange", handleThemeChange)
  })

  const containers = [...document.getElementsByClassName("global-graph-outer")] as HTMLElement[]
  async function renderGlobalGraph() {
    const slug = getFullSlug(window)
    for (const container of containers) {
      container.classList.add("active")
      const sidebar = container.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = "1"
      }

      const graphContainer = container.querySelector(".global-graph-container") as HTMLElement
      registerEscapeHandler(container, hideGlobalGraph)
      if (graphContainer) {
        globalGraphCleanups.push(await renderGraph(graphContainer, slug))
      }
    }
  }

  function hideGlobalGraph() {
    cleanupGlobalGraphs()
    for (const container of containers) {
      container.classList.remove("active")
      const sidebar = container.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = ""
      }
    }
  }

  async function shortcutHandler(e: HTMLElementEventMap["keydown"]) {
    if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault()
      const anyGlobalGraphOpen = containers.some((container) =>
        container.classList.contains("active"),
      )
      anyGlobalGraphOpen ? hideGlobalGraph() : renderGlobalGraph()
    }
  }

  const containerIcons = document.getElementsByClassName("global-graph-icon")
  Array.from(containerIcons).forEach((icon) => {
    icon.addEventListener("click", renderGlobalGraph)
    window.addCleanup(() => icon.removeEventListener("click", renderGlobalGraph))
  })

  document.addEventListener("keydown", shortcutHandler)
  window.addCleanup(() => {
    document.removeEventListener("keydown", shortcutHandler)
    cleanupLocalGraphs()
    cleanupGlobalGraphs()
  })
})
