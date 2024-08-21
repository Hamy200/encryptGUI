
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";


export default function Encrypt() {

  const [fileNames, setFileNames] = useState<string[]>([])
  const [filePaths, setFilePaths] = useState<string[]>([])
  const [password, setPassword] = useState("")
  const [res, setRes] = useState("")
  const [error, setError] = useState("")

  async function getFileName(path: String) {
    const parts = path.split("/") || path.split("\\")
    return parts[parts.length - 1]
  }

  async function chooseFiles() {
    const res: string[] = JSON.parse(await invoke("choose_file", { name: "Hi" }))
    const resFileNames = await Promise.all(
      res.map(async (e) => await getFileName(e))
    )
    setFileNames(resFileNames)
    setFilePaths(res)
  }

  async function decrypt() {
    try{
      const res: {error: boolean, message: string} = await invoke("decrypt", {filePaths, password})
      
      if(res.error)
      {
        setRes("")
        setError(res.message)
      }
      else 
      {
        setError("")
        setRes(res.message)
      }
    }
    catch(e){
      setRes("")
      setError("An unkown error occurred")
    }
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <button className="btn hover:border-gray-500" onClick={async () => await chooseFiles()}>Pick Files</button>
      <div className="flex flex-col ">
        {filePaths.length > 0 && <h1 className="text-2xl font-bold">Files picked: </h1>}
        <ul className=" list-disc">
          {fileNames.map(e =>
            <li className="text-lg">
              {e}
            </li>)}
        </ul>
      </div>

      {filePaths.length > 0 &&
        <form onSubmit={e=>e.preventDefault()} className="flex flex-col gap-3">
          <div className="flex flex-col" >
            <label htmlFor="password" className="font-bold mr-2">Password:</label>
            <input required onChange={e => setPassword(e.target.value)} value={password} id="password" name="password" type="password" className="input input-bordered" />
          </div>

          
          {error && <h2 className="text-red-500 font-bold">{error}</h2>}
          {res && <h2 className="text-green-500 font-bold">{res}</h2>}
          <div>
            <button onClick={async () => await decrypt()} className="w-full btn hover:text-white hover:bg-gray-700 bg-gray-500 text-black hover:border-white">Decrypt</button>
          </div>
        </form>}

    </div>
  )
}


