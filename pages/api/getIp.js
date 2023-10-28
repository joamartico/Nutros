export default async function handler(req, res) {
  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  res.status(200).json({ ip });
}