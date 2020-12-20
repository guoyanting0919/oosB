import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/industrydraftss/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/industrydraftss/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/industrydraftss/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/industrydraftss/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/industrydraftss/delete",
    method: "post",
    data,
  });
}

export function initStatus(data) {
  return request({
    url: "/industrydraftss/ChageInitStatus",
    method: "post",
    data,
  });
}

export function reviewStatus(data) {
  return request({
    url: "/industrydraftss/ChageReviewStatus",
    method: "post",
    data,
  });
}
