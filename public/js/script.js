
// $(document).ready(function () {
    // SIDE-BAR OPENING EVENT
    // const mobileHamburger = document.querySelector('.hamburger-smalldevices');
    // const leftBar = document.querySelector('.left-sidebar');

    $('.hamburger-smalldevices').on('click', function() {
        $('.left-sidebar').toggleClass('left-sidebar-open')
    })
    // mobileHamburger.addEventListener('click', () => {
    //     leftBar.classList.toggle('left-sidebar-open');
    // })
// })



function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this;
        var    args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}

// TOGGLE FULL-SCREEN

function toggle_full_screen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            /* Firefox */
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            /* Chrome, Safari & Opera */
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.msRequestFullscreen) {
            /* IE/Edge */
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            /* Chrome, Safari and Opera */
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}


//left bar accordion expander

console.log("USERNAME ::::::::::::::::", username)
console.log("CSRF ::::::::::::::::", _csrf)
// AES encryption and decryption
async function encryptAes(plainText) {
  console.log('CAlling AES:::::::::')
  const cryptoKey = await getAesKey();
  if (cryptoKey === null) {
    $("#keyGenerationModal").modal("toggle");
    $(document).find('.modal').not('#keyGenerationModal').modal('hide')
    throw new Error("Invalid Key / Key Expired");
  }
  try {
    const _plaintext = new TextEncoder().encode(plainText);
    const bufferText = await window.crypto.subtle.encrypt(
      {
        name: "AES-CTR",
        counter: new Uint8Array(16),
        length: 128,
      },
      cryptoKey,
      _plaintext
    );

    console.log('EEEE')
    // const encryptedText = btoa(
    //   String.fromCharCode.apply(null, new Uint8Array(bufferText))
    // );
return btoa([].reduce.call(new Uint8Array(bufferText),function(p,c){return p+String.fromCharCode(c)},''))
   // return encryptedText;
  } catch (error) {
    console.log('encryptAes error:::::::::', error)
    $("#keyGenerationModal").modal("toggle");
    $(document).find('.modal').not('#keyGenerationModal').modal('hide')
    throw new Error("Invalid Key / Key Expired");
  }
}

async function decryptAes(encodedText) {
  const cryptoKey = await getAesKey();
  if (cryptoKey === null) {
    $("#keyGenerationModal").modal("toggle");
    $(document).find('.modal').not('#keyGenerationModal').modal('hide')
    throw new Error("Invalid Key / Key Expired");
  }
  try {
    const arrayText = Uint8Array.from(atob(encodedText), (c) =>
      c.charCodeAt(0)
    );
    const bufferText = await window.crypto.subtle.decrypt(
      {
        name: "AES-CTR",
        counter: new Uint8Array(16),
        length: 128,
      },
      cryptoKey,
      arrayText
    );

    const decryptedText = new TextDecoder().decode(bufferText);

    return decryptedText;
  } catch (error) {
    console.log("Error", error);
    $("#keyGenerationModal").modal("toggle");
    $(document).find('.modal').not('#keyGenerationModal').modal('hide')
    throw new Error("Invalid Key / Key Expired");
  }
}

async function getAesKey() {
  const aesKeyFromLocal = localStorage.getItem(`${username}aeskey`);
  if (aesKeyFromLocal === null) return null;

  const keyJson = JSON.parse(aesKeyFromLocal);
  if (Date.now() > keyJson.expiry) return null;

  const base64Key = keyJson.key;
  const key = Uint8Array.from(atob(base64Key.split('.')[0]), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    {
      name: "AES-CTR",
    },
    false,
    ["encrypt", "decrypt"]
  );
  return cryptoKey;
}

async function verifyAesKey() {
  console.log("INSIDE VERIFY>>>>>>>>>>.")
  console.log("USERNAME ::::::::::::" , username)
  const aesKeyFromLocal = localStorage.getItem(`${username}aeskey`);
  if (aesKeyFromLocal === null) {
    $(document).find('.modal').not('#keyGenerationModal').modal('hide')
      $("#keyGenerationModal").modal("toggle");
      throw new Error("Invalid Key / Key Expired");
  };

  const keyJson = JSON.parse(aesKeyFromLocal);
  if (Date.now() > keyJson.expiry) {
      localStorage.removeItem('aeskey')
      $(document).find('.modal').not('#keyGenerationModal').modal('hide')
      $("#keyGenerationModal").modal("toggle");
      throw new Error("Invalid Key / Key Expired");
  };

  try {

    const base64Key = keyJson.key;
    const key = Uint8Array.from(atob(base64Key.split('.')[0]), (c) => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    {
      name: "AES-CTR",
    },
    false,
    ["encrypt", "decrypt"]
    );
    return true;
  } catch(err) {
      $("#keyGenerationModal").modal("toggle");
      $(document).find('.modal').not('#keyGenerationModal').modal('hide')
      throw new Error("Invalid Key / Key Expired");
  }
}

async function encryptBuffer(buffer) {
  const cryptoKey = await getAesKey(username);
  if (!cryptoKey) {
    const error = new Error("Key Expired, generate a new key");
    error.code = "401";
    throw error;
  }

  try {
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-CTR",
        counter: iv,
        length: 128,
      },
      cryptoKey,
      buffer
    );
    const encryptedArray = new Uint8Array(encrypted);
    const encryptedBuffer = new Uint8Array(iv.length + encryptedArray.length);
    encryptedBuffer.set(iv);
    encryptedBuffer.set(encryptedArray, iv.length);

    return encryptedBuffer;
  } catch (err) {
    console.log("ERROR<<<<<", err);
    const error = new Error("Invalid or expired key, generate a new key");
    error.code = "401";
    throw error;
  }
}

async function decryptBuffer(encryptedBuffer) {
  const cryptoKey = await getAesKey(username);
  if (!cryptoKey) {
    const error = new Error("Invalid or expired key, generate a new key");
    error.code = "401";
    throw error;
  }

  try {
    const iv = encryptedBuffer.slice(0, 16);
    const encrypted = encryptedBuffer.slice(16);
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-CTR",
        counter: iv,
        length: 128,
      },
      cryptoKey,
      encrypted
    );
    return new Uint8Array(decrypted);
  } catch (err) {
    console.log("ERROR<<<<<", err);
    const error = new Error("Invalid or expired key, generate a new key");
    error.code = "401";
    throw error;
  }
}

function verifyIv(iv) {
try{
    const data = localStorage.getItem(`${username}aeskey`);
    console.log('Local data::::::::',data)
    const keyIv = JSON.parse(data)
    const localIv = keyIv.key.split('.')[1]
    console.log('Local data 1::::::::',iv, localIv)
    if(localIv !== iv) {
      localStorage.removeItem('aeskey')
      $("#keyGenerationModal").modal("toggle");
    $(document).find('.modal').not('#keyGenerationModal').modal('hide')
      throw new Error("Invalid Key / Key Expired");
    } else {
      return true;
    }
  } catch(error){
    console.log('ERROR IN VERIFY', error)
  }
}

function getiv() {
  const data = localStorage.getItem(`${username}aeskey`);
  const keyIv = JSON.parse(data)
  const localIv = keyIv.key.split('.')[1];
  return localIv;
}

function appendBuffer(buffer1, buffer2) {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(buffer1, 0);
  tmp.set(buffer2, buffer1.byteLength);
  return tmp;
}

$(document).on('click','.keyGenerationModal-close', () => {
  console.log("CLICKED:::::::::::::::;;;")
  $("#keyGenerationModal").modal('toggle');
})

let keylength;
let expiryTime = null;
$(document).on('click', '#key-generation-btn', function() {
  console.log(username);

  $.ajax({
      url: '/common/generate-aes-key',
      type: 'POST',
      dataType: 'json',
      beforeSend: function () {
          $(".spinner-grow-signIn").removeClass('d-none');
          ///$(".SignInText").text(' Sending email')
      },
      success: async function(response) {
      console.log("SUCCESS", response)

      if(response.status == 'success') {
        if(response.expiryTime) {
          expiryTime = response.expiryTime;
        }
          let bodyHtml = 
          `<div class="cust-btn-group key-div">
              <div class="cust-input-prepend">
              <i class="fa-solid fa-key"></i>
              </div>
              <input type="text" id="input_key" name="input_key" placeholder="Enter Key" required="">
          </div>
          <div>Key Length: ( <span id="key-input-length">0</span><span> / </span><span id="key-length">${response.keyLength}</span><span> )</span></div>
          <div>key has been sent to your registered email address</div>`
          let footerHtml = `<button class="key-submit-btn btn btn-success">Submit</button>`
          $('.key-modal-body').html(bodyHtml)
          $('.key-modal-footer').html(footerHtml)
      }
      keylength = response.keyLength;
      },
      error: function(error) {
      console.log("SUCCESS", error)
      },
      complete: function () {
          $(".spinner-grow-signIn").addClass('d-none');
      },

  })
})

$(document).on('click','.key-submit-btn', function() {
  const keyValue = $('#input_key').val();

  if(keylength != null) {

  if($("#input_key").val().length !== keylength) {
      createAlert({
          title: "ERROR",
          msg: 'key length does not match',
          type: "negative"
          })
      return;
  }
  }
  console.log("Expiry TIme ::::::::::::", expiryTime)
  $.ajax({
  url: '/common/generate-aes-key-response',
  type: 'POST',
  dataType: 'json',
  data: {message: "success", expiryTime: expiryTime},
  success: function(response) {
      console.log("response", response);
      $('#keyGenerationModal').modal('toggle')

      let aesKeyData = {
              key: keyValue,
              expiry: expiryTime ?? Date.now() + 86400000 // 1 day or time provided by server
          }
      localStorage.setItem(`${username}aeskey`,JSON.stringify(aesKeyData));

      createAlert({
          title: "SUCCESS",
          msg: 'Key Submitted Successfully',
          type: "positive"
      })

      $('.key-modal-body').html(`<div class="p-1">Your key has been expired! Kindly get a new key.</div>
                      <button id="key-generation-btn" class="btn btn-dark login-btn"><i class="fas fa-sign-in-alt"></i><span
                          class="SignInText"> Get Key </span>
                      <span class="spinner-grow spinner-grow-sm spinner-grow-signIn d-none" role="status"
                          aria-hidden="true"></span>
                      <span class="spinner-grow spinner-grow-sm spinner-grow-signIn d-none" role="status"
                          aria-hidden="true"></span>
                      <span class="spinner-grow spinner-grow-sm spinner-grow-signIn d-none" role="status"
                          aria-hidden="true"></span>
                      <span class="visually-hidden">Loading...</span>
                      </button>`)
      $('.key-modal-footer').html('')
  },
  error: function(error) {
    console.log("ERROR::::::::", error)
      $('#keyGenerationModal').modal('toggle')
      createAlert({
          title: "ERROR",
          msg: 'Error in Submitting',
          type: "negative"
      })
  }
  })
})

$(document).on('change paste keyup', '#input_key', function(e) {
  $('#key-input-length').text(e.target.value.length)
})

$(document).ajaxSend(function (event, xhr, settings) {
    xhr.setRequestHeader('x-csrf-token', _csrf)
})