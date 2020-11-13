import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/orderOfSelfPayUsers/load",
    method: "get",
    params,
  });
}

export function loadNoOrg(params) {
  return request({
    url: "/orderOfSelfPayUsers/loadNoOrg",
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

export function receive(data) {
  return request({
    url: "/orderOfSelfPayUsers/updateOrgId",
    method: "post",
    data,
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

export function roster(data) {
  return request({
    url: "/despatchOfSelfPayUsers/addOrUpdate",
    method: "post",
    data,
  });
}

export function loadDespatch(params) {
  return request({
    url: "/despatchOfSelfPayUsers/load",
    method: "get",
    params,
  });
}
