import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const logoPath = path.join(process.cwd(), 'public', 'logo.png')
  const logoBuffer = fs.readFileSync(logoPath)
  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#04040a',
          borderRadius: '6px',
        }}
      >
        <img src={logoDataUrl} alt="Logo" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
      </div>
    ),
    { ...size }
  )
}
