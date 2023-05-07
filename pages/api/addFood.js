import fs from 'fs';
import path from 'path';

const foodDataPath = path.join(process.cwd(), 'public', 'foodData_foundation.json');

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const newFoodData = req.body; // Changed from JSON.parse(req.body)
      
      const foodData = JSON.parse(fs.readFileSync(foodDataPath, 'utf8'));
      console.log('api food data: ', foodData)

      foodData.push(newFoodData);
      fs.writeFileSync(foodDataPath, JSON.stringify(foodData, null, 2));

      res.status(200).json({ message: 'Food data saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving food data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
