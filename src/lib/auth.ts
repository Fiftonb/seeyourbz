import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const key = new TextEncoder().encode(process.env.JWT_SECRET)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function login(formData: FormData) {
  // 验证用户凭据
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 这里应该验证用户信息
  // 暂时简化处理
  const user = { id: '1', email, name: 'Test User' }

  // 创建session (只传用户信息，过期时间由JWT自己管理)
  const session = await encrypt({ user })

  // 保存session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  cookies().set('session', session, { expires, httpOnly: true })
}

export async function logout() {
  // 销毁session
  cookies().set('session', '', { expires: new Date(0) })
}

export async function getSession() {
  try {
    const session = cookies().get('session')?.value
    if (!session) return null
    return await decrypt(session)
  } catch (error) {
    // JWT过期或无效时，清除cookie并返回null
    console.log('Session invalid or expired, clearing cookie')
    cookies().set('session', '', { expires: new Date(0) })
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  // 刷新session
  const parsed = await decrypt(session)
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt({ user: parsed.user }), // 只传用户信息，重新生成JWT
    httpOnly: true,
    expires: expires,
  })
  return res
} 