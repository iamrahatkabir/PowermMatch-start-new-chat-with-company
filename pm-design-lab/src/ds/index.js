// Every Pm* component is registered globally — variants use them without importing.
const modules = import.meta.glob('./Pm*.vue', { eager: true })

export default {
  install(app) {
    for (const [path, mod] of Object.entries(modules)) {
      app.component(path.match(/(Pm\w+)\.vue$/)[1], mod.default)
    }
  },
}
