import { useFormik } from 'formik'
import React, { useState } from 'react'
import { decrypt, encrypt } from '../../utils/Common';

function EncDec() {
    const [encrypted, setEncrypted] = useState("");
    const [decrypted, setDecrypted] = useState("");
    const [Lowercase, setLowercase] = useState("");
    const {values, setFieldValue} = useFormik({
        initialValues:{
            encryptTxt: "",
            decryptTxt: "",
            lowercased: "",
        }
    });

    const handleEnc = (e) => {
        const en = encrypt(e.target.value.trim());
        const lo = e.target.value.toLowerCase()
        setFieldValue("encryptTxt", e.target.value);
        setFieldValue("lowercased", lo);
        setEncrypted(en);
        setLowercase(lo);
    }

    const handleDec = (e) => {
        const de = decrypt(e.target.value);
        setFieldValue("decryptTxt", e.target.value);
        setDecrypted(de);
    }

  return (
    <div>
        Encrypt:
        <input type='text' name='encryptTxt' value={values.encryptTxt} onChange={handleEnc} />
        : <span>{encrypted}</span>
        <br />
        <span>{Lowercase}</span>
        <br />
        Decrypt:
        <input type='text' name='decryptTxt' value={values.decryptTxt} onChange={handleDec} />
        : <span>{decrypted}</span>
    </div>
  )
}

export default EncDec