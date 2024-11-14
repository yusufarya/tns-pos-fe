// pages/api/revalidate.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { secret, path } = req.body

    // Ganti 'your-secret-token' dengan token yang Anda tentukan
    if (secret !== process.env.REVALIDATE_SECRET) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    try {
      await res.revalidate(path) // Memicu revalidasi untuk path tertentu
      return res.json({ revalidated: true })
    } catch (err) {
      return res.status(500).send('Error revalidating')
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
