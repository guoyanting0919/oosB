import request from "@/utils/request";
export function upload(data) {
  return request({
    url: "/Files/Upload",
    method: "post",
    data,
  });
}

export function getFileById(params) {
  return request({
    url: "/Files/getFile",
    method: "get",
    params,
  });
}
