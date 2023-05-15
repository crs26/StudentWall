import React, { useEffect, useRef, useState } from 'react'
import Identity from '../../helpers/Identity'
import { useAuth } from '../../helpers/use-auth-client'
import { toast } from 'react-toastify'

export const LoginPage = () => {
  const { isAuthenticated, whoamiActor, principal } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const userRef = useRef(null)
  const MAX_FILE_SIZE = 1048576

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

  const handleRegister = () => {
    if (selectedFile) {
      // Convert the selected image to a Blob
      fetch(previewImage)
        .then((response) => response.blob())
        .then((blob) => {
          // Perform upload logic with the Blob object
          const reader = new global.FileReader()
          reader.onloadend = () => {
            const arrayBuffer = reader.result
            const uint8Array = new Uint8Array(arrayBuffer)
            console.log('Array value:', uint8Array)
            whoamiActor.addUser(userRef.current.value, principal, uint8Array).then((e) => {
              toast('Succesfully Registered')
            })
          }
          reader.readAsArrayBuffer(blob)
        })
        .catch((error) => {
          console.error('Error converting to Blob:', error)
        })
    } else {
      console.log('No file selected')
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.size <= MAX_FILE_SIZE) {
      setSelectedFile(file)
      const reader = new global.FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedFile(null)
      setPreviewImage(null)
      toast('Image file is too large')
    }
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
                    <button className='col-6 btn btn-primary' disabled={!isAuthenticated} onClick={handleRegister}>Register</button>
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
