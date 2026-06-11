import { _ as __nuxt_component_2 } from './Card-Da4Q_95c.mjs';
import { _ as __nuxt_component_1, a as __nuxt_component_2$1 } from './Input-DQSfVLjH.mjs';
import { b as useAuth, c as __nuxt_component_4, a as __nuxt_component_0$2, n as navigateTo } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
import '@vueuse/core';
import 'vue-router';
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
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const name = ref("");
    const email = ref("");
    const cnpj = ref("");
    const password = ref("");
    const error = ref("");
    const success = ref("");
    const loading = ref(false);
    const { register } = useAuth();
    const handleSubmit = async () => {
      error.value = "";
      success.value = "";
      loading.value = true;
      if (password.value.length < 6) {
        error.value = "A senha deve conter no m\xEDnimo 6 caracteres.";
        loading.value = false;
        return;
      }
      const result = await register({
        name: name.value,
        email: email.value,
        cnpj: cnpj.value || null,
        password: password.value
      });
      if (result.success) {
        success.value = "Cadastro realizado com sucesso! Conectando...";
        setTimeout(() => {
          navigateTo("/dashboard");
        }, 1500);
      } else {
        error.value = result.message || "Falha ao realizar cadastro.";
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_1;
      const _component_UInput = __nuxt_component_2$1;
      const _component_UButton = __nuxt_component_4;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center p-4" }, _attrs))}><div class="w-full max-w-md">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center"${_scopeId}><h1 class="text-3xl font-bold tracking-tight"${_scopeId}>MEI Finance</h1><p class="text-sm text-gray-500 mt-1"${_scopeId}> Crie sua conta e organize suas finan\xE7as PJ e PF </p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center" }, [
                createVNode("h1", { class: "text-3xl font-bold tracking-tight" }, "MEI Finance"),
                createVNode("p", { class: "text-sm text-gray-500 mt-1" }, " Crie sua conta e organize suas finan\xE7as PJ e PF ")
              ])
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center text-xs text-gray-500"${_scopeId}> J\xE1 tem uma conta? `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/login",
              class: "text-primary hover:underline font-semibold"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Entrar `);
                } else {
                  return [
                    createTextVNode(" Entrar ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "text-center text-xs text-gray-500" }, [
                createTextVNode(" J\xE1 tem uma conta? "),
                createVNode(_component_NuxtLink, {
                  to: "/login",
                  class: "text-primary hover:underline font-semibold"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Entrar ")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (error.value) {
              _push2(`<div class="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-2.5 rounded"${_scopeId}>${ssrInterpolate(error.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (success.value) {
              _push2(`<div class="mb-4 text-sm text-green-500 bg-green-50 dark:bg-green-950/20 p-2.5 rounded"${_scopeId}>${ssrInterpolate(success.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Nome Completo",
              name: "name",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    id: "name",
                    modelValue: name.value,
                    "onUpdate:modelValue": ($event) => name.value = $event,
                    type: "text",
                    placeholder: "Ex: Carlos Silva",
                    required: "",
                    disabled: loading.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      id: "name",
                      modelValue: name.value,
                      "onUpdate:modelValue": ($event) => name.value = $event,
                      type: "text",
                      placeholder: "Ex: Carlos Silva",
                      required: "",
                      disabled: loading.value
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "E-mail de Acesso",
              name: "email",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    id: "email",
                    modelValue: email.value,
                    "onUpdate:modelValue": ($event) => email.value = $event,
                    type: "email",
                    placeholder: "Ex: carlos@email.com",
                    required: "",
                    disabled: loading.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      id: "email",
                      modelValue: email.value,
                      "onUpdate:modelValue": ($event) => email.value = $event,
                      type: "email",
                      placeholder: "Ex: carlos@email.com",
                      required: "",
                      disabled: loading.value
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "CNPJ (Opcional)",
              name: "cnpj"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    id: "cnpj",
                    modelValue: cnpj.value,
                    "onUpdate:modelValue": ($event) => cnpj.value = $event,
                    type: "text",
                    placeholder: "Ex: 12.345.678/0001-99",
                    disabled: loading.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      id: "cnpj",
                      modelValue: cnpj.value,
                      "onUpdate:modelValue": ($event) => cnpj.value = $event,
                      type: "text",
                      placeholder: "Ex: 12.345.678/0001-99",
                      disabled: loading.value
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Senha (m\xEDnimo 6 d\xEDgitos)",
              name: "password",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    id: "password",
                    modelValue: password.value,
                    "onUpdate:modelValue": ($event) => password.value = $event,
                    type: "password",
                    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                    required: "",
                    disabled: loading.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      id: "password",
                      modelValue: password.value,
                      "onUpdate:modelValue": ($event) => password.value = $event,
                      type: "password",
                      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                      required: "",
                      disabled: loading.value
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              block: "",
              loading: loading.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cadastrar `);
                } else {
                  return [
                    createTextVNode(" Cadastrar ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</form>`);
          } else {
            return [
              error.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-2.5 rounded"
              }, toDisplayString(error.value), 1)) : createCommentVNode("", true),
              success.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mb-4 text-sm text-green-500 bg-green-50 dark:bg-green-950/20 p-2.5 rounded"
              }, toDisplayString(success.value), 1)) : createCommentVNode("", true),
              createVNode("form", {
                onSubmit: withModifiers(handleSubmit, ["prevent"]),
                class: "space-y-4"
              }, [
                createVNode(_component_UFormGroup, {
                  label: "Nome Completo",
                  name: "name",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      id: "name",
                      modelValue: name.value,
                      "onUpdate:modelValue": ($event) => name.value = $event,
                      type: "text",
                      placeholder: "Ex: Carlos Silva",
                      required: "",
                      disabled: loading.value
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, {
                  label: "E-mail de Acesso",
                  name: "email",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      id: "email",
                      modelValue: email.value,
                      "onUpdate:modelValue": ($event) => email.value = $event,
                      type: "email",
                      placeholder: "Ex: carlos@email.com",
                      required: "",
                      disabled: loading.value
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, {
                  label: "CNPJ (Opcional)",
                  name: "cnpj"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      id: "cnpj",
                      modelValue: cnpj.value,
                      "onUpdate:modelValue": ($event) => cnpj.value = $event,
                      type: "text",
                      placeholder: "Ex: 12.345.678/0001-99",
                      disabled: loading.value
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, {
                  label: "Senha (m\xEDnimo 6 d\xEDgitos)",
                  name: "password",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      id: "password",
                      modelValue: password.value,
                      "onUpdate:modelValue": ($event) => password.value = $event,
                      type: "password",
                      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                      required: "",
                      disabled: loading.value
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UButton, {
                  type: "submit",
                  block: "",
                  loading: loading.value
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Cadastrar ")
                  ]),
                  _: 1
                }, 8, ["loading"])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-gT1er20q.mjs.map
