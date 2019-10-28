/*
logo组件
 */
import React from 'react'
import logo from './imgs/logo.jpg'
import './logo.less'

export default function Logo() {
  return (
    <div className='logo-container'>
      <img src={logo} alt="logo" className='logo'/>
    </div>
  )
}