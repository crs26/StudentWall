export const messageToObj = (data) => {
  const obj = data
  obj.id = parseInt(data.id)
  obj.message.createdAt = parseInt(data.message.createdAt)
  obj.message.vote = parseInt(data.message.vote)
  data.message.image = blobToImage(data.message.image)
  data.creator.image = blobToImage(data.creator.image)
  data.message.creator = data.message.creator.toString()
  console.log(obj)
  return obj
}

function blobToImage (b) {
  const blob = new global.Blob([b], { type: 'image/jpeg' })
  const urlCreator = window.URL || window.webkitURL
  const url = urlCreator.createObjectURL(blob)
  return url
}
