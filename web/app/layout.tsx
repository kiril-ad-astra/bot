export const metadata = {
  title: 'Sophie Hart | Tu enfermera en Miami 💙',
  description: 'Sophie Hart - Enfermera venezolana de 21 años en Miami. Chatea con ella.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
