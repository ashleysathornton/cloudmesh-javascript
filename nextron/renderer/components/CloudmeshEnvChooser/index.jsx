import React from 'react'
import PropTypes from 'prop-types'

const CloudmeshEnvChooser = ({binPath = '', onChange = () => {}}) => {
  console.log('binpath=',typeof binPath, binPath)
  return (
    <>
      <h3>Please choose your Cloudmesh cms binary</h3>
      <input type="file" id="file" name="file" onChange={onChange}/>
      <p>Your Cloudmesh cms binary is currently set to {binPath}</p>
    </>
  )
}

CloudmeshEnvChooser.propTypes = {
  binPath: PropTypes.string,
  onChange: PropTypes.func
}

export default CloudmeshEnvChooser


