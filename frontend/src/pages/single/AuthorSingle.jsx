import React, { useState, useEffect } from 'react'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { updateAuthor, getAuthorById } from '../../service/AuthorService';
import { FormControl, InputLabel, NativeSelect } from '@mui/material';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import SidebarManager from "../../components/sidebar/SidebarManager"
const AuthorSingle = () => {
  const [data, setData] = useState({})
  const { id } = useParams()
  const [errors, setErrors] = useState([])

  const handleCancel = () => {
    window.location.replace("/authors")
  }

  const handleSave = () => {
    const validationErrors = [];

    // Validate required field
    if (!data.name || data.name.trim() === '') {
      validationErrors.push('Tên tác giả không được để trống');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors([]);

    updateAuthor(data).then(res => {
      if (res.status === 200) {
        window.location.replace("/authors")
      }
      else {
        setErrors(['Có lỗi xảy ra khi cập nhật tác giả. Vui lòng thử lại.']);
      }
    }).catch(err => {
      setErrors(['Có lỗi xảy ra khi cập nhật tác giả. Vui lòng thử lại.']);
    })
  }

  useEffect(() => {
    getAuthorById(id).then((res) => {
      setData(res.data)
    })
  }, [])
  console.log(data)

  return (
    <div>
      <div className="single">
       <SidebarManager/>
        {data.length !== 0 && <div className="singleContainer">
          <Navbar />
          <div className="wrapper">
            <div className="function spacing">
              <h3>Update Author</h3>
              <div className="btn-list">
                {errors.length > 0 && (
                  <div style={{ color: 'red', marginRight: '20px' }}>
                    {errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                )}
                <button onClick={handleCancel} className="cancel">Cancel</button>
                <button onClick={handleSave} className="save">Save</button>
              </div>
            </div>

            <Grid container spacing={2} className='spacing'>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Title"
                  fullWidth
                  autoComplete="off"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="company"
                  name="company"
                  label="Company"
                  fullWidth
                  autoComplete="off"
                  value={data.company || ''}
                  onChange={(e) => setData({ ...data, company: e.target.value })}
                />
              </Grid>
            </Grid>
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default AuthorSingle