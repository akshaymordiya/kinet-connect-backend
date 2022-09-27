const iterator = (object = {}, keys = [], conditionalCallback = () => {}) => {
  return keys.reduce((obj, key) => {
    console.log("check ", conditionalCallback(key));
    if(conditionalCallback(key)){
      obj[key] = object[key]
    }
    return obj;
  }, {});
}

const pick = (object = {}, keys = []) => {
  return iterator(object, keys, (key) => {
    return key in object
  })
}

const omit = (object = {}, keys = []) => {
  const ObjectKeys = Object.keys(object)
  return iterator(object, ObjectKeys, (key) => {
    return !keys.includes(key)
  })
}

const formateMessage = (string, obj = {}) => {
  let resultedText = string;

  for(let prop in obj) {
    resultedText = resultedText.replace(new RegExp('{'+ prop +'}','g'), obj[prop]);
  }
  
  return resultedText;
}

module.exports = {
  pick,
  omit,
  formateMessage
}