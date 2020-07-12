export const generateBase64FromImage = image => {
  const reader = new FileReader();
  const promise = new Promise((res, rej) => {
    reader.onload = e => res(e.target.result);
    reader.onerror = err => rej(err);
  });
  reader.readAsDataURL(image);
  return promise;
}

export const showedAvatar = (avatarA, avatarB) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (avatarA) return avatarA[0] === 'i' ? `${backendUrl}/${avatarA}` : avatarA;
  if (avatarB) return avatarB[0] === 'i' ? `${backendUrl}/${avatarB}` : avatarB;
  return 'https://image.shutterstock.com/image-vector/person-gray-photo-placeholder-man-260nw-1259815156.jpg';
}

export const updateGeneralStyle = (theme) => {
  let pickedTheme;
  switch (theme) {
    case 'sky':
      pickedTheme = 'sky';
      break;
    case 'dark':
      pickedTheme = 'dark';
      break;
    default:
      pickedTheme = 'classic';
  }
  document.body.className = '';
  document.body.classList.add(pickedTheme);
}


export const validateInput = (type, value, state) => {
  const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  const validUser = /^(?=[a-zA-Z0-9._]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  //eslint-disable-next-line
  const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (type !== 'message') {
    if (value.trim() === '') {
      return `The ${type === 'cpassword' ? 'password confirmation' : type} cannot be empty or consist of spaces`
    }

  }
  switch (type) {
    case 'thought':
    case 'comment':
    case 'status':
      if (value.length < 1 || value.length > 280) {
        return `The ${type} should be at least 1 characters long`;
      }
      break;
    case 'password':
      if (!strongPw.test(value)) {
        return `Password should be 8 characters long and must contain at least one number, one uppercase alphabetical character and one lowercase alphabetical character`
      }
      break;
    case 'cpassword':
      if (state.password !== value) {
        return 'Password and Confirm password must match';
      }
      break;
    case 'username':
      if (!validUser.test(value)) {
        return 'Username should not start or end with symbols, should be at least 5 characters long to a maximum of 15 characters long';
      }
      break;
    case 'name':
      if (value.length < 3 || value.length > 15) {
        return "Name should be at least 3 characters and shouldn't have more than 15 characters";
      }
      if (/\d/.test(value)) {
        return "Name should not contain numbers";
      }
      break;
    case 'email':
      if (!validEmail.test(value.toLowerCase())) {
        return 'Email is not valid';
      }
      break;
    case 'message':
      if (value.title.trim() === '' || value.content.trim() === '') {
        return 'All fields should be completed';
      }
      if (value.content.length > 560 || value.title.length > 60) {
        return 'Message content or title too long';
      }
      break;
    default:
      return false;
  }
  return false;
}


export const calculateCharsLeft = (text, num) => {
  return text.length <= num
    ? Math.abs(text.length - num)
    : `-${Math.abs(text.length - num)}`;
};

export const driveHome = (history) => {
  setTimeout(() => history.push('/'), 3500)
};