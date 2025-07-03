import type * as Auth from "./type"
import type { IBaseResponse } from "@/common/apis/type"
import { request } from "@/http/axios"

/** 获取登录验证码 */
export function getCaptchaApi() {
  return request<IBaseResponse<string>>({
    url: "auth/captcha",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: Auth.LoginRequestData) {
  return request<IBaseResponse<Auth.LoginResponse>>({
    url: "auth/login",
    method: "post",
    data
  })
}
