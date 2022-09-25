const phone = (value, helpers) => {
  if(!value){
    return  helpers.message('invalide phone number');
  }
}

const isEmail = (value) => {
  return true
}

module.exports = {
  phone,
  isEmail
}