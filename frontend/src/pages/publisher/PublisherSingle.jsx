import React, { useState, useEffect } from 'react'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getPublisherById, updatePublisher } from '../../service/PublisherService';
import { FormControl, InputLabel, NativeSelect } from '@mui/material';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
const PublisherSingle = () => {
    const [data, setData] = useState({})
    const { id } = useParams()
    const [errors, setErrors] = useState([])

    const handleCancel = () => {
        window.location.replace("/publishers")
    }

    const handleSave = () => {
        const validationErrors = [];

        // Validate required fields
        if (!data.name || data.name.trim() === '') {
            validationErrors.push('Tên nhà xuất bản không được để trống');
        }
        if (!data.website || data.website.trim() === '') {
            validationErrors.push('Website không được để trống');
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear errors if validation passes
        setErrors([]);

        updatePublisher(data).then(res => {
            if (res.status === 200) {
                window.location.replace("/publishers")
            }
            else {
                setErrors(['Có lỗi xảy ra khi cập nhật nhà xuất bản. Vui lòng thử lại.']);
            }
        }).catch(err => {
            setErrors(['Có lỗi xảy ra khi cập nhật nhà xuất bản. Vui lòng thử lại.']);
        })
    }

    useEffect(() => {
        getPublisherById(id).then((res) => {
            setData(res.data)
        })
    }, [])
    console.log(data)

    return (
        <div>
            <div className="single">
                <Sidebar />
                {data.length !== 0 && <div className="singleContainer">
                    <Navbar />
                    <div className="wrapper">
                        <div className="function spacing">
                            <h3>Update Publisher</h3>
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
                                    label="Publisher"
                                    fullWidth
                                    autoComplete="off"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="website"
                                    name="website"
                                    label="Website"
                                    fullWidth
                                    autoComplete="off"
                                    value={data.website}
                                    onChange={(e) => setData({ ...data, website: e.target.value })}
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

export default PublisherSingle