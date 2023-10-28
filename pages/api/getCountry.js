export default async function handler(req, res) {
  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;

  try {
      const response = await fetch(`https://api.ipapi.com/${ip}?access_key=YOUR_ACCESS_KEY`);
      const data = await response.json();
      const country = data.country_name;
      res.status(200).json({ ip, country });
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch country" });
  }
}
