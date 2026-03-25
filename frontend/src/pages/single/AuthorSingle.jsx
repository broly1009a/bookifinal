import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { updateAuthor, getAuthorById } from "../../service/AuthorService";
import { useParams, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SidebarManager from "../../components/sidebar/SidebarManager";
const AuthorSingle = () => {
  const [data, setData] = useState({});
  const { id } = useParams();
  const location = useLocation();
  const isManager = location.pathname.startsWith('/manager');
  const isAdmin = location.pathname.startsWith('/admin');
  const basePath = isManager ? '/manager/authors' : isAdmin ? '/admin/authors' : '/authors';
  const [errors, setErrors] = useState([]);

  const handleCancel = () => {
    window.location.replace(basePath);
  };

  const handleSave = () => {
    const validationErrors = [];

    // Name: chỉ chữ + khoảng trắng (KHÔNG số)
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

    // Company: chữ + số + khoảng trắng
    const companyRegex = /^[a-zA-ZÀ-ỹ0-9\s]+$/;

    // Validate name
    if (!data.name || data.name.trim() === "") {
      validationErrors.push("Tên tác giả không được để trống");
    } else if (!nameRegex.test(data.name)) {
      validationErrors.push(
        "Tên tác giả không được chứa số hoặc ký tự đặc biệt",
      );
    }

    // Validate company
    if (data.company && !companyRegex.test(data.company)) {
      validationErrors.push("Tên công ty không được chứa ký tự đặc biệt");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    updateAuthor(data)
      .then((res) => {
        if (res.status === 200) {
          window.location.replace(basePath);
        } else {
          setErrors(["Có lỗi xảy ra khi cập nhật tác giả. Vui lòng thử lại."]);
        }
      })
      .catch((err) => {
  if (err.response && err.response.data) {
    const backendData = err.response.data;

    let errorMessages = [];

    // 🔥 CASE 1: backend trả string
    if (typeof backendData === "string") {
      errorMessages = [backendData];
    }
    // 🔥 CASE 2: backend trả object {error: "..."} hoặc {message: "..."}
    else if (typeof backendData === "object") {
      errorMessages = Object.values(backendData);
    }

    setErrors(errorMessages);
  } else {
    setErrors(["Có lỗi xảy ra khi cập nhật tác giả. Vui lòng thử lại."]);
  }
});
  };

  useEffect(() => {
    getAuthorById(id).then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div>
      <div className="single">
        {isManager ? <SidebarManager /> : <Sidebar />}
        {data.length !== 0 && (
          <div className="singleContainer">
            <Navbar />
            <div className="wrapper">
              <div className="function spacing">
                <h3>Update Author</h3>
                <div className="btn-list">
                  {errors.length > 0 && (
                    <div style={{ color: "red", marginRight: "20px" }}>
                      {errors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}
                  <button onClick={handleCancel} className="cancel">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="save">
                    Save
                  </button>
                </div>
              </div>

              <Grid container spacing={2} className="spacing">
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
                    value={data.company || ""}
                    onChange={(e) =>
                      setData({ ...data, company: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorSingle;
