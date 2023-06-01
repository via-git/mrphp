$(document).ready(function() {
  $('#upload-form').on('submit', function(e) {
    e.preventDefault();

    var fileInput = $('#file-input')[0];
    var file = fileInput.files[0];
    var chatId = '1184220694'; // Ganti dengan chat ID tujuan

    var formData = new FormData();
    formData.append('file', file);
    formData.append('chat_id', chatId);

    // Kirim file menggunakan AJAX
    $.ajax({
      url: 'https://api.telegram.org/bot6072635225:AAHV_Sej8JmCptHtWp3JElwGmAm6RHTpIHA/sendDocument',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        alert('File berhasil dikirim!');
      },
      error: function(xhr, status, error) {
        alert('Terjadi kesalahan saat mengirim file.');
      }
    });
  });
});
