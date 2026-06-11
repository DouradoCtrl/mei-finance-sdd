import { _ as _export_sfc, d as useUI, m as mergeConfig, e as appConfig, b as useAuth, h as useToast, c as __nuxt_component_4, f as __nuxt_component_1 } from "../server.mjs";
import { _ as __nuxt_component_2 } from "./Card-Da4Q_95c.js";
import { resolveComponent, mergeProps, withCtx, createVNode, renderSlot, openBlock, createBlock, createCommentVNode, defineComponent, toRef, computed, useId, useSSRContext, ref, createTextVNode, toDisplayString, withModifiers, Fragment, renderList } from "vue";
import { h as he, S as Se, G as Ge, Y as Ye, s } from "./transition-BMgUVLZM.js";
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrRenderAttrs, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
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
import "tailwind-merge";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend-nuxt/node_modules/perfect-debounce/dist/index.mjs";
import "ohash/utils";
const modal = {
  wrapper: "relative z-50",
  inner: "fixed inset-0 overflow-y-auto",
  container: "flex min-h-full items-end sm:items-center justify-center text-center",
  padding: "p-4 sm:p-0",
  margin: "sm:my-8",
  base: "relative text-left rtl:text-right flex flex-col",
  overlay: {
    base: "fixed inset-0 transition-opacity",
    background: "bg-gray-200/75 dark:bg-gray-800/75",
    // Syntax for `<TransitionRoot>` component https://headlessui.com/v1/vue/transition#basic-example
    transition: {
      enter: "ease-out duration-300",
      enterFrom: "opacity-0",
      enterTo: "opacity-100",
      leave: "ease-in duration-200",
      leaveFrom: "opacity-100",
      leaveTo: "opacity-0"
    }
  },
  background: "bg-white dark:bg-gray-900",
  ring: "",
  rounded: "rounded-lg",
  shadow: "shadow-xl",
  width: "w-full sm:max-w-lg",
  height: "",
  fullscreen: "w-screen h-screen",
  // Syntax for `<TransitionRoot>` component https://headlessui.com/v1/vue/transition#basic-example
  transition: {
    enter: "ease-out duration-300",
    enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
    enterTo: "opacity-100 translate-y-0 sm:scale-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
    leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  }
};
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.modal, modal);
const _sfc_main$1 = defineComponent({
  components: {
    HDialog: Ye,
    HDialogPanel: Ge,
    TransitionRoot: Se,
    TransitionChild: he
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    appear: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: true
    },
    transition: {
      type: Boolean,
      default: true
    },
    preventClose: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue", "close", "close-prevented", "after-leave"],
  setup(props, { emit }) {
    const { ui, attrs } = useUI("modal", toRef(props, "ui"), config, toRef(props, "class"));
    const isOpen = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      }
    });
    const transitionClass = computed(() => {
      if (!props.transition) {
        return {};
      }
      return {
        ...ui.value.transition
      };
    });
    function close(value) {
      if (props.preventClose) {
        emit("close-prevented");
        return;
      }
      isOpen.value = value;
      emit("close");
    }
    const onAfterLeave = () => {
      emit("after-leave");
    };
    s(() => useId());
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isOpen,
      transitionClass,
      onAfterLeave,
      close
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TransitionRoot = resolveComponent("TransitionRoot");
  const _component_HDialog = resolveComponent("HDialog");
  const _component_TransitionChild = resolveComponent("TransitionChild");
  const _component_HDialogPanel = resolveComponent("HDialogPanel");
  _push(ssrRenderComponent(_component_TransitionRoot, mergeProps({
    appear: _ctx.appear,
    show: _ctx.isOpen,
    as: "template",
    onAfterLeave: _ctx.onAfterLeave
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_HDialog, mergeProps({
          class: _ctx.ui.wrapper
        }, _ctx.attrs, { onClose: _ctx.close }), {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              if (_ctx.overlay) {
                _push3(ssrRenderComponent(_component_TransitionChild, mergeProps({
                  as: "template",
                  appear: _ctx.appear
                }, _ctx.ui.overlay.transition, {
                  class: _ctx.ui.overlay.transition.enterFrom
                }), {
                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      _push4(`<div class="${ssrRenderClass([_ctx.ui.overlay.base, _ctx.ui.overlay.background])}"${_scopeId3}></div>`);
                    } else {
                      return [
                        createVNode("div", {
                          class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background]
                        }, null, 2)
                      ];
                    }
                  }),
                  _: 1
                }, _parent3, _scopeId2));
              } else {
                _push3(`<!---->`);
              }
              _push3(`<div class="${ssrRenderClass(_ctx.ui.inner)}"${_scopeId2}><div class="${ssrRenderClass([_ctx.ui.container, !_ctx.fullscreen && _ctx.ui.padding])}"${_scopeId2}>`);
              _push3(ssrRenderComponent(_component_TransitionChild, mergeProps({
                as: "template",
                appear: _ctx.appear
              }, _ctx.transitionClass, {
                class: _ctx.transitionClass.enterFrom
              }), {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_HDialogPanel, {
                      class: [
                        _ctx.ui.base,
                        _ctx.ui.background,
                        _ctx.ui.ring,
                        _ctx.ui.shadow,
                        _ctx.fullscreen ? _ctx.ui.fullscreen : [_ctx.ui.width, _ctx.ui.height, _ctx.ui.rounded, _ctx.ui.margin]
                      ]
                    }, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push5, _parent5, _scopeId4);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "default")
                          ];
                        }
                      }),
                      _: 3
                    }, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_HDialogPanel, {
                        class: [
                          _ctx.ui.base,
                          _ctx.ui.background,
                          _ctx.ui.ring,
                          _ctx.ui.shadow,
                          _ctx.fullscreen ? _ctx.ui.fullscreen : [_ctx.ui.width, _ctx.ui.height, _ctx.ui.rounded, _ctx.ui.margin]
                        ]
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "default")
                        ]),
                        _: 3
                      }, 8, ["class"])
                    ];
                  }
                }),
                _: 3
              }, _parent3, _scopeId2));
              _push3(`</div></div>`);
            } else {
              return [
                _ctx.overlay ? (openBlock(), createBlock(_component_TransitionChild, mergeProps({
                  key: 0,
                  as: "template",
                  appear: _ctx.appear
                }, _ctx.ui.overlay.transition, {
                  class: _ctx.ui.overlay.transition.enterFrom
                }), {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background]
                    }, null, 2)
                  ]),
                  _: 1
                }, 16, ["appear", "class"])) : createCommentVNode("", true),
                createVNode("div", {
                  class: _ctx.ui.inner
                }, [
                  createVNode("div", {
                    class: [_ctx.ui.container, !_ctx.fullscreen && _ctx.ui.padding]
                  }, [
                    createVNode(_component_TransitionChild, mergeProps({
                      as: "template",
                      appear: _ctx.appear
                    }, _ctx.transitionClass, {
                      class: _ctx.transitionClass.enterFrom
                    }), {
                      default: withCtx(() => [
                        createVNode(_component_HDialogPanel, {
                          class: [
                            _ctx.ui.base,
                            _ctx.ui.background,
                            _ctx.ui.ring,
                            _ctx.ui.shadow,
                            _ctx.fullscreen ? _ctx.ui.fullscreen : [_ctx.ui.width, _ctx.ui.height, _ctx.ui.rounded, _ctx.ui.margin]
                          ]
                        }, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "default")
                          ]),
                          _: 3
                        }, 8, ["class"])
                      ]),
                      _: 3
                    }, 16, ["appear", "class"])
                  ], 2)
                ], 2)
              ];
            }
          }),
          _: 3
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_HDialog, mergeProps({
            class: _ctx.ui.wrapper
          }, _ctx.attrs, { onClose: _ctx.close }), {
            default: withCtx(() => [
              _ctx.overlay ? (openBlock(), createBlock(_component_TransitionChild, mergeProps({
                key: 0,
                as: "template",
                appear: _ctx.appear
              }, _ctx.ui.overlay.transition, {
                class: _ctx.ui.overlay.transition.enterFrom
              }), {
                default: withCtx(() => [
                  createVNode("div", {
                    class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background]
                  }, null, 2)
                ]),
                _: 1
              }, 16, ["appear", "class"])) : createCommentVNode("", true),
              createVNode("div", {
                class: _ctx.ui.inner
              }, [
                createVNode("div", {
                  class: [_ctx.ui.container, !_ctx.fullscreen && _ctx.ui.padding]
                }, [
                  createVNode(_component_TransitionChild, mergeProps({
                    as: "template",
                    appear: _ctx.appear
                  }, _ctx.transitionClass, {
                    class: _ctx.transitionClass.enterFrom
                  }), {
                    default: withCtx(() => [
                      createVNode(_component_HDialogPanel, {
                        class: [
                          _ctx.ui.base,
                          _ctx.ui.background,
                          _ctx.ui.ring,
                          _ctx.ui.shadow,
                          _ctx.fullscreen ? _ctx.ui.fullscreen : [_ctx.ui.width, _ctx.ui.height, _ctx.ui.rounded, _ctx.ui.margin]
                        ]
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "default")
                        ]),
                        _: 3
                      }, 8, ["class"])
                    ]),
                    _: 3
                  }, 16, ["appear", "class"])
                ], 2)
              ], 2)
            ]),
            _: 3
          }, 16, ["class", "onClose"])
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Modal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("business_pj");
    const activeSource = ref("checking_account");
    const history = ref([]);
    const tempTransactions = ref([]);
    const isImportModalOpen = ref(false);
    const file = ref(null);
    const fetchLoading = ref(false);
    const importLoading = ref(false);
    const confirmLoading = ref(false);
    const isDeleteDialogOpen = ref(false);
    const transactionToDelete = ref(null);
    const { apiFetch } = useAuth();
    const toast = useToast();
    const mainTabs = [
      { label: "Pendentes", value: "pending" },
      { label: "Pessoa Jurídica (PJ)", value: "business_pj" },
      { label: "Pessoa Física (PF)", value: "personal_pf" },
      { label: "Neutro / Transferências", value: "transfer" }
    ];
    const sourceTabs = [
      { label: "Conta Corrente", value: "checking_account", icon: "i-heroicons-wallet" },
      { label: "Cartão de Crédito", value: "credit_card", icon: "i-heroicons-credit-card" }
    ];
    const faturamentoLabel = computed(() => {
      switch (activeTab.value) {
        case "business_pj":
          return "Faturamento (PJ)";
        case "personal_pf":
          return "Entradas (PF)";
        case "transfer":
          return "Entradas (Neutras)";
        default:
          return "Entradas (Pendentes)";
      }
    });
    const gastosLabel = computed(() => {
      switch (activeTab.value) {
        case "business_pj":
          return "Gastos (PJ)";
        case "personal_pf":
          return "Saídas (PF)";
        case "transfer":
          return "Saídas (Neutras)";
        default:
          return "Saídas (Pendentes)";
      }
    });
    const lucroLabel = computed(() => {
      switch (activeTab.value) {
        case "business_pj":
          return "Lucro Líquido";
        case "personal_pf":
          return "Saldo (PF)";
        case "transfer":
          return "Saldo (Neutro)";
        default:
          return "Saldo (Pendente)";
      }
    });
    const fetchHistory = async () => {
      fetchLoading.value = true;
      try {
        const response = await apiFetch("/transactions", { method: "GET" });
        if (response && response.success) {
          history.value = response.data || [];
        } else {
          toast.add({
            title: "Erro ao carregar histórico",
            description: response?.message || "Falha ao buscar dados",
            color: "red"
          });
        }
      } catch (err) {
        toast.add({
          title: "Erro de conexão",
          description: err.message || "Falha ao buscar dados no backend",
          color: "red"
        });
      } finally {
        fetchLoading.value = false;
      }
    };
    const filteredHistory = computed(() => {
      return history.value.filter(
        (tx) => tx.source === activeSource.value && tx.classification === activeTab.value
      );
    });
    const kpis = computed(() => {
      let faturamento = 0;
      let gastos = 0;
      filteredHistory.value.forEach((tx) => {
        if (tx.amount > 0) {
          faturamento += tx.amount;
        } else {
          gastos += Math.abs(tx.amount);
        }
      });
      return {
        faturamento,
        gastos,
        lucro: faturamento - gastos
      };
    });
    const openImportModal = () => {
      tempTransactions.value = [];
      file.value = null;
      isImportModalOpen.value = true;
    };
    const handleFileChange = (e) => {
      const target = e.target;
      if (target.files && target.files.length > 0) {
        file.value = target.files[0];
      }
    };
    const handleUploadOFX = async () => {
      if (!file.value) return;
      importLoading.value = true;
      tempTransactions.value = [];
      const formData = new FormData();
      formData.append("source", activeSource.value);
      formData.append("file", file.value);
      try {
        const response = await apiFetch("/transactions/parse", {
          method: "POST",
          body: formData
        });
        if (response && response.success) {
          tempTransactions.value = response.data || [];
          toast.add({
            title: "Arquivo processado!",
            description: "Extrato processado com sucesso. Classifique os lançamentos.",
            color: "green"
          });
        } else {
          toast.add({
            title: "Falha no upload",
            description: response?.message || "Erro ao processar o arquivo.",
            color: "red"
          });
        }
      } catch (err) {
        toast.add({
          title: "Erro de conexão",
          description: err.message || "Erro ao processar arquivo.",
          color: "red"
        });
      } finally {
        importLoading.value = false;
      }
    };
    const handleClassifyTemp = (index, classification) => {
      tempTransactions.value = tempTransactions.value.map(
        (tx, idx) => idx === index ? { ...tx, classification } : tx
      );
    };
    const handleConfirmImport = async () => {
      confirmLoading.value = true;
      try {
        const response = await apiFetch("/transactions/confirm", {
          method: "POST",
          body: { transactions: tempTransactions.value }
        });
        if (response && response.success) {
          toast.add({
            title: "Lançamentos salvos!",
            description: "Transações salvas e conciliação realizada com sucesso.",
            color: "green"
          });
          tempTransactions.value = [];
          file.value = null;
          isImportModalOpen.value = false;
          await fetchHistory();
        } else {
          toast.add({
            title: "Erro ao salvar",
            description: response?.message || "Falha ao salvar lançamentos.",
            color: "red"
          });
        }
      } catch (err) {
        toast.add({
          title: "Erro de conexão",
          description: err.message || "Falha ao salvar lançamentos.",
          color: "red"
        });
      } finally {
        confirmLoading.value = false;
      }
    };
    const handleReclassifySaved = async (id, classification) => {
      try {
        const response = await apiFetch(`/transactions/${id}/classify`, {
          method: "PATCH",
          body: { classification }
        });
        if (response && response.success) {
          history.value = history.value.map(
            (tx) => tx.id === id ? { ...tx, classification } : tx
          );
          toast.add({
            title: "Classificação atualizada",
            description: "Classificação atualizada com sucesso.",
            color: "green"
          });
        } else {
          toast.add({
            title: "Erro ao reclassificar",
            description: response?.message || "Erro ao alterar classificação.",
            color: "red"
          });
        }
      } catch (err) {
        toast.add({
          title: "Erro de conexão",
          description: err.message || "Erro ao alterar classificação.",
          color: "red"
        });
      }
    };
    const openDeleteDialog = (id) => {
      transactionToDelete.value = id;
      isDeleteDialogOpen.value = true;
    };
    const confirmDelete = async () => {
      if (transactionToDelete.value === null) return;
      const id = transactionToDelete.value;
      isDeleteDialogOpen.value = false;
      transactionToDelete.value = null;
      try {
        const response = await apiFetch(`/transactions/${id}`, {
          method: "DELETE"
        });
        if (response && response.success) {
          history.value = history.value.filter((tx) => tx.id !== id);
          toast.add({
            title: "Lançamento excluído",
            description: "Transação excluída com sucesso.",
            color: "green"
          });
        } else {
          toast.add({
            title: "Erro ao excluir",
            description: response?.message || "Erro ao excluir transação.",
            color: "red"
          });
        }
      } catch (err) {
        toast.add({
          title: "Erro de conexão",
          description: err.message || "Erro de conexão ao excluir transação.",
          color: "red"
        });
      }
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      return dateStr.split("-").reverse().join("/");
    };
    const formatCurrency = (val) => {
      return val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_4;
      const _component_UIcon = __nuxt_component_1;
      const _component_UCard = __nuxt_component_2;
      const _component_UModal = __nuxt_component_3;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto" }, _attrs))}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h1 class="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">Receitas e Fluxo de Caixa</h1><p class="text-sm text-gray-500 mt-1"> Acompanhe seu faturamento, controle despesas e faça conciliações rápidas via extrato. </p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-cloud-arrow-up",
        class: "flex items-center gap-2 font-medium",
        onClick: openImportModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Importar Extrato OFX `);
          } else {
            return [
              createTextVNode(" Importar Extrato OFX ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="border-b border-gray-200 dark:border-zinc-800 flex gap-4 overflow-x-auto"><!--[-->`);
      ssrRenderList(mainTabs, (tab) => {
        _push(`<button class="${ssrRenderClass([[
          activeTab.value === tab.value ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 hover:border-gray-300"
        ], "pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"])}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg self-start"><!--[-->`);
      ssrRenderList(sourceTabs, (src) => {
        _push(`<button class="${ssrRenderClass([[
          activeSource.value === src.value ? "bg-white dark:bg-zinc-900 text-gray-950 dark:text-white shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
        ], "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"])}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: src.icon,
          class: "h-3.5 w-3.5"
        }, null, _parent));
        _push(` ${ssrInterpolate(src.label)}</button>`);
      });
      _push(`<!--]--></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4">`);
      _push(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "p-4 pb-3 flex flex-col gap-1 items-center text-center" } } }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-1.5 text-xs font-semibold text-gray-500"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-arrow-up-right",
              class: "w-3.5 h-3.5 text-emerald-500 shrink-0"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(faturamentoLabel.value)}</span></div><div class="text-2xl font-black tracking-tight text-gray-950 dark:text-white mt-1 font-mono"${_scopeId}> R$ ${ssrInterpolate(formatCurrency(kpis.value.faturamento))}</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-1.5 text-xs font-semibold text-gray-500" }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-arrow-up-right",
                  class: "w-3.5 h-3.5 text-emerald-500 shrink-0"
                }),
                createVNode("span", null, toDisplayString(faturamentoLabel.value), 1)
              ]),
              createVNode("div", { class: "text-2xl font-black tracking-tight text-gray-950 dark:text-white mt-1 font-mono" }, " R$ " + toDisplayString(formatCurrency(kpis.value.faturamento)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "p-4 pb-3 flex flex-col gap-1 items-center text-center" } } }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-1.5 text-xs font-semibold text-gray-500"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-arrow-down-left",
              class: "w-3.5 h-3.5 text-rose-500 shrink-0"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(gastosLabel.value)}</span></div><div class="text-2xl font-black tracking-tight text-gray-950 dark:text-white mt-1 font-mono"${_scopeId}> R$ ${ssrInterpolate(formatCurrency(kpis.value.gastos))}</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-1.5 text-xs font-semibold text-gray-500" }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-arrow-down-left",
                  class: "w-3.5 h-3.5 text-rose-500 shrink-0"
                }),
                createVNode("span", null, toDisplayString(gastosLabel.value), 1)
              ]),
              createVNode("div", { class: "text-2xl font-black tracking-tight text-gray-950 dark:text-white mt-1 font-mono" }, " R$ " + toDisplayString(formatCurrency(kpis.value.gastos)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "p-4 pb-3 flex flex-col gap-1 items-center text-center" } } }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-1.5 text-xs font-semibold text-gray-500"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chart-bar",
              class: ["w-3.5 h-3.5 shrink-0", [kpis.value.lucro >= 0 ? "text-emerald-500" : "text-rose-500"]]
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(lucroLabel.value)}</span></div><div class="${ssrRenderClass([[kpis.value.lucro >= 0 ? "text-emerald-500" : "text-rose-500"], "text-2xl font-black tracking-tight mt-1 font-mono"])}"${_scopeId}> R$ ${ssrInterpolate(formatCurrency(kpis.value.lucro))}</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-1.5 text-xs font-semibold text-gray-500" }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-chart-bar",
                  class: ["w-3.5 h-3.5 shrink-0", [kpis.value.lucro >= 0 ? "text-emerald-500" : "text-rose-500"]]
                }, null, 8, ["class"]),
                createVNode("span", null, toDisplayString(lucroLabel.value), 1)
              ]),
              createVNode("div", {
                class: ["text-2xl font-black tracking-tight mt-1 font-mono", [kpis.value.lucro >= 0 ? "text-emerald-500" : "text-rose-500"]]
              }, " R$ " + toDisplayString(formatCurrency(kpis.value.lucro)), 3)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden"><div class="p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50"><h3 class="text-base font-semibold text-gray-950 dark:text-white">Histórico de Lançamentos</h3><p class="text-xs text-gray-500 mt-1"> Transações já conciliadas e gravadas no banco de dados para a origem selecionada. </p></div>`);
      if (fetchLoading.value) {
        _push(`<div class="p-12 flex justify-center items-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "h-6 w-6 animate-spin text-gray-500"
        }, null, _parent));
        _push(`</div>`);
      } else if (filteredHistory.value.length === 0) {
        _push(`<div class="p-12 text-center text-sm text-gray-500"> Nenhuma transação encontrada no banco de dados para os filtros selecionados. </div>`);
      } else {
        _push(`<div class="overflow-x-auto w-full"><table class="w-full text-sm text-left"><thead class="bg-gray-50 dark:bg-zinc-900 text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800"><tr><th class="px-4 py-3">Data</th><th class="px-4 py-3">Descrição</th><th class="px-4 py-3">Valor</th><th class="px-4 py-3 text-center">Classificação</th><th class="px-4 py-3 text-center">Ações</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-zinc-800"><!--[-->`);
        ssrRenderList(filteredHistory.value, (tx) => {
          _push(`<tr class="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors"><td class="px-4 py-3 font-mono text-gray-500 dark:text-zinc-400 whitespace-nowrap">${ssrInterpolate(formatDate(tx.transaction_date))}</td><td class="px-4 py-3 whitespace-normal break-words max-w-[150px] sm:max-w-xs"><div class="font-medium text-gray-950 dark:text-white">${ssrInterpolate(tx.description)}</div>`);
          if (tx.fit_id) {
            _push(`<div class="text-[10px] text-gray-400 dark:text-zinc-500 font-mono mt-0.5"> FITID: ${ssrInterpolate(tx.fit_id)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="${ssrRenderClass([[tx.amount > 0 ? "text-emerald-500" : "text-rose-500"], "px-4 py-3 font-semibold font-mono whitespace-nowrap"])}"> R$ ${ssrInterpolate(formatCurrency(tx.amount))}</td><td class="px-4 py-3"><div class="flex justify-center gap-1">`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            variant: tx.classification === "business_pj" ? "solid" : "outline",
            color: "emerald",
            onClick: ($event) => handleReclassifySaved(tx.id, "business_pj")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` PJ `);
              } else {
                return [
                  createTextVNode(" PJ ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            variant: tx.classification === "personal_pf" ? "solid" : "outline",
            color: "sky",
            onClick: ($event) => handleReclassifySaved(tx.id, "personal_pf")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` PF `);
              } else {
                return [
                  createTextVNode(" PF ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            variant: tx.classification === "transfer" ? "solid" : "outline",
            color: "gray",
            onClick: ($event) => handleReclassifySaved(tx.id, "transfer")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Neutro `);
              } else {
                return [
                  createTextVNode(" Neutro ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></td><td class="px-4 py-3"><div class="flex justify-center">`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            color: "red",
            variant: "light",
            icon: "i-heroicons-trash",
            class: "flex items-center gap-1 font-medium",
            onClick: ($event) => openDeleteDialog(tx.id)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Excluir `);
              } else {
                return [
                  createTextVNode(" Excluir ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: isImportModalOpen.value,
        "onUpdate:modelValue": ($event) => isImportModalOpen.value = $event,
        "prevent-close": "",
        ui: { width: "sm:max-w-2xl md:max-w-3xl lg:max-w-4xl" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl"${_scopeId}><div class="p-6 pb-4 border-b border-gray-200 dark:border-zinc-800 shrink-0"${_scopeId}><h3 class="text-lg font-bold text-gray-900 dark:text-white"${_scopeId}>Conciliação de Extrato OFX</h3><p class="text-xs text-gray-500 mt-1"${_scopeId}> Origem selecionada: <span class="font-semibold"${_scopeId}>${ssrInterpolate(activeSource.value === "checking_account" ? "Conta Corrente" : "Cartão de Crédito")}</span></p></div><div class="p-6 overflow-y-auto space-y-4 flex-1"${_scopeId}>`);
            if (tempTransactions.value.length === 0) {
              _push2(`<form class="space-y-4 py-4"${_scopeId}><div class="border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-gray-50 dark:bg-zinc-900/50"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-cloud-arrow-up",
                class: "h-8 w-8 text-gray-400 animate-pulse"
              }, null, _parent2, _scopeId));
              _push2(`<div${_scopeId}><label for="ofxFile" class="cursor-pointer text-sm font-semibold text-emerald-500 hover:underline"${_scopeId}> Clique para selecionar o arquivo </label><p class="text-xs text-gray-500 mt-1"${_scopeId}>Apenas arquivos no formato .ofx</p></div><input id="ofxFile" type="file" accept=".ofx" required class="hidden"${_scopeId}>`);
              if (file.value) {
                _push2(`<p class="text-xs font-mono bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-2.5 py-1 rounded-md text-gray-700 dark:text-zinc-300 mt-2"${_scopeId}>${ssrInterpolate(file.value.name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              _push2(ssrRenderComponent(_component_UButton, {
                type: "submit",
                block: "",
                loading: importLoading.value,
                disabled: !file.value
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Carregar Extrato `);
                  } else {
                    return [
                      createTextVNode(" Carregar Extrato ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</form>`);
            } else {
              _push2(`<div class="space-y-4"${_scopeId}><div class="border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900"${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="w-full text-sm text-left"${_scopeId}><thead class="bg-gray-50 dark:bg-zinc-950 text-xs font-semibold uppercase text-gray-500"${_scopeId}><tr${_scopeId}><th class="px-4 py-3"${_scopeId}>Data</th><th class="px-4 py-3"${_scopeId}>Descrição</th><th class="px-4 py-3"${_scopeId}>Valor</th><th class="px-4 py-3 text-center"${_scopeId}>Classificação</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-zinc-800"${_scopeId}><!--[-->`);
              ssrRenderList(tempTransactions.value, (tx, index) => {
                _push2(`<tr class="${ssrRenderClass([
                  tx.is_duplicate ? "bg-amber-500/5 opacity-70" : tx.classification === "business_pj" ? "bg-emerald-500/5 border-l-2 border-l-emerald-500" : tx.classification === "personal_pf" ? "bg-sky-500/5 border-l-2 border-l-sky-500" : tx.classification === "transfer" ? "bg-zinc-500/5 border-l-2 border-l-zinc-500" : ""
                ])}"${_scopeId}><td class="px-4 py-3 font-mono text-gray-500 dark:text-zinc-400 whitespace-nowrap"${_scopeId}>${ssrInterpolate(formatDate(tx.transaction_date))}</td><td class="px-4 py-3 whitespace-normal break-words max-w-[150px] sm:max-w-xs"${_scopeId}><div class="font-medium flex items-center gap-1.5 flex-wrap"${_scopeId}><span${_scopeId}>${ssrInterpolate(tx.description)}</span>`);
                if (tx.is_duplicate) {
                  _push2(`<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-exclamation-triangle",
                    class: "h-3 w-3"
                  }, null, _parent2, _scopeId));
                  _push2(` Duplicada </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></td><td class="${ssrRenderClass([[tx.amount > 0 ? "text-emerald-500" : "text-rose-500"], "px-4 py-3 font-semibold font-mono whitespace-nowrap"])}"${_scopeId}> R$ ${ssrInterpolate(formatCurrency(tx.amount))}</td><td class="px-4 py-3"${_scopeId}><div class="flex justify-center gap-1"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  size: "xs",
                  variant: tx.classification === "business_pj" ? "solid" : "outline",
                  color: "emerald",
                  onClick: ($event) => handleClassifyTemp(index, "business_pj")
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` PJ `);
                    } else {
                      return [
                        createTextVNode(" PJ ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  size: "xs",
                  variant: tx.classification === "personal_pf" ? "solid" : "outline",
                  color: "sky",
                  onClick: ($event) => handleClassifyTemp(index, "personal_pf")
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` PF `);
                    } else {
                      return [
                        createTextVNode(" PF ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  size: "xs",
                  variant: tx.classification === "transfer" ? "solid" : "outline",
                  color: "gray",
                  onClick: ($event) => handleClassifyTemp(index, "transfer")
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Neutro `);
                    } else {
                      return [
                        createTextVNode(" Neutro ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div></div></div>`);
            }
            _push2(`</div><div class="p-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-900/20 shrink-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "ghost",
              onClick: ($event) => isImportModalOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancelar `);
                } else {
                  return [
                    createTextVNode(" Cancelar ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (tempTransactions.value.length > 0) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "emerald",
                icon: "i-heroicons-check-circle",
                loading: confirmLoading.value,
                onClick: handleConfirmImport
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Confirmar Fechamento `);
                  } else {
                    return [
                      createTextVNode(" Confirmar Fechamento ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl" }, [
                createVNode("div", { class: "p-6 pb-4 border-b border-gray-200 dark:border-zinc-800 shrink-0" }, [
                  createVNode("h3", { class: "text-lg font-bold text-gray-900 dark:text-white" }, "Conciliação de Extrato OFX"),
                  createVNode("p", { class: "text-xs text-gray-500 mt-1" }, [
                    createTextVNode(" Origem selecionada: "),
                    createVNode("span", { class: "font-semibold" }, toDisplayString(activeSource.value === "checking_account" ? "Conta Corrente" : "Cartão de Crédito"), 1)
                  ])
                ]),
                createVNode("div", { class: "p-6 overflow-y-auto space-y-4 flex-1" }, [
                  tempTransactions.value.length === 0 ? (openBlock(), createBlock("form", {
                    key: 0,
                    onSubmit: withModifiers(handleUploadOFX, ["prevent"]),
                    class: "space-y-4 py-4"
                  }, [
                    createVNode("div", { class: "border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-gray-50 dark:bg-zinc-900/50" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-cloud-arrow-up",
                        class: "h-8 w-8 text-gray-400 animate-pulse"
                      }),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "ofxFile",
                          class: "cursor-pointer text-sm font-semibold text-emerald-500 hover:underline"
                        }, " Clique para selecionar o arquivo "),
                        createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "Apenas arquivos no formato .ofx")
                      ]),
                      createVNode("input", {
                        id: "ofxFile",
                        type: "file",
                        accept: ".ofx",
                        required: "",
                        class: "hidden",
                        onChange: handleFileChange
                      }, null, 32),
                      file.value ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs font-mono bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-2.5 py-1 rounded-md text-gray-700 dark:text-zinc-300 mt-2"
                      }, toDisplayString(file.value.name), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode(_component_UButton, {
                      type: "submit",
                      block: "",
                      loading: importLoading.value,
                      disabled: !file.value
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Carregar Extrato ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ], 32)) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900" }, [
                      createVNode("div", { class: "overflow-x-auto" }, [
                        createVNode("table", { class: "w-full text-sm text-left" }, [
                          createVNode("thead", { class: "bg-gray-50 dark:bg-zinc-950 text-xs font-semibold uppercase text-gray-500" }, [
                            createVNode("tr", null, [
                              createVNode("th", { class: "px-4 py-3" }, "Data"),
                              createVNode("th", { class: "px-4 py-3" }, "Descrição"),
                              createVNode("th", { class: "px-4 py-3" }, "Valor"),
                              createVNode("th", { class: "px-4 py-3 text-center" }, "Classificação")
                            ])
                          ]),
                          createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-zinc-800" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(tempTransactions.value, (tx, index) => {
                              return openBlock(), createBlock("tr", {
                                key: index,
                                class: [
                                  tx.is_duplicate ? "bg-amber-500/5 opacity-70" : tx.classification === "business_pj" ? "bg-emerald-500/5 border-l-2 border-l-emerald-500" : tx.classification === "personal_pf" ? "bg-sky-500/5 border-l-2 border-l-sky-500" : tx.classification === "transfer" ? "bg-zinc-500/5 border-l-2 border-l-zinc-500" : ""
                                ]
                              }, [
                                createVNode("td", { class: "px-4 py-3 font-mono text-gray-500 dark:text-zinc-400 whitespace-nowrap" }, toDisplayString(formatDate(tx.transaction_date)), 1),
                                createVNode("td", { class: "px-4 py-3 whitespace-normal break-words max-w-[150px] sm:max-w-xs" }, [
                                  createVNode("div", { class: "font-medium flex items-center gap-1.5 flex-wrap" }, [
                                    createVNode("span", null, toDisplayString(tx.description), 1),
                                    tx.is_duplicate ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                                    }, [
                                      createVNode(_component_UIcon, {
                                        name: "i-heroicons-exclamation-triangle",
                                        class: "h-3 w-3"
                                      }),
                                      createTextVNode(" Duplicada ")
                                    ])) : createCommentVNode("", true)
                                  ])
                                ]),
                                createVNode("td", {
                                  class: ["px-4 py-3 font-semibold font-mono whitespace-nowrap", [tx.amount > 0 ? "text-emerald-500" : "text-rose-500"]]
                                }, " R$ " + toDisplayString(formatCurrency(tx.amount)), 3),
                                createVNode("td", { class: "px-4 py-3" }, [
                                  createVNode("div", { class: "flex justify-center gap-1" }, [
                                    createVNode(_component_UButton, {
                                      size: "xs",
                                      variant: tx.classification === "business_pj" ? "solid" : "outline",
                                      color: "emerald",
                                      onClick: ($event) => handleClassifyTemp(index, "business_pj")
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" PJ ")
                                      ]),
                                      _: 1
                                    }, 8, ["variant", "onClick"]),
                                    createVNode(_component_UButton, {
                                      size: "xs",
                                      variant: tx.classification === "personal_pf" ? "solid" : "outline",
                                      color: "sky",
                                      onClick: ($event) => handleClassifyTemp(index, "personal_pf")
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" PF ")
                                      ]),
                                      _: 1
                                    }, 8, ["variant", "onClick"]),
                                    createVNode(_component_UButton, {
                                      size: "xs",
                                      variant: tx.classification === "transfer" ? "solid" : "outline",
                                      color: "gray",
                                      onClick: ($event) => handleClassifyTemp(index, "transfer")
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Neutro ")
                                      ]),
                                      _: 1
                                    }, 8, ["variant", "onClick"])
                                  ])
                                ])
                              ], 2);
                            }), 128))
                          ])
                        ])
                      ])
                    ])
                  ]))
                ]),
                createVNode("div", { class: "p-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-900/20 shrink-0" }, [
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => isImportModalOpen.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancelar ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  tempTransactions.value.length > 0 ? (openBlock(), createBlock(_component_UButton, {
                    key: 0,
                    color: "emerald",
                    icon: "i-heroicons-check-circle",
                    loading: confirmLoading.value,
                    onClick: handleConfirmImport
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Confirmar Fechamento ")
                    ]),
                    _: 1
                  }, 8, ["loading"])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: isDeleteDialogOpen.value,
        "onUpdate:modelValue": ($event) => isDeleteDialogOpen.value = $event,
        ui: { width: "sm:max-w-[425px]" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800"${_scopeId}><div class="flex items-center gap-2 text-red-600 dark:text-red-500 mb-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-exclamation-triangle",
              class: "h-5 w-5 animate-bounce"
            }, null, _parent2, _scopeId));
            _push2(`<h3 class="text-lg font-bold"${_scopeId}>Excluir Lançamento</h3></div><div class="pt-2 text-sm text-gray-500 dark:text-zinc-400 text-left"${_scopeId}> Você está prestes a excluir esta transação permanentemente. Esta ação atualizará seus relatórios financeiros. </div><p class="text-[11px] text-gray-400 dark:text-zinc-500 pt-1.5 font-semibold text-left"${_scopeId}> Esta ação é irreversível e removerá permanentemente os registros do banco de dados. </p><div class="pt-4 flex justify-end gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "ghost",
              onClick: ($event) => isDeleteDialogOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancelar `);
                } else {
                  return [
                    createTextVNode(" Cancelar ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "red",
              onClick: confirmDelete
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Confirmar Exclusão `);
                } else {
                  return [
                    createTextVNode(" Confirmar Exclusão ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800" }, [
                createVNode("div", { class: "flex items-center gap-2 text-red-600 dark:text-red-500 mb-1" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-exclamation-triangle",
                    class: "h-5 w-5 animate-bounce"
                  }),
                  createVNode("h3", { class: "text-lg font-bold" }, "Excluir Lançamento")
                ]),
                createVNode("div", { class: "pt-2 text-sm text-gray-500 dark:text-zinc-400 text-left" }, " Você está prestes a excluir esta transação permanentemente. Esta ação atualizará seus relatórios financeiros. "),
                createVNode("p", { class: "text-[11px] text-gray-400 dark:text-zinc-500 pt-1.5 font-semibold text-left" }, " Esta ação é irreversível e removerá permanentemente os registros do banco de dados. "),
                createVNode("div", { class: "pt-4 flex justify-end gap-3" }, [
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => isDeleteDialogOpen.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancelar ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    color: "red",
                    onClick: confirmDelete
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Confirmar Exclusão ")
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/receitas/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-lBF4qaSf.js.map
