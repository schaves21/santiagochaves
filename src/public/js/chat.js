const socket = io();

const chatBox = document.getElementById('input-msg');
let emailIngresado = '';

async function main() {
  const { value: email } = await Swal.fire({
    title: 'Enter your email',
    input: 'text',
    inputLabel: 'Your email',
    inputValue: '',
    showCancelButton: false,
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write something!';
      }
    },
  });

  emailIngresado = email;
}

main();

chatBox.addEventListener('keyup', ({ key }) => {
  if (key == 'Enter') {
    socket.emit('msg_chat_front_to_back', {
      message: chatBox.value,
      user: emailIngresado,
    });
    chatBox.value = '';
  }
});

socket.on('listado_de_msgs', (msgs) => {
  const divMsgs = document.getElementById('div-msgs');
  let formato = '';
  msgs.forEach((msg) => {
    formato = formato + '<p>email ' + msg.user + ': ' + msg.message + '</p>';
  });
  divMsgs.innerHTML = formato;
});
