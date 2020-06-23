const { Router } = require('express');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');
const Photo = require('../models/photo');
const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/', async (req, res) => {
  //esta variable photos es de tipo object
  // const photos = await Photo.find();

  const photos = [
    { title: 'joda', text: 'text a' },
    { title: 'creo', text: 'text b' },
    { title: 'lo consegui', text: 'text c' },
  ];
  console.log(typeof photos);
  res.render('images', { photos });
});

router.get('/image/add', async (req, res) => {
  const photos = await Photo.find();
  res.render('image_form', { photos });
});

router.post('/image/add', async (req, res) => {
  const { title, description } = req.body;

  const result = await cloudinary.v2.uploader.upload(req.file.path);

  const newPhoto = new Photo({
    title,
    description,
    imageURL: result.secure_url,
    public_id: result.public_id,
  });
  console.log(newPhoto.imageURL);
  await newPhoto.save();
  await fs.unlink(req.file.path);
  res.send('recibido');
});

module.exports = router;
