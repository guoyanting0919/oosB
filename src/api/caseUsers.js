import request from "@/utils/request";

export function get(params) {
  return request({
    url: "/caseusers/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/caseusers/addorupdate",
    method: "post",
    data,
  });
}
