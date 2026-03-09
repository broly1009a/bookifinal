import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import SidebarManager from "../../components/sidebar/SidebarManager"
const New = ({ inputs, title, handleAdd, location }) => {
  const [data, setData] = useState({})
  const [errors, setErrors] = useState([])

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value

    setData({ ...data, [id]: value })
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    
    const validationErrors = [];

    // Validate required fields
    inputs.forEach(input => {
      if (!data[input.id] || data[input.id].trim() === '') {
        validationErrors.push(`${input.label} không được để trống`);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors([]);

    handleAdd(data)
    window.location.replace(location)
  }

  return (
    <div className="new">
     <SidebarManager/>
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          
          <div className="right">
            {errors.length > 0 && (
              <div style={{ color: 'red', marginBottom: '20px' }}>
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
            <form onSubmit={handleAddItem}>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input id={input.id} type={input.type} placeholder={input.placeholder} onChange={handleInput} />
                </div>
              ))}
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
