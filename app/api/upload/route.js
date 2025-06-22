import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable-serverless';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Form parse error' });
    }

    try {
      // Adjust if your frontend uses a different field name:
      const file = files.file; 
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'products',
      });

      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
