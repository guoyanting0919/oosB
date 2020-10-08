import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // Progress 進度條
import "nprogress/nprogress.css"; // Progress 進度條樣式
import { Message } from "element-ui";
import { getToken } from "@/utils/auth"; // 驗權
import Layout from "@/views/layout/Layout";
let secondRouter = [];
let secondRouterObj = [];
let routerMappingList = [
  {
    path: "/allorder/index",
    title: "預約訂單 / 全部資料",
  },
  {
    path: "/todayorder/index",
    title: "預約訂單 / 本日任務",
  },
  {
    path: "/alluser/index",
    title: "個案資料 / 全部個案",
  },
  {
    path: "/driver/index",
    title: "司機車輛管理 / 司機資料",
  },
  {
    path: "/car/index",
    title: "司機車輛管理 / 車輛資料",
  },
];
let elementMappingList = ["add", "edit", "detail", "dispatch", "dispatchA"];

const whiteList = [
  "/login",
  "/oidc-callback",
  "/swagger",
  "/usermanager/profile",
  "/404",
  "/401",
]; // 不重定向白名單

router.beforeEach((to, from, next) => {
  NProgress.start();

  store
    .dispatch("GetIdentityAuth")
    .then((isIdentity) => {
      if (isIdentity) {
        // 採用Identity認證
        // 如果是oidcRedirect必須進入授權
        // 沒登錄時，如果是白名單頁面，可以直接訪問
        // 沒登錄時，如果是非登錄頁面，則跳轉到登錄
        if (store.getters.oidcUser == null && to.path !== "/oidcRedirect") {
          if (whiteList.indexOf(to.path) !== -1) {
            next();
            return;
          } else {
            next("/login");
            return;
          }
        }

        store.dispatch("oidcCheckAccess", to).then(function(hasAccess) {
          if (!hasAccess) {
            return;
          }
          if (to.path === "/login") {
            // 登錄後login自動跳轉
            next({ path: "/" });
            return;
          }
          if (store.getters.modules != null) {
            next();
            return;
          }
          store.dispatch("GetModulesTree").then((modules) => {
            // 獲取用戶可訪問的模塊
            store.dispatch("GenerateRoutes", { modules }).then(() => {
              // 根據權限生成可訪問的路由表
              store.dispatch("GetDefaultOrg");
              router.addRoutes(store.getters.addRouters); // 動態添加可訪問路由表
              next({ ...to, replace: true }); // hack方法 確保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            });
          });
        });
      } else {
        // 普通登錄方式
        if (getToken()) {
          if (to.path === "/login") {
            // 登錄後login自動跳轉
            next({ path: "/" });
            return;
          }
          if (store.getters.modules != null) {
            next();
            return;
          }

          store
            .dispatch("GetInfo")
            .then(() => {
              // 拉取用戶信息
              store.dispatch("GetModulesTree").then((modules) => {
                // 獲取用戶可訪問的模塊
                store.dispatch("GenerateRoutes", { modules }).then(() => {
                  // 根據權限生成可訪問的路由表
                  store.dispatch("GetDefaultOrg");

                  store.getters.addRouters.forEach((pr) => {
                    pr.children.forEach((cr) => {
                      secondRouterObj.push(cr);
                      secondRouter.push(cr.path);
                    });
                  });

                  // console.log(secondRouter, secondRouterObj);
                  routerMappingList.forEach((mr) => {
                    // console.log(mr);
                    // 新的
                    let arr = [];
                    if (secondRouter.includes(mr.path)) {
                      let parentPath = mr.path.split("/")[1];
                      arr = secondRouterObj.filter((o) => {
                        return o.path == mr.path;
                      });
                      // console.log(arr[0].meta.elements);
                      let adr = [];
                      arr[0].meta.elements.forEach((el) => {
                        if (elementMappingList.includes(el.domId))
                          if (adr.length == 0) {
                            // console.log(el.domId);
                            // console.log("adr");
                            adr = [
                              {
                                path: `/${parentPath}`,
                                component: Layout,
                                name: mr.title,
                                redirect: "noredirect",
                                hidden: true,
                                meta: {
                                  notauth: true,
                                  noCache: true,
                                },
                                children: [
                                  {
                                    path: `${el.domId}/:id`,
                                    component: () =>
                                      import(
                                        `@/views/${parentPath}/${el.domId}`
                                      ),
                                    name: `${parentPath}${el.domId}`,
                                    hidden: true,
                                    meta: {
                                      notauth: true,
                                      noCache: true,
                                      title: el.name,
                                    },
                                  },
                                ],
                              },
                            ];
                          } else {
                            let obj = {
                              path: `${el.domId}/:id`,
                              component: () =>
                                import(`@/views/${parentPath}/${el.domId}`),
                              name: `${parentPath}${el.domId}`,
                              hidden: true,
                              meta: {
                                notauth: true,
                                noCache: true,
                                title: el.name,
                              },
                            };
                            adr[0].children.push(obj);
                          }
                      });
                      // console.log(adr);
                      router.addRoutes(adr);
                    }

                    // 舊的
                    // let arr = [];
                    // if (secondRouter.includes(mr.path)) {
                    //   arr = secondRouterObj.filter((o) => {
                    //     return o.path == mr.path;
                    //   });
                    //   let arr2 = [];
                    //   arr[0].meta.elements.forEach((el) => {
                    //     arr2.push(el.domId);
                    //   });
                    //   console.log(arr2);
                    //   let parentPath = mr.path.split("/")[1];
                    //   if (arr2.includes("editBtn") && arr2.includes("addBtn")) {
                    //     console.log(parentPath, "hasEditBtn,hasAddBtn");
                    //     let adr = [
                    //       {
                    //         path: `/${parentPath}`,
                    //         component: Layout,
                    //         name: mr.title,
                    //         redirect: "noredirect",
                    //         hidden: true,
                    //         meta: {
                    //           notauth: true,
                    //           noCache: true,
                    //         },
                    //         children: [
                    //           {
                    //             path: `edit/:id`,
                    //             component: () =>
                    //               import(`@/views/${parentPath}/edit`),
                    //             name: `${parentPath}編輯`,
                    //             hidden: true,
                    //             meta: {
                    //               notauth: true,
                    //               noCache: true,
                    //               title: `編輯`,
                    //             },
                    //           },
                    //           {
                    //             path: `add/:id`,
                    //             component: () =>
                    //               import(`@/views/${parentPath}/add`),
                    //             name: `${parentPath}新增`,
                    //             hidden: true,
                    //             meta: {
                    //               notauth: true,
                    //               noCache: true,
                    //               title: `新增`,
                    //             },
                    //           },
                    //         ],
                    //       },
                    //     ];
                    //     // console.log(adr);
                    //     router.addRoutes(adr);
                    //   } else if (arr2.includes("editBtn")) {
                    //     console.log(parentPath, "hasEditBtn");
                    //     let adr = [
                    //       {
                    //         path: `/${parentPath}`,
                    //         component: Layout,
                    //         name: mr.title,
                    //         redirect: "noredirect",
                    //         hidden: true,
                    //         meta: {
                    //           notauth: true,
                    //           noCache: true,
                    //         },
                    //         children: [
                    //           {
                    //             path: `edit/:id`,
                    //             component: () =>
                    //               import(`@/views/${parentPath}/edit`),
                    //             name: `${parentPath}編輯`,
                    //             hidden: true,
                    //             meta: {
                    //               notauth: true,
                    //               noCache: true,
                    //               title: `編輯`,
                    //             },
                    //           },
                    //         ],
                    //       },
                    //     ];
                    //     // console.log(adr);
                    //     router.addRoutes(adr);
                    //   } else if (arr2.includes("addBtn")) {
                    //     console.log(parentPath, "hasAddBtn");
                    //     let adr = [
                    //       {
                    //         path: `/${parentPath}`,
                    //         component: Layout,
                    //         name: mr.title,
                    //         redirect: "noredirect",
                    //         hidden: true,
                    //         meta: {
                    //           notauth: true,
                    //           noCache: true,
                    //         },
                    //         children: [
                    //           {
                    //             path: `add/:id`,
                    //             component: () =>
                    //               import(`@/views/${parentPath}/add`),
                    //             name: `${parentPath}新增`,
                    //             hidden: true,
                    //             meta: {
                    //               notauth: true,
                    //               noCache: true,
                    //               title: `新增`,
                    //             },
                    //           },
                    //         ],
                    //       },
                    //     ];
                    //     // console.log(adr);
                    //     router.addRoutes(adr);
                    //   }
                    // }
                  });
                  router.addRoutes(store.getters.addRouters); // 動態添加可訪問路由表

                  next({ ...to, replace: true }); // hack方法 確保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                });
              });
            })
            .catch((err) => {
              store.dispatch("FedLogOut").then(() => {
                Message.error(err || "獲取用戶信息失敗");
                next({ path: "/" });
              });
            });

          return;
        }
        if (whiteList.indexOf(to.path) !== -1) {
          // 沒登錄情況下過濾白名單
          next();
        } else {
          next("/login");
        }
      }
    })
    .catch((err) => {
      Message.error(err || "獲取服務器登錄方式失敗");
    });
});

router.afterEach(() => {
  NProgress.done(); // 結束Progress
});
