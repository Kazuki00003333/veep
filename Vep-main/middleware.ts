import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // 環境変数から認証情報を取得（デフォルト値も設定）
  const username = process.env.BASIC_AUTH_USERNAME || 'admin'
  const password = process.env.BASIC_AUTH_PASSWORD || 'cross-admin'

  // Basic認証のヘッダーを取得
  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    // Basic認証の値をデコード
    const encodedCredentials = authHeader.replace('Basic ', '')
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8')
    const [providedUsername, providedPassword] = decodedCredentials.split(':')

    // 認証情報をチェック
    if (providedUsername === username && providedPassword === password) {
      return NextResponse.next()
    }
  }

  // 認証が必要な場合、401レスポンスを返す
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 