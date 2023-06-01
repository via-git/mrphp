$(document).ready(function() {
  $('#upload-form').on('submit', function(e) {
    e.preventDefault();

    var fileInput = $('#file-input')[0];
    var file = fileInput.files[0];
    var chatId = '1184220694'; // Ganti dengan chat ID tujuan

    var fileNameInput = $('#file-name-input').val(); // Ambil nilai dari input nama file

    var formData = new FormData();
    formData.append('chat_id', chatId);

    var maxFileSize = 5 * 1024 * 1024; // Ukuran file maksimum 5MB
    if (file.size <= maxFileSize) {
      formData.append('document', file, fileNameInput); // Gunakan nilai nama file yang ditentukan

      sendFormData(formData);
    } else {
      splitAndSendZip(file, fileNameInput, maxFileSize);
    }
  });

  function sendFormData(formData) {
    // Tampilkan efek loading
    $('#loading').show();

    // Kirim file menggunakan AJAX
    $.ajax({
      url: 'https://api.telegram.org/bot6072635225:AAHV_Sej8JmCptHtWp3JElwGmAm6RHTpIHA/sendDocument',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        // Sembunyikan efek loading setelah selesai
        $('#loading').hide();
        alert('File berhasil dikirim!');
      },
      error: function(xhr, status, error) {
        // Sembunyikan efek loading jika terjadi kesalahan
        $('#loading').hide();
        alert('Terjadi kesalahan saat mengirim file.');
      }
    });
  }

  function splitAndSendZip(file, fileName, maxSize) {
    var zip = new JSZip();

    var chunkSize = 5 * 1024 * 1024; // Ukuran setiap chunk 5MB

    var totalChunks = Math.ceil(file.size / chunkSize);
    var currentChunk = 0;

    var reader = new FileReader();

    reader.onload = function(event) {
      var chunkName = fileName + '.part' + (currentChunk + 1);

      zip.file(chunkName, event.target.result);

      currentChunk++;

      if (currentChunk < totalChunks) {
        loadNextChunk();
      } else {
        zip.generateAsync({ type: 'blob' })
          .then(function(content) {
            formData.append('document', content, fileName + '.zip');

            sendFormData(formData);
          });
      }
    };

    function loadNextChunk() {
      var start = currentChunk * chunkSize;
      var end = start + chunkSize >= file.size ? file.size : start + chunkSize;

      var chunk = file.slice(start, end);
      reader.readAsArrayBuffer(chunk);
    }

    loadNextChunk();
  }
});
