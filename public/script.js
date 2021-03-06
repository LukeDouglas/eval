$(document).ready(function () {
  $('#submitFile').click(function (e) {
    e.preventDefault()
    var fdata = new FormData()
    fdata.append('words', $('#string').val())

    if ($('#file')[0].files.length > 0) { fdata.append('text', $('#file')[0].files[0]) }
    let fileName = $('#file')[0].files[0].name
    // d = $("#add_new_product").serialize();
    $.ajax({
      type: 'POST',
      url: window.location.href+'parser',
      data: fdata,
      contentType: false,
      processData: false,
      success: function (data, status, xhr) {
        var blob = new Blob([data])
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'redacted_'+fileName
        link.click()
      },
      error: function (xhr, message) {
        alert(message)
      }
    })
  })
  console.log('ready!')
})
