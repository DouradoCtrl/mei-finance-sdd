import { _ as __nuxt_component_2 } from './Card-Da4Q_95c.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { b as useAuth } from './server.mjs';
import 'tailwind-merge';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'vue-router';
import '@vueuse/core';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

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
            _push2(`<div class="text-center"${_scopeId}><h2 class="text-xl font-bold text-gray-950 dark:text-white"${_scopeId}>Bem-vindo ao MEI Finance!</h2><p class="text-xs text-gray-500 mt-1"${_scopeId}> Sua conta est\xE1 criada e sua autentica\xE7\xE3o est\xE1 funcionando sob a metodologia do SDD. </p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center" }, [
                createVNode("h2", { class: "text-xl font-bold text-gray-950 dark:text-white" }, "Bem-vindo ao MEI Finance!"),
                createVNode("p", { class: "text-xs text-gray-500 mt-1" }, " Sua conta est\xE1 criada e sua autentica\xE7\xE3o est\xE1 funcionando sob a metodologia do SDD. ")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed"${_scopeId}> Esta \xE9 a Dashboard segura protegida por token Laravel Sanctum com controle de sess\xE3o gerenciado pelo Nuxt. </p><div class="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 text-xs font-mono overflow-x-auto space-y-1 text-gray-800 dark:text-zinc-300"${_scopeId}><div${_scopeId}>Session status: Authenticated</div><div${_scopeId}>User: ${ssrInterpolate((_a = unref(user)) == null ? void 0 : _a.email)}</div><div${_scopeId}>CNPJ: ${ssrInterpolate(((_b = unref(user)) == null ? void 0 : _b.cnpj) || "N\xE3o cadastrado")}</div><div${_scopeId}>Role: ${ssrInterpolate(((_c = unref(user)) == null ? void 0 : _c.role) || "default")}</div><div${_scopeId}>Status: ${ssrInterpolate(((_d = unref(user)) == null ? void 0 : _d.active) ? "Active (Ativo)" : "Inactive (Inativo)")}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("p", { class: "text-sm text-gray-600 dark:text-zinc-400 leading-relaxed" }, " Esta \xE9 a Dashboard segura protegida por token Laravel Sanctum com controle de sess\xE3o gerenciado pelo Nuxt. "),
                createVNode("div", { class: "bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 text-xs font-mono overflow-x-auto space-y-1 text-gray-800 dark:text-zinc-300" }, [
                  createVNode("div", null, "Session status: Authenticated"),
                  createVNode("div", null, "User: " + toDisplayString((_e = unref(user)) == null ? void 0 : _e.email), 1),
                  createVNode("div", null, "CNPJ: " + toDisplayString(((_f = unref(user)) == null ? void 0 : _f.cnpj) || "N\xE3o cadastrado"), 1),
                  createVNode("div", null, "Role: " + toDisplayString(((_g = unref(user)) == null ? void 0 : _g.role) || "default"), 1),
                  createVNode("div", null, "Status: " + toDisplayString(((_h = unref(user)) == null ? void 0 : _h.active) ? "Active (Ativo)" : "Inactive (Inativo)"), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-xs text-gray-400 dark:text-zinc-500 mt-6"> M\xF3dulo 001-autenticacao finalizado. Pronto para iniciar o m\xF3dulo 002-importacao-extrato. </p></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-cSLyVDnB.mjs.map
