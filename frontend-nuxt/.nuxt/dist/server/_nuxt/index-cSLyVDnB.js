import { _ as __nuxt_component_2 } from "./Card-Da4Q_95c.js";
import { defineComponent, mergeProps, withCtx, unref, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { b as useAuth } from "../server.mjs";
import "tailwind-merge";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/hookable/dist/index.mjs";
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
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/perfect-debounce/dist/index.mjs";
import "ohash/utils";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "flex-1 p-6 flex flex-col justify-center items-center" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, { class: "max-w-lg w-full" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center"${_scopeId}><h2 class="text-xl font-bold text-gray-950 dark:text-white"${_scopeId}>Bem-vindo ao MEI Finance!</h2><p class="text-xs text-gray-500 mt-1"${_scopeId}> Sua conta está criada e sua autenticação está funcionando sob a metodologia do SDD. </p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center" }, [
                createVNode("h2", { class: "text-xl font-bold text-gray-950 dark:text-white" }, "Bem-vindo ao MEI Finance!"),
                createVNode("p", { class: "text-xs text-gray-500 mt-1" }, " Sua conta está criada e sua autenticação está funcionando sob a metodologia do SDD. ")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed"${_scopeId}> Esta é a Dashboard segura protegida por token Laravel Sanctum com controle de sessão gerenciado pelo Nuxt. </p><div class="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 text-xs font-mono overflow-x-auto space-y-1 text-gray-800 dark:text-zinc-300"${_scopeId}><div${_scopeId}>Session status: Authenticated</div><div${_scopeId}>User: ${ssrInterpolate(unref(user)?.email)}</div><div${_scopeId}>CNPJ: ${ssrInterpolate(unref(user)?.cnpj || "Não cadastrado")}</div><div${_scopeId}>Role: ${ssrInterpolate(unref(user)?.role || "default")}</div><div${_scopeId}>Status: ${ssrInterpolate(unref(user)?.active ? "Active (Ativo)" : "Inactive (Inativo)")}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("p", { class: "text-sm text-gray-600 dark:text-zinc-400 leading-relaxed" }, " Esta é a Dashboard segura protegida por token Laravel Sanctum com controle de sessão gerenciado pelo Nuxt. "),
                createVNode("div", { class: "bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 text-xs font-mono overflow-x-auto space-y-1 text-gray-800 dark:text-zinc-300" }, [
                  createVNode("div", null, "Session status: Authenticated"),
                  createVNode("div", null, "User: " + toDisplayString(unref(user)?.email), 1),
                  createVNode("div", null, "CNPJ: " + toDisplayString(unref(user)?.cnpj || "Não cadastrado"), 1),
                  createVNode("div", null, "Role: " + toDisplayString(unref(user)?.role || "default"), 1),
                  createVNode("div", null, "Status: " + toDisplayString(unref(user)?.active ? "Active (Ativo)" : "Inactive (Inativo)"), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-xs text-gray-400 dark:text-zinc-500 mt-6"> Módulo 001-autenticacao finalizado. Pronto para iniciar o módulo 002-importacao-extrato. </p></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-cSLyVDnB.js.map
