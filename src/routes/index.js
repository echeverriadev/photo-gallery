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
  const photos = await Photo.find();

  const newPhotos = photos.map(
    ({ title, description, imageURL, public_id }) => {
      const objetico = {
        title,
        description,
        imageURL,
        public_id,
      };

      return objetico;
    }
  );
  res.render('images', { newPhotos });
});

router.get('/image/add', async (req, res) => {
  const photos = await Photo.find();

  const newPhotos = photos.map(
    ({ _id, title, description, imageURL, public_id }) => {
      const objetico = {
        _id,
        title,
        description,
        imageURL,
        public_id,
      };

      return objetico;
    }
  );

  res.render('image_form', { newPhotos });
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

  await newPhoto.save();
  await fs.unlink(req.file.path);
  res.redirect('/');
});

router.get('/image/delete/:photo_id', async (req, res) => {
  const { photo_id } = req.params;
  const photo = await Photo.findByIdAndDelete(photo_id);
  const result = await cloudinary.v2.uploader.destroy(photo.public_id);

  console.log(result);
  res.redirect('/image/add');
});

module.exports = router;
