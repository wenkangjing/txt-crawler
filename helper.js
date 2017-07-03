function escapeFileName(fileName) {
  return fileName.trim().toLowerCase().replace(/[[\]{}()*?.,\\^$|#\s]/g, '_');
}

 module.exports = { escapeFileName };