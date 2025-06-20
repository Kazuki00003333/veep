export default function TestPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">テストページ</h1>
      <p className="mt-4 text-gray-600">ブラウザ表示のテスト用ページです。</p>
      <div className="mt-6 p-4 bg-green-100 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800">正常に表示されています！</h2>
        <p className="text-green-700">このページが表示されれば、基本的なルーティングは動作しています。</p>
      </div>
    </div>
  )
} 