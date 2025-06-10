import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const VideoUpload = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    console.log(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a video to upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)

    try {
      axios.post('http://164.52.195.176:4500/api/upload', formData)

      // const data = await response.json()
      // if (response.ok) {
      //   setVideoUrl(`https://backend-2-rkqo.onrender.com/api/videos/${data.file.filename}`)
      //   toast.success('Video Uploaded Successfully!')
      // } else {
      //   toast.error('Error uploading video')
      // }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Upload a Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>

      {videoUrl && (
        <div>
          <h3>Uploaded Video:</h3>
          <video width="400" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  )
}

export default VideoUpload
