 document.getElementById('upload-form').addEventListener('submit', function(e) {
  e.preventDefault();

  var fileInput = document.getElementById('file-input');
  var file = fileInput.files[0];
  var chatId = '1184220694'; // Ganti dengan chat ID tujuan

  var formData = new FormData();
  formData.append('file', file);
  formData.append('chat_id', chatId);

  // Kirim file menggunakan AJAX
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.telegram.org/bot6072635225:AAHV_Sej8JmCptHtWp3JElwGmAm6RHTpIHA/sendDocument', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      alert('File berhasil dikirim!');
    } else {
      alert('Terjadi kesalahan saat mengirim file.');
    }
  };
  xhr.send(formData);
});
