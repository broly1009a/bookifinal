import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { updateAuthor, getAuthorById } from '../../service/AuthorService';
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import "./single.scss";

const AdminAuthorSingle = () => {
  const [data, setData] = useState({})
  const { authorId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getAuthorById(authorId).then((res) => {
      setData(res.data)
    }).catch(err => {
      console.log(err)
    })
  }, [authorId])

  const handleApprove = () => {
    const confirm = window.confirm("Bạn có chắc chắn muốn duyệt tác giả này?");
    if (!confirm) return;

    const updatedData = {
      ...data,
      state: "ACTIVE"
    };

    updateAuthor(updatedData).then(res => {
      alert("Đã duyệt thành công!");
      navigate('/admin/authors');
    }).catch(err => {
      console.error(err);
      alert("Có lỗi xảy ra khi duyệt!");
    });
  }

  const handleReject = () => {
    const confirm = window.confirm("Bạn có chắc chắn muốn từ chối tác giả này?");
    if (!confirm) return;

    const updatedData = {
      ...data,
      state: "INACTIVE"
    };

    updateAuthor(updatedData).then(res => {
      alert("Đã từ chối!");
      navigate('/admin/authors');
    }).catch(err => {
      console.error(err);
      alert("Có lỗi xảy ra khi từ chối!");
    });
  }

  const handleCancel = () => {
    navigate('/admin/authors')
  }

  const shouldShowButtons = data?.state !== "ACTIVE" && data?.state !== "INACTIVE";

  return (
    <div>
      <div className="single">
        <Sidebar />
        <div className="singleContainer">
          <Navbar />
          <div className="wrapper">
            <div className="function spacing">
              <h3>Chi tiết tác giả</h3>
              <div className="btn-list">
                <button onClick={handleCancel} className="cancel">Quay lại</button>
                {shouldShowButtons && (
                  <>
                    <button onClick={handleReject} className="delete" style={{ marginLeft: '10px' }}>
                      Từ chối
                    </button>
                    <button onClick={handleApprove} className="save" style={{ marginLeft: '10px' }}>
                      Duyệt
                    </button>
                  </>
                )}
                {data?.state === "ACTIVE" && (
                  <span style={{ color: '#28a745', marginLeft: '20px', fontWeight: 'bold' }}>
                    Đã duyệt
                  </span>
                )}
                {data?.state === "INACTIVE" && (
                  <span style={{ color: '#dc3545', marginLeft: '20px', fontWeight: 'bold' }}>
                    Đã từ chối
                  </span>
                )}
              </div>
            </div>

            <Grid container spacing={2} className='spacing'>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="name"
                  name="name"
                  label="Tên tác giả"
                  fullWidth
                  value={data.name || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="company"
                  name="company"
                  label="Công ty"
                  fullWidth
                  value={data.company || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="state"
                  name="state"
                  label="Trạng thái"
                  fullWidth
                  value={data.state === 'ACTIVE' ? 'Đã duyệt' : 'Chờ duyệt'}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAuthorSingle;
