import React, { useEffect, useRef, useState } from 'react'
import Identity from '../../helpers/Identity'
import { useAuth } from '../../helpers/use-auth-client'
import { toast } from 'react-toastify'

export const LoginPage = () => {
  const { isAuthenticated, whoamiActor, principal } = useAuth()
  const [previewImage, setPreviewImage] = useState(null)
  const [imgBlob, setImgBlob] = useState(null)
  const MAX_FILE_SIZE = 1048576
  const userRef = useRef(null)

  useEffect(() => {
    console.log('login', whoamiActor)
    whoamiActor?.getUser([]).then((e) => {
      if (e?.ok) {
        window.location.replace('/')
      } else {
        console.log('Not registered')
      }
    })
  }, [isAuthenticated])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.size <= MAX_FILE_SIZE) {
      const urlCreator = window.URL || window.webkitURL
      const url = urlCreator.createObjectURL(file)
      setPreviewImage(url)
      // Convert the selected image to a Blob

      // Perform upload logic with the Blob object
      const reader = new global.FileReader()
      reader.onloadend = () => {
        const arrayBuffer = reader.result
        console.log(arrayBuffer)
        const uint8Array = new Uint8Array(arrayBuffer)
        console.log('Array value:', uint8Array)
        setImgBlob(uint8Array)
      }
      reader.readAsArrayBuffer(file)
    } else {
      console.log('No file selected')
    }
  }

  const handleRegister = () => {
    whoamiActor.addUser(userRef.current.value, principal, imgBlob).then((e) => {
      toast('Succesfully Registered')
      window.location.replace('/')
    })
  }

  return (
    <div className='row d-flex justify-content-center align-items-center' style={{ height: '90vh', width: '100vw' }}>
      <div className='col-4'>
        <div className='card bg-dark'>
          <div className='card-header'>
            <h3 className='text-light text-center'>Login with Internet Identity</h3>
          </div>
          <div className='card-body'>
            <div className='row d-flex justify-content-center'>
              <h3 className='text-center'>User Registration</h3>
              <div className='col-8'>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt='Preview'
                    className='img-preview'
                    style={{ maxWidth: '100%', marginTop: '10px' }}
                  />
                )}
                <div className='input-group mb-3'>
                  <input type='text' className='form-control' placeholder='Username' ref={userRef} />
                  <div className='col-6 input-group-prepend'>
                    <label htmlFor='file-input' className='btn btn-primary'>
                      Image
                    </label>
                    <input type='file' id='file-input' accept='image/*' className='col-6 btn btn-primary d-none' onChange={handleFileChange} />
                    <button className='col-6 btn btn-primary' onClick={handleRegister}>Register</button>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <Identity />
            </div>
          </div>
          <div className='card-footer'>
            <p className='text-center'>Motoko Bootcamp @ 2023</p>
          </div>
        </div>
      </div>
    </div>
  )
}
