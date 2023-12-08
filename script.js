const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const sizeInput = document.getElementById('sizeInput');
const typeInput = document.getElementById('typeInput');
const fileTable = document.getElementById('fileTable');

dropZone.addEventListener('dragover', function(e) {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', function() {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', function(e) {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', function(e) {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const fileDetails = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData: e.target.result
      };
      saveFile(fileDetails);
      displayFiles();
    };
    reader.readAsDataURL(file);
  }
}

function saveFile(file) {
  let storedFiles = JSON.parse(localStorage.getItem('storedFiles')) || [];
  storedFiles.push(file);
  localStorage.setItem('storedFiles', JSON.stringify(storedFiles));
}

function displayFiles() {
  fileTable.innerHTML = '';
  const storedFiles = JSON.parse(localStorage.getItem('storedFiles')) || [];
  storedFiles.forEach(function(file) {
    const fileSizeKB = Math.round(file.fileSize / 1024);
    if ((!sizeInput.value || fileSizeKB <= sizeInput.value) &&
        (!typeInput.value || file.fileType === typeInput.value)) {
      const fileDiv = document.createElement('div');
      fileDiv.classList.add('file');
      fileDiv.innerHTML = `
        <p>Название: ${file.fileName}</p>
        <p>Тип: ${file.fileType}</p>
        <p>Размер: ${fileSizeKB} KB</p>
      `;
      if (file.fileType.startsWith('image/')) {
        const image = document.createElement('img');
        image.src = file.fileData;
        fileDiv.appendChild(image);
      }
      fileTable.appendChild(fileDiv);
    }
  });
}

function applyFilters() {
  displayFiles();
}