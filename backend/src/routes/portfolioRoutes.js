const express = require('express');
const router = express.Router();
const {
  getCertificates,
  addCertificate,
  deleteCertificate,
  getProjects,
  addProject,
  deleteProject,
  uploadFile,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/certificates', getCertificates);
router.post('/certificates', addCertificate);
router.delete('/certificates/:id', deleteCertificate);

router.get('/projects', getProjects);
router.post('/projects', addProject);
router.delete('/projects/:id', deleteProject);

router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;