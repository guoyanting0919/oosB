import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/orderOfSelfPayUsers/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/orderOfSelfPayUsers/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/orderOfSelfPayUsers/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/orderOfSelfPayUsers/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/orderOfSelfPayUsers/delete",
    method: "post",
    data,
  });
}
