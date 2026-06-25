import {QRCodeCanvas} from "qrcode.react"

function QRGenerator({busNumber}){

return(
<div>

<h2>Bus QR</h2>

<QRCodeCanvas value={busNumber} size={200}/>

</div>
)

}

export default QRGenerator