import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/draftss/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/draftss/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/draftss/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/draftss/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/draftss/delete",
    method: "post",
    data,
  });
}
