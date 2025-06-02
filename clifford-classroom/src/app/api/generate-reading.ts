export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle reading comprehension generation logic
    res.status(200).json({ message: 'Reading comprehension generated' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 