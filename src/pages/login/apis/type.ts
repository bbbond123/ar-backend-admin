export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
}

export type CaptchaResponseData = ApiResponseData<string>

export interface User {
  address: string
  apple_id: string
  avatar: string
  birth: string
  created_at: string
  email: string
  gender: string
  google_id: string
  name: string
  name_kana: string
  password: string
  phone_number: string
  provider: string
  status: string
  updated_at: string
  user_id: number
  verify_code: string
  verify_code_expire: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export type LoginResponseData = ApiResponseData<LoginResponseData>
