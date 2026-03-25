import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarManager from "../../components/sidebar/SidebarManager"
const New = ({ inputs, title, handleAdd, location }) => {
  const [data, setData] = useState({})
  const [errors, setErrors] = useState([])
  const currentLocation = useLocation();
  const noSpecialCharRegex = /^[\p{L}\p{N}\s]+$/u;

  const renderSidebar = () => {
    if (currentLocation.pathname.startsWith("/admin")) {
      return <Sidebar />;
    }

    return <SidebarManager />;
  }

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value

    setData({ ...data, [id]: value })
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    
    const validationErrors = [];
    const isCollectionPage = location.includes('/collections');
    const isPublisherPage = location.includes('/publishers');
    const isCategoryPage = location.includes('/categories');

    // Validate required fields
    inputs.forEach(input => {
      if (!data[input.id] || data[input.id].trim() === '') {
        validationErrors.push(`${input.label} không được để trống`);
      }
    });

    // Validate special characters with clear, field-specific messages
    if (isCollectionPage) {
      if (data.name && !noSpecialCharRegex.test(data.name.trim())) {
        validationErrors.push('Tên bộ sưu tập không được chứa ký tự đặc biệt');
      }
      if (data.type && !noSpecialCharRegex.test(data.type.trim())) {
        validationErrors.push('Loại bộ sưu tập không được chứa ký tự đặc biệt');
      }
    }

    if (isPublisherPage) {
      if (data.name && !noSpecialCharRegex.test(data.name.trim())) {
        validationErrors.push('Tên nhà xuất bản không được chứa ký tự đặc biệt');
      }
    }

    if (isCategoryPage) {
      if (data.name && !noSpecialCharRegex.test(data.name.trim())) {
        validationErrors.push('Tên danh mục không được chứa ký tự đặc biệt');
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors([]);

    try {
      await Promise.resolve(handleAdd(data));
      window.location.replace(location)
    } catch (error) {
      setErrors(["Có lỗi xảy ra khi thêm mới. Vui lòng thử lại."]);
    }
  }

  return (
    <div className="new">
      {renderSidebar()}
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
