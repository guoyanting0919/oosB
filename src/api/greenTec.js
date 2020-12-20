import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/TechnologyDraftss/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/TechnologyDraftss/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/TechnologyDraftss/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/TechnologyDraftss/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/TechnologyDraftss/delete",
    method: "post",
    data,
  });
}

export function summaryStatus(data) {
  return request({
    url: "/TechnologyDraftss/ChageInitStatus",
    method: "post",
    data,
  });
}

export function reviewStatus(data) {
  return request({
    url: "/TechnologyDraftss/ChageStatus",
    method: "post",
    data,
  });
}
