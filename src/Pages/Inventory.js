import React from 'react'
import Navbars from "../Components/Navbars";
import NotFound from './Not_found';

export default function Inventory() {
  return (
    <>
        <Navbars title="Inventory"></Navbars>
        <NotFound tabName="Inventory"/>
    </>
  )
}
