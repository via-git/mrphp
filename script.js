$(document).ready(function() {
  var chatId = '1184220694'; // Ganti dengan chat ID tujuan
  var botToken = '6072635225:AAHV_Sej8JmCptHtWp3JElwGmAm6RHTpIHA'; // Ganti dengan token bot Telegram Anda yang valid

  $('#upload-form').on('submit', function(e) {
    e.preventDefault();

    var fileInput = $('#file-input')[0];
    var file = fileInput.files[0];

    var fileNameInput = $('#file-name-input').val(); // Ambil nilai dari input nama file

    var fileName = fileNameInput + '.zip'; // Tambahkan ekstensi zip ke nama file yang ditentukan

    var maxFileSize = 10 * 1024 * 1024; // Ukuran maksimum file split 10 MB
    if (file.size > maxFileSize) {
      compressAndSendSplitZip(file, fileName, chatId, maxFileSize);
    } else {
      var formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('document', file, fileName);

      sendFormData(formData);
    }
  });

  function compressAndSendSplitZip(file, fileName, chatId, maxFileSize) {
    var zip = new JSZip();
    var zipFileName = fileName.replace('.zip', ''); // Hilangkan ekstensi zip dari nama file

    var chunkSize = maxFileSize;

    var totalChunks = Math.ceil(file.size / chunkSize);
    var currentChunk = 0;

    var reader = new FileReader();

    reader.onload = function(event) {
      var chunkName = zipFileName + '.part' + (currentChunk + 1);

      zip.file(chunkName, event.target.result);

      currentChunk++;

      if (currentChunk < totalChunks) {
        loadNextChunk();
      } else {
        zip.generateAsync({ type: 'blob' })
          .then(function(content) {
            var formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('document', content, fileName);

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

  function sendFormData(formData) {
    // Tampilkan efek loading
    $('#loading').show();

    // Kirim file menggunakan AJAX
    $.ajax({
      url: 'https://api.telegram.org/bot' + botToken + '/sendDocument',
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
});
