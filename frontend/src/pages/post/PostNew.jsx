import React, { useState, useEffect, useContext } from 'react'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { createPost, getPostById, getAllPostCategories } from '../../service/PostService';
import { FormControl, InputLabel, NativeSelect, Box } from '@mui/material';
import { getUserInfoByEmail } from '../../service/UserService';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { AuthContext } from '../../context/AuthContext';
import SidebarSale from "../../components/sidebar/SidebarSale"
const PostNew = () => {
    const { currentUser, userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([])
    const [errors, setErrors] = useState([])
    const isSaleRoute = location.pathname.startsWith('/sale');
    const postBasePath = isSaleRoute ? '/sale/posts' : '/admin/posts';
    const [data, setData] = useState({
        title: "",
        content: "",
        category: {
            id: ""
        },
        brief: "",
        thumbnail: "",
        state: "DRAFT",
        user: {
            id: ""
        }
    })

    useEffect(() => {
        console.log("Current User:", currentUser);
        console.log("User Info:", userInfo);
        console.log("Data state:", data);
        getAllPostCategories().then((res) => {
            setCategories(res.data)
        })
        if (userInfo && userInfo.id) {
            console.log("Setting user ID from userInfo:", userInfo.id);
            setData((prevData) => ({...prevData, user: {id: userInfo.id}}))
        }
    }, [userInfo])

    const handleObjectChange = (e) => {
        const { name, value } = e.target;
        if (name === "state") {
            setData({
                ...data,
                state: value
            });
            return;
        }
        setData({
            ...data, [name]: {
                id: Number(value)
            }
        });
    }

    const handleContentChange = (e) => {
        setData({ ...data, content: e.target.value });
    }
    const handleCancel = () => {
        navigate(postBasePath)
    }

    const handleSave = () => {
        const validationErrors = [];

        // Validate required fields
        if (!data.title || data.title.trim() === '') {
            validationErrors.push('Tiêu đề không được để trống');
        }
        if (!data.brief || data.brief.trim() === '') {
            validationErrors.push('Tóm tắt không được để trống');
        }
        if (!data.thumbnail || data.thumbnail.trim() === '') {
            validationErrors.push('Thumbnail không được để trống');
        }
        if (!data.content || data.content.trim() === '') {
            validationErrors.push('Nội dung không được để trống');
        }
        if (!data.category.id) {
            validationErrors.push('Vui lòng chọn danh mục');
        }
        if (!data.state) {
            validationErrors.push('Vui lòng chọn trạng thái');
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear errors if validation passes
        setErrors([]);

        console.log("Saving data:", data);
        createPost(data).then(() => {
            navigate(postBasePath)
        })
        .catch((error) => {
            console.error("Error creating post:", error);
            setErrors(['Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.']);
        })
    }
  return (
    <div>
        <div className="single">
                {isSaleRoute ? <SidebarSale /> : <Sidebar />}
                {data.length !== 0 && <div className="singleContainer">
                    <Navbar />
                    <div className="wrapper">
                        <div className="function spacing">
                            <h3>Add Posts</h3>
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
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    id="title"
                                    name="title"
                                    label="Title"
                                    fullWidth
                                    autoComplete="off"
                                    value={data.title}
                                    onChange={(e) => setData({ ...data, title: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    id="brief"
                                    name="brief"
                                    label="Brief"
                                    fullWidth
                                    autoComplete="off"
                                    value={data.brief}
                                    onChange={(e) => setData({ ...data, brief: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    id="thumbnail"
                                    name="thumbnail"
                                    label="Thumbnail"
                                    fullWidth
                                    autoComplete="off"
                                    value={data.thumbnail}
                                    onChange={(e) => setData({ ...data, thumbnail: e.target.value })}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box sx={{ maxWidth: 250 }} className='spacing'>
                                    <FormControl fullWidth>
                                        <NativeSelect
                                            value={data?.category?.id || ''}
                                            onChange={handleObjectChange}
                                            name="category"
                                        >
                                            <option>--Select category--</option>
                                            {
                                                categories?.map(category => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                ))
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ maxWidth: 250 }} className='spacing'>
                                    <FormControl fullWidth>
                                        <NativeSelect
                                            value={data.state}
                                            onChange={handleObjectChange}
                                            name="state"
                                        >
                                            <option value="DRAFT">DRAFT</option>
                                            <option value="PUBLISHED">PUBLISHED</option>
                                        </NativeSelect>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <textarea
                                    name="content"
                                    value={data.content || ''}
                                    onChange={handleContentChange}
                                    rows={8}
                                    cols={50}
                                    placeholder="Enter content here..."
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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

export default PostNew