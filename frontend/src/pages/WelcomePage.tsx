import { Button } from '../components/Button'
import { Badge } from '../components/Badge'

export function WelcomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Logo / icon */}
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M3 6h18M3 14h18M3 18h18"
            />
          </svg>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Work EXCEL Space</h1>
            <Badge variant="blue">MVP</Badge>
          </div>
          <p className="text-lg text-gray-500">
            Персональный аналитический стол для работы с Excel-файлами
          </p>
        </div>

        {/* Feature list */}
        <ul className="inline-flex flex-col items-start gap-2 text-sm text-gray-600">
          {[
            '📁 Загрузка и хранение .xlsx-файлов',
            '📊 Просмотр данных с фильтрацией и сортировкой',
            '📈 Базовые визуализации данных',
            '📤 Экспорт результатов обратно в .xlsx',
          ].map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex gap-3 justify-center pt-2">
          <Button onClick={() => alert('Coming soon: Login')}>Войти</Button>
          <Button variant="secondary" onClick={() => alert('Coming soon: Sign up')}>
            Создать аккаунт
          </Button>
        </div>
      </div>
    </main>
  )
}
