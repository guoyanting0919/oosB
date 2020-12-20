import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/{{$controler}}/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/{{$controler}}/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/{{$controler}}/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/{{$controler}}/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/{{$controler}}/delete",
    method: "post",
    data,
  });
}
