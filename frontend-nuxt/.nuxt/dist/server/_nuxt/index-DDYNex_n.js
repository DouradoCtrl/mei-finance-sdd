import { defineComponent, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/hookable/dist/index.mjs";
import "../server.mjs";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/unctx/dist/index.mjs";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/defu/dist/defu.mjs";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/ufo/dist/index.mjs";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/destr/dist/index.mjs";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/ohash/dist/index.mjs";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/klona/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/perfect-debounce/dist/index.mjs";
import "ohash/utils";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DDYNex_n.js.map
