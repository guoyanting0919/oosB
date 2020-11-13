import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/despatchOfSelfPayUsers/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/despatchOfSelfPayUsers/get",
    method: "get",
    params,
  });
}

export function addOrUpdate(data) {
  return request({
    url: "/despatchOfSelfPayUsers/addOrUpdate",
    method: "post",
    data,
  });
}

// export function update(data) {
//   return request({
//     url: "/despatchOfSelfPayUsers/update",
//     method: "post",
//     data,
//   });
// }

export function remove(data) {
  return request({
    url: "/despatchOfSelfPayUsers/delete",
    method: "post",
    data,
  });
}
