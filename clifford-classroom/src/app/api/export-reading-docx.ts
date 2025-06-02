export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle DOCX export logic
    res.status(200).json({ message: 'DOCX exported' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 