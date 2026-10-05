import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'

let light = false
let plugin
let onThemeChange
const Chart = { register(value) { plugin = value }, instances: {} }
const context = vm.createContext({
  window: { Chart }, document: { documentElement: { classList: { contains: () => light } } },
  matchMedia: () => ({ matches: false }),
  MutationObserver: class { constructor(callback) { onThemeChange = callback } observe() {} },
})
const source = readFileSync('app/zyntello-app/public/js/financial-charts.js', 'utf8')
vm.runInContext(source, context)
const chart = {
  config: { type: 'bar', options: { scales: { y: { ticks: { callback: String }, stacked: true } } } },
  data: { datasets: [
    { data: [30, 40], backgroundColor: 'transparent' },
    { data: [5, 10], backgroundColor: ['#10b981', '#dc2626'] },
    { type: 'line', data: [1, null, 3], borderColor: '#10b981', fill: true },
  ] },
  update(mode) { assert.equal(mode, 'none'); plugin.beforeUpdate(this) },
}
const data = JSON.stringify(chart.data.datasets.map(d => d.data))
plugin.beforeUpdate(chart)
assert.equal(chart.data.datasets[0].backgroundColor, 'transparent')
assert.deepEqual(Array.from(chart.data.datasets[1].backgroundColor), ['#76b39e', '#d79485'])
assert.equal(chart.data.datasets[2].borderWidth, 2)
assert.equal(chart.data.datasets[2].backgroundColor, '#76b39e0c')
assert.equal(chart.config.options.scales.y.ticks.callback, String)
assert.equal(chart.config.options.scales.y.stacked, true)
Chart.instances.chart = chart
light = true
onThemeChange()
assert.deepEqual(Array.from(chart.data.datasets[1].backgroundColor), ['#31816b', '#b15f50'])
assert.equal(chart.config.options.scales.y.ticks.color, '#526174')
assert.equal(JSON.stringify(chart.data.datasets.map(d => d.data)), data)
const registered = plugin
vm.runInContext(source, context)
assert.equal(plugin, registered)
assert.equal(source, readFileSync('admin/public/js/financial-charts.js', 'utf8'))
console.log('Gráficos: tema, datos, transparencia, formatos y registro verificados.')
