# graphify-refresh.ps1
# Re-extrae y fusiona el grafo de conocimiento del ecosistema Zyntello
# (website + app/zyntello-app + admin) en graphify-out/.
#
# 100% local, sin LLM (--code-only). Ejecutar cuando el código cambie:
#   pwsh ./graphify-refresh.ps1
#
# Requisitos: `uv tool install graphifyy --with mcp` (ya instalado).
# Respeta los .graphifyignore de cada repo (excluyen vendor/, storage/, etc.).

$ErrorActionPreference = "Stop"
$root     = $PSScriptRoot
$tmp      = Join-Path $env:TEMP "graphify-zyntello"
$webOut   = Join-Path $tmp "webout"
$appOut   = Join-Path $tmp "appout"
$adminOut = Join-Path $tmp "adminout"

Write-Host "== [1/5] Extrayendo website (src/) ==" -ForegroundColor Cyan
graphify extract "$root" --code-only --out "$webOut"

Write-Host "== [2/5] Extrayendo app/zyntello-app ==" -ForegroundColor Cyan
graphify extract "$root/app/zyntello-app" --code-only --out "$appOut"

Write-Host "== [3/5] Extrayendo admin ==" -ForegroundColor Cyan
graphify extract "$root/admin" --code-only --out "$adminOut"

Write-Host "== [4/5] Fusionando los 3 grafos ==" -ForegroundColor Cyan
graphify merge-graphs `
  "$webOut/graphify-out/graph.json" `
  "$appOut/graphify-out/graph.json" `
  "$adminOut/graphify-out/graph.json" `
  --out "$root/graphify-out/graph.json"

Write-Host "== [5/5] Clustering + reporte + vistas HTML ==" -ForegroundColor Cyan
$env:GRAPHIFY_VIZ_NODE_LIMIT = "20000"
graphify cluster-only "$root" --no-label
graphify tree --label "Ecosistema Zyntello (website+app+admin)"

Write-Host ""
Write-Host "Listo. graphify-out/ actualizado (graph.json, GRAPH_REPORT.md, GRAPH_TREE.html, graph.html)." -ForegroundColor Green
