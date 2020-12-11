import request from "@/utils/request";

export function autoComplete(data) {
  return request({
    url: "/Maps/AutoComplete",
    method: "post",
    data,
  });
}
export function geocode(params) {
  return request({
    url: "/Maps/Geocode",
    method: "get",
    params,
  });
}

export function route(data) {
  return request({
    url: "/Maps/route",
    method: "post",
    data,
  });
}
